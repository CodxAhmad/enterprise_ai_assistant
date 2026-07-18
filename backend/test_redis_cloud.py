from app.services.semantic_cache import redis_client

try:
    redis_client.set(
        "test_key",
        "hello_cloud"
    )

    value = redis_client.get(
        "test_key"
    )

    print("Connected")
    print(value)

except Exception as e:
    print("Failed")
    print(e)