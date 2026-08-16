import time
from collections import defaultdict

class RateLimiter:
    def __init__(self, max_requests=100, window_seconds=60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)

    def is_allowed(self, key: str) -> bool:
        now = time.time()
        window_start = now - self.window_seconds
        self.requests[key] = [t for t in self.requests[key] if t > window_start]
        if len(self.requests[key]) >= self.max_requests:
            return False
        self.requests[key].append(now)
        return True

    def cleanup(self):
        now = time.time()
        window_start = now - self.window_seconds
        for key in list(self.requests.keys()):
            self.requests[key] = [t for t in self.requests[key] if t > window_start]
            if not self.requests[key]:
                del self.requests[key]

rate_limiter = RateLimiter()

# Stricter limiter for sensitive endpoints (inject)
inject_rate_limiter = RateLimiter(max_requests=10, window_seconds=60)
