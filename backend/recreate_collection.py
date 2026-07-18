from app.services.vector_store import (
    client,
    init_qdrant
)

client.delete_collection(
    collection_name="document_chunks"
)

print("Old collection deleted") 

init_qdrant()

print("New collection created")