import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import List
from dotenv import load_dotenv

# Explicitly load .env from the backend directory
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)


class Settings(BaseSettings):
    PROJECT_NAME: str = "TerraSync"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # CORS - Include Railway and Vercel domains
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://localhost:3000",
        "https://127.0.0.1:3000",
        "https://terrasync-ma.vercel.app",
        "*"  # Allow all origins for development
    ]
    
    # Explicit CORS for production
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # OpenRouter Configuration
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_VISION_MODEL: str = "qwen/qwen2.5-vl-32b-instruct:free"  # Vision-capable model
    OPENROUTER_AGENT_MODEL: str = "qwen/qwen2.5-vl-32b-instruct:free"  # Model for agent
    
    # Mock API settings
    MOCK_NGO_API_URL: str = "https://mock-api.ngo.example.com"
    MOCK_RECYCLING_API_URL: str = "https://mock-api.recycling.example.com"
    
    # Rate limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD_SECONDS: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra env vars


settings = Settings()

# Debug: Log what was loaded
print(f"[CONFIG] Loaded from .env: API Key = {'***' + settings.OPENROUTER_API_KEY[-8:] if settings.OPENROUTER_API_KEY else 'NOT SET'}")
print(f"[CONFIG] Vision Model = {settings.OPENROUTER_VISION_MODEL}")
