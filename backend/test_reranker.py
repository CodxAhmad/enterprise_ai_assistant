from app.services.vector_store import search_documents

from app.services.embeddings import (
    rerank_chunks
)

query = "machine learning experience"

results = search_documents(
    query,
    limit=10
)

reranked = rerank_chunks(
    query,
    results,
    top_k=3
)

print(
    f"Retrieved: {len(results)}"
)

print(
    f"Reranked: {len(reranked)}"
)

for chunk in reranked:

    print("-" * 50)

    print(
        chunk.payload["chunk_text"][:300]
    )