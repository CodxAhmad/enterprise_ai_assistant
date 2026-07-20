from dotenv import load_dotenv
load_dotenv(override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Enterprise AI Knowledge Assistant",
    version="0.1.0"
)

# CORS must be added BEFORE routers to apply to all routes including preflight
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://enterprise-ai-assistant-mu.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers.documents import router as document_router
from app.routers import chat
from app.services.vector_store import init_qdrant

app.include_router(document_router)
app.include_router(chat.router)


@app.on_event("startup")
def startup_event():
    print("Initializing Qdrant collections...")
    init_qdrant()


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "Backend is running"
    }
