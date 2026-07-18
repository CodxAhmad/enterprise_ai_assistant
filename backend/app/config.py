from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    POSTGRES_URL: str
    QDRANT_URL: str
    QDRANT_API_KEY: str
    REDIS_URL: str
    GEMINI_API_KEY: str
    LANGCHAIN_TRACING_V2: str | None = None
    LANGCHAIN_ENDPOINT: str | None = None
    LANGCHAIN_API_KEY: str | None = None
    LANGCHAIN_PROJECT: str | None = None
    
    model_config = SettingsConfigDict(
        env_file=(".env", "/etc/secrets/.env"),
        extra="ignore"
    )


settings = Settings()