# AI Document Assistant (RAG Assistant)

A full-stack **RAG (Retrieval-Augmented Generation)** document assistant that lets you upload documents and ask questions with AI.

---

## What It Does

- **RAG Document Search**: Upload PDF, Word (`.docx`), or text notes into a vector database (**ChromaDB**).
- **AI Assistant**: Ask questions and get fast answers using Groq (Llama 3.1) or OpenAI.
- **Shows Citations**: Every answer includes the exact document name and page number source.
- **Stop Response**: Cancel an answer anytime with a single click.

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Python, FastAPI
- **RAG / Vector Store**: ChromaDB
- **AI Models**: Groq Cloud (Llama 3.1) and OpenAI

---

## Project Structure

```text
online-ai-document-assistant/
├── backend/                  # FastAPI Python backend (RAG & AI)
│   ├── core/                 # Search logic, routes, and LLM services
│   ├── app.py                # Server entry point
│   ├── render.yaml           # Deployment config for Render
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React UI
│   ├── src/                  # Components and chat workspace
│   ├── vercel.json           # Deployment config for Vercel
│   └── package.json
│
└── README.md
```

---

## How to Run Locally

### 1. Run the Backend

```bash
cd backend

# Create and activate Python virtual environment
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend
python app.py
```
Backend runs at `http://127.0.0.1:8000`.

---

### 2. Run the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Deployment

- **Frontend**: Deploy on **Vercel** (set root folder to `frontend`).
- **Backend**: Deploy on **Render** (set start command to `uvicorn app:app --host 0.0.0.0 --port $PORT`).
