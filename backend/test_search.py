from app.services.vector_store import search_documents

results = search_documents(
    "machine learning experience"
)

print(f"Results: {len(results)}")

for result in results:
    print("-" * 50)

    print(
        result.payload["chunk_text"][:200]
    )

    print(
        f"Score: {result.score}"
    )