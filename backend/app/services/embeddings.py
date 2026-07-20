from google import genai
from app.config import settings

# Gemini client for embeddings (lightweight API call, no local models)
_client = None

def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    client = _get_client()
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=texts
    )
    return [e.values for e in result.embeddings]


def generate_embedding(text: str) -> list[float]:
    return generate_embeddings([text])[0]


def rerank_chunks(query: str, chunks: list, top_k: int = 5) -> list:
    """Simple score-based reranking using Qdrant's returned scores."""
    sorted_chunks = sorted(chunks, key=lambda c: c.score, reverse=True)
    return sorted_chunks[:top_k]