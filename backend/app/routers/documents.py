from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Document

from app.services.document_processor import process_document
from app.services.embeddings import generate_embeddings
from app.services.vector_store import store_chunks
router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt",
    ".csv"
}


@router.post("/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    document = Document(filename=file.filename, file_type=extension, uploaded_by=1)
    db.add(document)
    db.commit()
    db.refresh(document)

    try:
        chunks = process_document(str(file_path))
        chunk_texts = [chunk.page_content for chunk in chunks]
        embeddings = generate_embeddings(chunk_texts)
        store_chunks(chunks=chunks, embeddings=embeddings, document_id=document.id, filename=file.filename)
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print(f"Error during document processing:\n{tb}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing document: {str(e)}\nTraceback:\n{tb}"
        )
    
    return {
    "message": "File uploaded and processed",
    "document_id": document.id,
    "chunks": len(chunks)
}