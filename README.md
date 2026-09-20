# 📄 AI Document Assistant (Document Q&A Web App)

A clean and intuitive full-stack web application that lets users upload documents (PDF, DOCX, TXT) and ask questions about their content in natural language. Powered by **Retrieval-Augmented Generation (RAG)** with vector search and AI responses backed by exact page citations.

---

## 🌟 What This Project Does

1. **Upload Documents**: Drag and drop or upload PDF files, Word documents (`.docx`), or paste text notes.
2. **Semantic Search**: Breaks documents into manageable chunks and stores them in a vector database (**ChromaDB**) using Sentence-Transformers embeddings.
3. **Accurate Q&A**: Retrieves the most relevant excerpts and generates clear answers using **Groq (Llama 3.1)** or **OpenAI (GPT-4o-mini)**.
4. **Source Citations**: Every generated answer tells you exactly which document and page number the information came from.
5. **Stop Generation**: Stop answering at any time with a single click using the real-time "Stop Response" button.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios
- **Backend**: Python 3, FastAPI, Uvicorn, Pydantic
- **Vector Database**: ChromaDB
- **Text Embeddings**: HuggingFace Sentence-Transformers (`all-MiniLM-L6-v2`)
- **Document Parsers**: PyPDF, python-docx
- **AI Models**: Groq Cloud API (`llama-3.1-8b-instant`), OpenAI API (`gpt-4o-mini`)
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 📁 Project Structure

```text
online-ai-document-assistant/
├── backend/                  # FastAPI Python backend
│   ├── core/
│   │   ├── config.py         # App configuration & environment settings
│   │   ├── main.py           # FastAPI application routes
│   │   ├── schemas.py        # Request & response data models
│   │   └── services/
│   │       ├── model_service.py # Groq / OpenAI LLM caller
│   │       └── rag_service.py   # Document parsing, chunking & vector search
│   ├── app.py                # Server entry point
│   ├── render.yaml           # Backend deployment config for Render
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Chat workspace, document list, settings modal
│   │   ├── App.jsx           # Main application state & API handling
│   │   └── config.js         # API URL configuration
│   ├── vercel.json           # Frontend deployment config for Vercel
│   └── package.json
│
└── DEPLOYMENT_AND_INTERVIEW_GUIDE.md # Step-by-step deployment guide & CV tips
```

---

## 🚀 How to Run Locally

### 1. Backend Setup

```bash
# Move into the backend folder
cd backend

# Create and activate a Python virtual environment
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python app.py
```
The backend API will start at `http://127.0.0.1:8000`.

---

### 2. Frontend Setup

```bash
# Move into the frontend folder (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Free Cloud Deployment

- **Frontend** ➡️ Deploy to **Vercel** (`frontend/vercel.json` included).
- **Backend** ➡️ Deploy to **Render** (`backend/render.yaml` included).

See **[DEPLOYMENT_AND_INTERVIEW_GUIDE.md](./DEPLOYMENT_AND_INTERVIEW_GUIDE.md)** for a simple 5-minute setup guide and CV talking points.

---

## 📄 License
This project is open-source under the MIT License.
