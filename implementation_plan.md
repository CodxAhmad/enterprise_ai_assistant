# Enterprise AI Knowledge Assistant - Implementation Plan

This document outlines the step-by-step action plan to build a production-grade Retrieval-Augmented Generation (RAG) system from scratch.

## User Review Required

> [!IMPORTANT]
> Please review this comprehensive plan carefully. It is broken down into distinct phases. Once you approve, we will begin with Phase 1. 

## Open Questions

> [!IMPORTANT]
> - **UI Framework:** Do you have any specific UI component library preference (e.g., Tailwind CSS + Shadcn UI, Material-UI, or pure vanilla CSS)? The default will be Tailwind CSS + Shadcn UI for a premium enterprise look.
> - **Local Infrastructure:** Will we use Docker Compose for local development to spin up PostgreSQL, Qdrant, and Redis? (This is highly recommended for a smooth dev experience).
> - **API Keys:** Do you already have API keys for LangSmith and Gemini, or will you create them later?

## Proposed Changes

### Phase 1: Foundation & Setup
- **Repository Setup**: Initialize the monorepo structure with `frontend` and `backend` directories.
- **Docker Setup**: Create a `docker-compose.yml` for local infrastructure (PostgreSQL, Qdrant, Redis).
- **Backend Init**: Setup FastAPI project structure, poetry/requirements.txt, and foundational configurations (CORS, environment variables).
- **Frontend Init**: Setup Next.js with TypeScript and essential libraries.

### Phase 2: Database & Caching Layer
- **PostgreSQL**: Set up SQLAlchemy models for Users, Documents (metadata), and Chat History. Use Alembic for database migrations.
- **Qdrant Vector DB**: Initialize the Qdrant client connection for storing vector embeddings.
- **Redis Semantic Cache**: Configure Redis for caching LLM responses based on query semantic similarity.

### Phase 3: Document Processing & Ingestion Pipeline
- **File Upload API**: Build FastAPI endpoints to accept PDF, DOCX, TXT, and CSV formats.
- **Text Extraction & Chunking**: Implement document loaders and intelligent text splitters (e.g., RecursiveCharacterTextSplitter with overlap).
- **Embeddings**: Integrate `sentence-transformers` to generate embeddings using the BGE Small model.
- **Vector Storage**: Store text chunks and metadata in Qdrant; store the overarching file metadata in PostgreSQL.

### Phase 4: The RAG Retrieval Pipeline
- **Semantic Caching**: Before searching, check Redis to see if a similar query was answered recently (cache hit).
- **Query Rewriting**: Use Gemini to rewrite user queries to optimize them for retrieval.
- **Hybrid Search**: Implement vector similarity search in Qdrant combined with keyword-based retrieval (BM25).
- **Reranking**: Implement a reranker (e.g., Cross-Encoder) to re-order retrieved chunks based on their absolute relevance to the query.

### Phase 5: LLM Generation & LangGraph Orchestration
- **LangGraph Setup**: Define the state graph for the conversational agent (routing, retrieval, generation).
- **Gemini Integration**: Connect to Gemini 2.5 Flash for generation, passing the reranked context and conversation history.
- **Prompt Engineering**: Craft strict system prompts enforcing grounded answers, preventing hallucinations, and ensuring citations.
- **Streaming**: Implement server-sent events (SSE) to stream LLM responses to the Next.js frontend in real-time.

### Phase 6: Observability, Evaluation & MLflow
- **LangSmith Tracing**: Wrap LangChain/LangGraph calls with LangSmith for full pipeline observability (prompts, latency, tokens).
- **RAGAS Evaluation**: Set up offline evaluation scripts using RAGAS (faithfulness, answer relevancy, context precision/recall).
- **MLflow**: Integrate MLflow to track embedding model parameters, chunk size experiments, and RAGAS evaluation scores over time.

### Phase 7: Frontend Development & Dashboard
- **Authentication**: Implement JWT or NextAuth for secure user access.
- **Chat Interface**: Build a modern, multi-turn chat UI with citations, streaming text, and user feedback buttons (thumbs up/down).
- **Document Management**: UI to upload documents, view processing status, and manage knowledge bases.
- **Analytics Dashboard**: Build an admin dashboard displaying active users, queries, latency, token usage, cost estimations, and cache hit rates.

### Phase 8: Containerization & Deployment
- **Dockerization**: Write production `Dockerfile`s for the FastAPI backend and Next.js frontend.
- **Vercel**: Deploy the Next.js frontend application.
- **Render**: Deploy the FastAPI backend service.
- **Managed Databases**: Transition from local Docker to managed PostgreSQL (e.g., Supabase/Neon), managed Redis (Upstash), and Qdrant Cloud for a robust production environment.

## Verification Plan

### Automated Tests
- `pytest` for backend API endpoints, document ingestion logic, and database operations.
- RAGAS evaluation scripts to continuously measure retrieval quality on a curated "golden dataset" of queries.

### Manual Verification
- Upload test documents of various formats (PDF, CSV) and verify successful processing and Qdrant insertion.
- Execute test queries to ensure accurate, grounded responses with proper source citations.
- Verify that identical/similar queries trigger the Redis semantic cache, resulting in low latency and zero LLM token consumption.
- Test UI responsiveness, streaming behavior, and dashboard analytics accuracy.
