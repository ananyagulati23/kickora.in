from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Database - Using SQLite for development
    database_url: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./kickora.db")
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here-make-it-long-and-random")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Google OAuth
    google_client_id: str = os.getenv("GOOGLE_CLIENT_ID", "your-google-client-id")
    google_client_secret: str = os.getenv("GOOGLE_CLIENT_SECRET", "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")
    google_redirect_uri: str = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback")
    
    # Admin
    admin_mode_password: str = os.getenv("ADMIN_MODE_PASSWORD", "your-super-secure-admin-mode-password")
    
    # CORS
    allowed_origins: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    class Config:
        env_file = ".env"

settings = Settings() 