from app.services.document_processor import (
    process_document
)

chunks = process_document(
    "uploads/agency.csv"
)

print(
    f"Chunks: {len(chunks)}"
)

print(
    chunks[0].page_content[:300]
)