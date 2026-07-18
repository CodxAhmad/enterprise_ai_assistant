from app.services.semantic_cache import (
    search_semantic_cache
)

result = search_semantic_cache(
    "Explain machine learning"
)

print(result)