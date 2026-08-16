import os
import logging
import uuid
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from sqlalchemy import text
from soc_api.routers import incidents, zones, devices, federated, websocket
from soc_api.db.database import init_db
from soc_api.rate_limiter import rate_limiter
from soc_api.ws_manager import ws_manager

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

REQUIRED_ENV_VARS = ["DATABASE_URL", "SOC_API_KEY"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    missing = [v for v in REQUIRED_ENV_VARS if not os.getenv(v)]
    if missing:
        logger.warning(f"Missing environment variables: {', '.join(missing)}")
    init_db()
    yield
    # Graceful shutdown: disconnect all WebSocket clients
    count = ws_manager.connection_count
    if count > 0:
        logger.info(f"Shutting down {count} WebSocket connection(s)")
        await ws_manager.disconnect_all()

app = FastAPI(title="ShieldNet SOC Central API", version="1.0.0", lifespan=lifespan)

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incidents.router)
app.include_router(zones.router)
app.include_router(devices.router)
app.include_router(federated.router)
app.include_router(websocket.router)


@app.middleware("http")
async def security_and_logging(request: Request, call_next):
    import time
    request_id = str(uuid.uuid4())[:8]
    start = time.time()

    # Global rate limiting (skip WebSocket upgrade requests)
    if not request.headers.get("upgrade", "").lower() == "websocket":
        client_ip = request.client.host if request.client else "unknown"
        if not rate_limiter.is_allowed(client_ip):
            return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded"})

    response = await call_next(request)
    elapsed = time.time() - start

    # Security headers
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "0"
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"

    logging.info(f"[{request_id}] {request.method} {request.url.path} -> {response.status_code} ({elapsed:.3f}s)")
    return response


@app.get("/")
async def root():
    return {"service": "ShieldNet SOC API", "status": "operational"}


@app.get("/api/v1/health")
async def health():
    db_status = "unreachable"
    try:
        from soc_api.db.database import get_db
        with get_db() as db:
            db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception:
        db_status = "unreachable"
    return {"status": "ok", "service": "soc-api", "version": "1.0.0", "database": db_status}
