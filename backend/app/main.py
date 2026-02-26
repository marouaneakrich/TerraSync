from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging
import sys

from app.routers import vision, trade, impact
from app.config import settings
from app.middleware.rate_limit import rate_limit_middleware
from app.middleware.error_handler import (
    validation_exception_handler,
    http_exception_handler,
    general_exception_handler
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

# Log startup configuration
logger.info("=" * 50)
logger.info("TerraSync Backend Starting...")
logger.info(f"OpenRouter API Key: {'***' + settings.OPENROUTER_API_KEY[-8:] if settings.OPENROUTER_API_KEY else 'NOT SET'}")
logger.info(f"Vision Model: {settings.OPENROUTER_VISION_MODEL}")
logger.info(f"Agent Model: {settings.OPENROUTER_AGENT_MODEL}")
logger.info(f"Base URL: {settings.OPENROUTER_BASE_URL}")
logger.info("=" * 50)

app = FastAPI(
    title="TerraSync API",
    description="Circular Economy Orchestration Platform - AI Vision & Agentic Negotiation",
    version="1.0.0",
)


@app.get("/api/debug/config")
async def debug_config():
    """Debug endpoint to verify configuration is loaded correctly."""
    return {
        "api_key_set": bool(settings.OPENROUTER_API_KEY),
        "api_key_suffix": settings.OPENROUTER_API_KEY[-8:] if settings.OPENROUTER_API_KEY else None,
        "vision_model": settings.OPENROUTER_VISION_MODEL,
        "agent_model": settings.OPENROUTER_AGENT_MODEL,
        "base_url": settings.OPENROUTER_BASE_URL,
    }


# Configure CORS - Use production settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Debug: Log CORS configuration
logger.info(f"CORS Origins: {settings.ALLOWED_ORIGINS}")

# Add rate limiting middleware (temporarily disabled for debugging)
# app.middleware("http")(rate_limit_middleware)

# Add exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Include routers
app.include_router(vision.router, prefix="/api", tags=["vision"])
app.include_router(trade.router, prefix="/api", tags=["trade"])
app.include_router(impact.router, prefix="/api", tags=["impact"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to TerraSync API",
        "docs": "/docs",
        "endpoints": {
            "analyze_item": "/api/analyze-item",
            "orchestrate_trade": "/api/orchestrate-trade",
        },
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "terrasync-api"}
