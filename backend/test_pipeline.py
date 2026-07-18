from app.services.retrieval import (
    retrieve_context
)

results = retrieve_context(
    "Tell me about Ahmad's education",
    []
)

print(results["source"])
print(type(results["results"][0]))
print(results["results"][0])

for chunk in results["results"]:

    if isinstance(chunk, str):
        print(chunk)

    else:
        print("-" * 50)
        print(
            chunk.payload["chunk_text"][:300]
        )