# Document Q&A Web App

A simple full-stack web application where you can upload documents and ask questions about them.

---

## What It Does

- **Upload Files**: Upload your PDF, Word (`.docx`), or text notes.
- **Ask Questions**: Ask questions in simple English about your files.
- **Fast Answers**: Uses Groq (Llama 3.1) or OpenAI to give answers in seconds.
- **Shows Sources**: Every answer shows the document name and page number so you can check where it came from.
- **Stop Button**: Click the stop button anytime to cancel an answer while it is generating.

---

## Tools Used

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Python, FastAPI
- **Search Database**: ChromaDB
- **AI**: Groq API (free & fast) and OpenAI API

---

## Project Folders

```text
online-ai-document-assistant/
├── backend/                  # Python FastAPI backend
│   ├── core/                 # App logic, search, and AI connection
│   ├── app.py                # Starts the backend server
│   ├── render.yaml           # Easy setup for Render
│   └── requirements.txt      # Python libraries needed
│
├── frontend/                 # React user interface
│   ├── src/                  # React components and pages
│   ├── vercel.json           # Easy setup for Vercel
│   └── package.json          # Frontend packages
│
└── README.md
```

---

## How to Run Locally

### 1. Run the Backend

```bash
cd backend

# Create and turn on Python virtual environment
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Start backend
python app.py
```
Backend runs at `http://127.0.0.1:8000`.

---

### 2. Run the Frontend

In a new terminal window:

```bash
cd frontend

# Install packages
npm install

# Start frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Deployment

- **Frontend**: Connect your GitHub repo to **Vercel** and set the root directory to `frontend`.
- **Backend**: Connect your GitHub repo to **Render** as a Web Service and set the root directory to `backend`.
