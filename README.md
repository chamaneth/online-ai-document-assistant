# ⚡ Cloud AI Document Assistant — Enterprise RAG Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Groq Cloud](https://img.shields.io/badge/Groq_Cloud-F55036?style=for-the-badge&logo=fastapi&logoColor=white)](https://groq.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI_GPT4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6F00?style=for-the-badge&logo=databricks&logoColor=white)](https://www.trychroma.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Vercel_Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

A high-performance, full-stack **Retrieval-Augmented Generation (RAG)** platform for intelligent document analysis, vector semantic search, and natural language Q&A across multi-format documents (PDF, DOCX, TXT).

Built with a decoupled architecture featuring a reactive **React + Vite** frontend, an asynchronous **FastAPI** backend, **ChromaDB** vector storage, and multi-model cloud orchestration powered by **Groq Cloud (Llama 3.1 8B)** and **OpenAI (GPT-4o-mini)**.

---

## 🌟 Key Features & Engineering Highlights

- **⚡ Sub-Second Cloud Inference**: Integrated Groq LPU acceleration (`llama-3.1-8b-instant`) delivering lightning-fast answers in <1 second with fallback to OpenAI `gpt-4o-mini` or local pipelines.
- **📚 Multi-Format Document Ingestion**: Ingests and processes complex PDFs (`pypdf`), DOCX Word documents (`python-docx`), and text notes with automated metadata extraction.
- **🔍 Dense Vector Retrieval**: Implements semantic document chunking (500 tokens with 50-token overlap) and vector indexing using `sentence-transformers/all-MiniLM-L6-v2` and ChromaDB.
- **📑 Precise Page-Level Citations**: Every answer includes clickable, source-verified citations mapping directly to source filenames and exact page numbers.
- **⏹️ Real-Time "Stop Response" Cancellation**: Frontend uses JavaScript `AbortController` signals to immediately terminate ongoing generation and network requests on demand.
- **🎨 Modern Cyber-Dark Interface**: Designed with Tailwind CSS, custom glassmorphism, Framer Motion animations, document search, and one-click markdown conversation export.
- **🚀 Cloud Deployment Ready**: Pre-configured for deployment with **Vercel** (`vercel.json`) and **Render** (`render.yaml`).

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS | High-performance reactive Single Page Application |
| **Icons & Motion** | Lucide React, Framer Motion | Accessible UI icons and micro-interactions |
| **Backend API** | FastAPI, Uvicorn, Pydantic | High-concurrency asynchronous REST API |
| **Cloud LLMs** | Groq Cloud SDK, OpenAI SDK | Sub-second generative inference |
| **Vector Database** | ChromaDB | High-dimensional embedding storage & cosine similarity search |
| **Embeddings & NLP** | HuggingFace Sentence-Transformers | Dense vector representation (`all-MiniLM-L6-v2`) |
| **Parsers** | PyPDF, python-docx | Text extraction across PDF, DOCX, and TXT |
| **Hosting Targets** | Vercel (Frontend), Render/Railway (Backend) | Scalable production cloud hosting |

---

## 📁 Architecture Overview

```text
ai-document-assistant/
├── backend/                  # FastAPI Application & RAG Core
│   ├── core/
│   │   ├── config.py         # App configuration & cloud credentials
│   │   ├── main.py           # FastAPI app instance and router registration
│   │   ├── routes/           # REST endpoints (upload, query, health, docs)
│   │   ├── schemas.py        # Pydantic data validation models
│   │   ├── security.py       # API authentication guardrails
│   │   └── services/
│   │       ├── model_service.py # Groq / OpenAI / Local LLM orchestrator
│   │       └── rag_service.py   # Vector indexing, chunking & semantic search
│   ├── app.py                # Server entry point
│   ├── render.yaml           # 1-Click Render.com deployment manifest
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React Single Page Application
│   ├── src/
│   │   ├── components/       # Chat workspace, document panel, model settings
│   │   ├── App.jsx           # Application state, AbortController & API bridge
│   │   └── config.js         # Centralized API endpoint routing
│   ├── vercel.json           # Vercel SPA routing configuration
│   └── package.json
│
└── DEPLOYMENT_AND_INTERVIEW_GUIDE.md  # Comprehensive deployment & resume guide
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`
- *(Optional)* Free Groq API Key from [console.groq.com](https://console.groq.com)

---

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
python app.py
```
Backend API will initialize at `http://127.0.0.1:8000`.

---

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Cloud Deployment (Vercel + Render)

For complete step-by-step instructions on deploying the frontend to **Vercel** and the backend to **Render**, refer to:
👉 **[DEPLOYMENT_AND_INTERVIEW_GUIDE.md](./DEPLOYMENT_AND_INTERVIEW_GUIDE.md)**

---

## 📄 License
This project is open-source under the MIT License.
