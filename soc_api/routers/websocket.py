from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from soc_api.ws_manager import ws_manager
from soc_api.rate_limiter import rate_limiter
import asyncio
import os

router = APIRouter(tags=["websocket"])

ALLOWED_ORIGINS = set(os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(","))


@router.websocket("/ws/alerts")
async def websocket_alerts(websocket: WebSocket):
    origin = websocket.headers.get("origin", "")
    if origin and origin not in ALLOWED_ORIGINS:
        await websocket.close(code=4001, reason="Origin not allowed")
        return

    client_ip = websocket.client.host if websocket.client else "unknown"
    if not rate_limiter.is_allowed(f"ws:{client_ip}"):
        await websocket.close(code=4002, reason="Rate limited")
        return

    await ws_manager.connect(websocket)
    try:
        while True:
            try:
                await asyncio.wait_for(websocket.receive_text(), timeout=25.0)
            except asyncio.TimeoutError:
                try:
                    await websocket.send_json({"event": "PING"})
                except Exception:
                    break
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)
