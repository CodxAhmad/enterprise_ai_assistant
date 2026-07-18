from app.services.cache import (
    set_cache,
    get_cache
)

set_cache(
    "greeting",
    "Hello Ahmad"
)

result = get_cache(
    "greeting"
)

print(result)