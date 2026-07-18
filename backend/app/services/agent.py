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
    results = retrieve_context(
        user_query,
        chat_history
    )

    context = ""
    sources = set()

    for chunk in results["results"]:

        if hasattr(chunk, "payload"):

            context += (
                chunk.payload["chunk_text"]
                + "\n\n"
            )

            sources.add(
                chunk.payload["filename"]
            )

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

    response = client.models.generate_content_stream(
        model="gemini-2.5-flash",
        contents=prompt
    )

    for chunk in response:

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