from app.services.vector_store import (
    hybrid_search
)

results = hybrid_search(
    "What education does Ahmad have?"
)

for result in results:

    print("-" * 50)

    print(
        result.payload["chunk_text"][:300]
    )

    print(
        "Score:",
        result.score
    )