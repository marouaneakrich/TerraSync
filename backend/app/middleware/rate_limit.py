"""Rate limiting middleware for production."""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from collections import defaultdict
from datetime import datetime, timedelta
import asyncio
from app.config import settings


class RateLimiter:
    """Simple in-memory rate limiter."""
    
    def __init__(self, requests: int = 100, period_seconds: int = 60):
        self.requests = requests
        self.period_seconds = period_seconds
        self.requests_log = defaultdict(list)
        self._lock = asyncio.Lock()
    
    async def is_allowed(self, client_id: str) -> tuple[bool, int]:
        """Check if client is allowed to make request. Returns (allowed, remaining)."""
        async with self._lock:
            now = datetime.utcnow()
            cutoff = now - timedelta(seconds=self.period_seconds)
            
            # Clean old requests
            self.requests_log[client_id] = [
                ts for ts in self.requests_log[client_id] if ts > cutoff
            ]
            
            # Check limit
            current_count = len(self.requests_log[client_id])
            remaining = max(0, self.requests - current_count - 1)
            
            if current_count >= self.requests:
                return False, 0
            
            # Log this request
            self.requests_log[client_id].append(now)
            return True, remaining


# Global rate limiter instance
rate_limiter = RateLimiter(
    requests=settings.RATE_LIMIT_REQUESTS,
    period_seconds=settings.RATE_LIMIT_PERIOD_SECONDS
)


async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware."""
    # Skip rate limiting for health checks and docs
    if request.url.path in ["/", "/health", "/docs", "/openapi.json"]:
        return await call_next(request)
    
    # Get client identifier (IP or API key)
    client_id = request.client.host if request.client else "unknown"
    
    # Check for API key header
    api_key = request.headers.get("X-API-Key")
    if api_key:
        client_id = f"api:{api_key}"
    
    # Check rate limit
    allowed, remaining = await rate_limiter.is_allowed(client_id)
    
    if not allowed:
        return JSONResponse(
            status_code=429,
            content={
                "detail": "Rate limit exceeded. Please try again later.",
                "retry_after": settings.RATE_LIMIT_PERIOD_SECONDS
            },
            headers={
                "X-RateLimit-Limit": str(settings.RATE_LIMIT_REQUESTS),
                "X-RateLimit-Remaining": "0",
                "Retry-After": str(settings.RATE_LIMIT_PERIOD_SECONDS)
            }
        )
    
    # Process request
    response = await call_next(request)
    
    # Add rate limit headers
    response.headers["X-RateLimit-Limit"] = str(settings.RATE_LIMIT_REQUESTS)
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    
    return response
