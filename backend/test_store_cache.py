from app.services.semantic_cache import (
    store_semantic_cache
)

store_semantic_cache(
    "What is machine learning?",
    "Machine learning is a subset of AI."
)

print("Stored")