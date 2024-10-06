# app/core/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import EmailStr

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Project"
    API_PREFIX: str = "/api"

    # SMTP Email settings
    SMTP_SERVER: str
    SMTP_PORT: int
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    FROM_EMAIL: EmailStr

    # Database settings
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
