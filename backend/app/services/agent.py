from typing import TypedDict
from langsmith import traceable
from langgraph.graph import (
    StateGraph,
    END
)

from google import genai

from app.config import settings
from app.services.retrieval import retrieve_context

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)

class AgentState(TypedDict):
    user_query: str
    chat_history: list
    retrieved_context: str
    sources: list
    final_answer: str

@traceable
def retrieve_node(
    state: AgentState
):

    results = retrieve_context(
        state["user_query"],
        state["chat_history"]
    )

    context = ""
    sources = set()
    for chunk in results["results"]:
        sources.add(
            chunk.payload["filename"]
        )
        if hasattr(
            chunk,
            "payload"
        ):
            context += (
                chunk.payload["chunk_text"]
                + "\n\n"
            )

    return {
    "retrieved_context": context,
    "sources": list(sources)
}

@traceable
def generate_node(
    state: AgentState
):
    prompt = f"""
You are an Enterprise Knowledge Assistant.

Rules:
1. Answer ONLY using the provided context.
2. Do not use outside knowledge.
3. If the answer cannot be found in the context, respond:
   "I do not have enough information to answer that."
4. Be concise and professional.
5. At the end of the answer, include the document names used as sources.

Chat History:
{state["chat_history"]}

Context:
{state["retrieved_context"]}

User Question:
{state["user_query"]}
Sources:
{", ".join(state["sources"])}
"""
    response = (
    client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
)
    return {
    "final_answer":
        response.text
}

async def stream_answer(
    user_query: str,
    chat_history: list
):
    try:
        results = retrieve_context(
            user_query,
            chat_history
        )
        chunks = results.get("results", [])
    except Exception as e:
        print(f"Retrieval error: {e}")
        chunks = []

    context = ""
    sources = set()

    for chunk in chunks:
        if hasattr(chunk, "payload") and chunk.payload:
            context += (
                chunk.payload.get("chunk_text", "")
                + "\n\n"
            )
            if "filename" in chunk.payload:
                sources.add(chunk.payload["filename"])

    if context.strip():
        prompt = f"""
You are an Enterprise Knowledge Assistant.

Rules:
1. Answer ONLY using the provided context.
2. Do not use outside knowledge.
3. If the answer cannot be found in the context, respond:
   "I do not have enough information to answer that."
4. Be concise and professional.
5. At the end of the answer, include the document names used as sources.

Chat History:
{chat_history}

Context:
{context}

User Question:
{user_query}

Sources:
{", ".join(sources)}
"""
    else:
        # No documents found, fallback to general knowledge but note the lack of docs
        prompt = f"""
You are an Enterprise Knowledge Assistant. No specific documents in the knowledge base match this query.

Please answer the user's question using your general knowledge, but kindly add a brief note at the very end of your response stating: 
"(Note: No matching enterprise documents were found. This response is based on general knowledge.)"

Chat History:
{chat_history}

User Question:
{user_query}
"""

    response = await client.aio.models.generate_content_stream(
        model="gemini-2.5-flash",
        contents=prompt
    )

    async for chunk in response:
        if chunk.text:
            yield chunk.text

            

graph = StateGraph(
    AgentState
)
graph.add_node(
    "retrieve",
    retrieve_node
)

graph.add_node(
    "generate",
    generate_node
)
graph.add_edge(
    "retrieve",
    "generate"
)
graph.set_entry_point(
    "retrieve"
)
graph.add_edge(
    "generate",
    END
)
agent = graph.compile()

from langsmith import traceable

@traceable
def test_langsmith():
    return "hello"

test_langsmith()