from app.services.embeddings import (
    generate_embeddings
)

texts = [
    "Employees can work remotely.",
    "Medical insurance is provided."
]

vectors = generate_embeddings(
    texts
)

print(
    f"Vectors: {len(vectors)}"
)

print(
    f"Dimensions: {len(vectors[0])}"
)