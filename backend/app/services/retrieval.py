from google import genai

from app.config import settings
from app.services.vector_store import (
    search_documents,
    hybrid_search
)

from app.services.embeddings import (
    rerank_chunks
)

from app.services.semantic_cache import (
    search_semantic_cache
)
client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)

def rewrite_query(user_query: str, chat_history: list) -> str:
    history_text = "\n".join(chat_history)
    prompt = f"""
You are a query rewriting assistant.

Given the conversation history and latest user query,
rewrite the latest query into a standalone search query.

Do not answer the question.
Only return the rewritten query.

Conversation History:
{history_text}

Latest User Query:
{user_query}

Standalone Query:
"""
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    return response.text.strip()

def retrieve_context(
    user_query: str,
    chat_history: list
):

    cached = search_semantic_cache(
        user_query
    )

    if cached:
        print("Cache Hit")

        return {
            "source": "cache",
            "results": [cached["answer"]]
        }

    rewritten_query = rewrite_query(
        user_query,
        chat_history
    )

    retrieved_chunks = hybrid_search(
    rewritten_query,
    limit=10
)

    reranked_chunks = rerank_chunks(
        rewritten_query,
        retrieved_chunks,
        top_k=5
    )

    return {
    "source": "retrieval",
    "query": rewritten_query,
    "results": reranked_chunks
}