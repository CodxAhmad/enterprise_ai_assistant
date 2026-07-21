# Enterprise AI Knowledge Assistant

An advanced, full-stack AI assistant modeled after the classic ChatGPT UI. This application enables conversational interactions with state-of-the-art AI models, while also allowing users to upload custom documents (PDFs, text) to perform **Retrieval-Augmented Generation (RAG)**.

## 🚀 Live Demo
- **Frontend:** [https://enterprise-ai-assistant-mu.vercel.app](https://enterprise-ai-assistant-mu.vercel.app)
- **Backend API:** Hosted securely on Render.

---

## 🛠️ Tech Stack & Architecture

### Frontend (Next.js & React)
- **Framework:** Next.js 14+ (App Router)
- **UI/UX:** A pixel-perfect ChatGPT-style interface with a fully functioning **Dark Mode** toggle.
- **Styling:** Tailwind CSS combined with Vanilla CSS variables for flawless theme switching without hydration glitches.
- **Visuals & Analytics:** Recharts for rendering the user dashboard and usage analytics.
- **Deployment:** Vercel

### Backend (FastAPI & Python)
- **Framework:** FastAPI for high-performance, asynchronous REST endpoints.
- **Database (Relational):** PostgreSQL (managed on Render) via SQLAlchemy & Alembic for storing chat histories, user sessions, and analytics.
- **Vector Database:** **Qdrant** is used to store document chunks and embeddings, enabling lightning-fast semantic search for the RAG pipeline.
- **Cache:** Redis for Semantic Caching to speed up repeated queries.
- **Deployment:** Render (Dockerized environment)

### AI & MLOps
- **LLM Engine:** Google Gemini (`gemini-2.0-flash-exp`) for powerful, fast conversational responses.
- **Embeddings:** `gemini-embedding-001` (producing high-resolution 3072-dimensional vectors) for accurate document vectorization.
- **Document Processing:** LangChain, PyPDF, and Docx2txt for chunking and parsing uploaded files.
- **Observability:** **MLflow** / LangSmith for full lifecycle tracking. Agent calls, retrieval steps, and LLM token usage are traced and logged to monitor system health and optimize AI prompts.

---

## ✨ Core Features

1. **Intelligent Chat Interface**
   - Ask general knowledge questions or interact dynamically with the AI without any prior setup.
   - Conversations are stored persistently in the PostgreSQL database, meaning you never lose your chat history.
   
2. **Document Upload & Processing (RAG)**
   - Upload documents directly via the UI.
   - The backend processes the text, chunks it using LangChain, and generates 3072-dimensional embeddings via Google GenAI.
   - Embeddings are pushed to **Qdrant**.
   - When you ask a question related to your documents, the system performs a hybrid semantic search to retrieve the most relevant context before generating an answer.

3. **Dashboard & Analytics**
   - A dedicated `/dashboard` route visualizes chat usage and metrics using Recharts.
   - Automatically adapts to light/dark themes.

4. **Production-Ready Security & Stability**
   - Fully configured CORS for secure frontend-backend communication.
   - Qdrant auto-healing: The startup script validates Qdrant collection dimensions and automatically reconstructs the schema if embedding models change.

---

## 📂 Project Structure

```text
📦 AI ChatBot Advanced
 ┣ 📂 frontend/          # Next.js Application
 ┃ ┣ 📂 app/             # Pages (Chat, Dashboard, Documents, Login)
 ┃ ┣ 📂 components/      # UI components (Sidebar, ThemeToggle, Charts)
 ┃ ┗ 📜 globals.css      # CSS Variables for Light/Dark mode
 ┣ 📂 backend/           # FastAPI Application
 ┃ ┣ 📂 app/
 ┃ ┃ ┣ 📂 routers/       # API Routes (chat.py, documents.py)
 ┃ ┃ ┣ 📂 services/      # Core logic (embeddings, vector_store, agent)
 ┃ ┃ ┣ 📜 main.py        # Application entrypoint
 ┃ ┃ ┗ 📜 database.py    # PostgreSQL connection logic
 ┃ ┣ 📜 pyproject.toml   # Python dependencies
 ┃ ┗ 📜 Dockerfile       # Container definition for Render
 ┗ 📜 README.md
```

## 🔗 Where to Check Results
1. **Frontend App**: Visit the [Vercel deployment URL](https://enterprise-ai-assistant-mu.vercel.app). Here you can toggle Dark Mode, chat with the AI, and upload files.
2. **Database & API**: Managed on Render. Any database updates (chats) are reflected instantly in the frontend UI.
3. **MLOps Tracking**: If MLflow/LangSmith is configured in your local environment, you can check traces by navigating to your respective tracking URI (e.g., `localhost:5000` for MLflow) to see the execution graph of the LangChain agents.
4. **Qdrant**: Embeddings can be monitored via the Qdrant Cloud dashboard to ensure vectors are correctly dimensioned (3072) and stored.
