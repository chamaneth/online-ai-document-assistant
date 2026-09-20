# AI Document Assistant (RAG Assistant)

A full-stack **RAG (Retrieval-Augmented Generation)** document assistant built with **Hugging Face**, **FastAPI**, **React**, and **ChromaDB**. Upload your documents and ask questions using open-source NLP models and AI.

---

## What It Does

- **Document Ingestion**: Upload PDF, Word (`.docx`), or text notes.
- **Hugging Face Embeddings**: Converts document chunks into dense vector embeddings using Hugging Face Sentence-Transformers (`all-MiniLM-L6-v2`).
- **Vector Search**: Finds the most relevant paragraphs using **ChromaDB** similarity search.
- **AI Answers with Citations**: Generates accurate answers using **Hugging Face Models**, **Groq (Llama 3.1)**, or **OpenAI**, complete with exact page numbers.
- **Stop Response**: Cancel an answer anytime with a single click.

---

## Machine Learning & Tech Stack

- **NLP & Embeddings**: Hugging Face `sentence-transformers` (`all-MiniLM-L6-v2`)
- **LLM Models**: Hugging Face Transformers (`MBZUAI/LaMini-Flan-T5`), Groq Cloud (Llama 3.1), and OpenAI
- **Vector Database**: ChromaDB
- **Backend**: Python 3, FastAPI, Uvicorn
- **Frontend**: React, Vite, Tailwind CSS
- **Document Parsers**: PyPDF, python-docx

---

## Project Structure

```text
online-ai-document-assistant/
├── backend/                  # FastAPI Python backend (RAG & NLP)
│   ├── core/                 # Hugging Face embeddings, search, and LLM services
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
