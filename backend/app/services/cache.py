import redis

from app.config import settings

redis_client = redis.Redis.from_url(
    settings.REDIS_URL,
    decode_responses=True
)

def set_cache(
    key: str,
    value: str,
    expiration_time: int = 3600
):
    redis_client.set(
        key,
        value,
        ex=expiration_time
    )

def get_cache(key: str):

    return redis_client.get(key)
