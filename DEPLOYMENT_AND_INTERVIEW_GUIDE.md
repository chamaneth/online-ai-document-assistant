# 🚀 Cloud AI Document Assistant — Deployment & Internship Guide

This guide covers how to deploy your AI Document Assistant online, showcase it on your CV/Resume **without making your GitHub code public**, and answer technical interview questions about its architecture.

---

## 1. Can We Use Vercel for Flask / Python?

### The Honest Engineering Answer:
- **Vercel** is designed primarily for **Frontend Web Apps** (React, Next.js, Vite, Vue).
- While Vercel does have a Python serverless runtime (`api/*.py`), serverless functions have **severe limitations** for AI & RAG applications:
  1. **Ephemeral File System**: ChromaDB vector databases and uploaded PDFs are deleted as soon as the serverless lambda shuts down (within minutes).
  2. **Strict Timeouts**: Free Vercel functions timeout after 10–15 seconds, which can cut off document ingestion and embeddings generation.
  3. **Heavy Package Limits**: PyTorch and Sentence-Transformers exceed serverless bundle size limits.

### 🏆 The Industry-Standard Best Practice (Recruiter Favorite):
Split the application into two specialized cloud tiers:
1. **Frontend (React + Vite)** ➡️ **Vercel** (Free, instant global CDN, automatic SSL).
2. **Backend (FastAPI + ChromaDB)** ➡️ **Render.com** or **Railway** (Free persistent Linux environment running Python).

---

## 2. How to Showcase on Your CV Without Exposing Your GitHub Code

> **Important**: You do **NOT** need to make your GitHub repository public to impress recruiters. In fact, many proprietary and commercial-grade projects are kept in **private repositories**.

Here is how you showcase this professionally:
1. **Connect Private Repo to Vercel & Render**: Both Vercel and Render connect seamlessly to your **private** GitHub repository. You grant them access with one click, and they build and deploy your live URL.
2. **Include the Live Demo Link on your CV**:
   - `Live Demo: https://your-app-name.vercel.app`
3. **Add a 60-Second Video Demo**:
   - Record a quick video (using Loom or Windows Game Bar `Win + G`) showing:
     - Ingesting a PDF/DOCX document.
     - Asking a question and receiving an instant sub-second answer with citations.
     - Demonstrating the "Stop Response" button and markdown export.
   - Host it as an unlisted link on YouTube or Loom and put the link on your CV.
4. **Code Review During Interviews**:
   - During technical interviews, you can screenshare your private repository to explain your architecture, services, and design patterns.

---

## 3. High-Impact Resume / CV Bullet Points

Add this under your **Projects** section on your resume:

### **Cloud AI Document Intelligence & RAG Platform** | *React, Vite, FastAPI, ChromaDB, Groq Cloud, Python*
- Engineered an end-to-end cloud Retrieval-Augmented Generation (RAG) platform enabling semantic natural language search and Q&A across PDF, DOCX, and TXT documents.
- Integrated **Groq Cloud LLMs (Llama 3.1 8B)** and **OpenAI GPT-4o-mini** with an intelligent multi-provider fallback engine, achieving sub-second query response latency.
- Implemented semantic document chunking and vector indexing using **ChromaDB** and HuggingFace MiniLM embeddings with cosine similarity scoring and exact page-level source citations.
- Architected asynchronous query streaming with client-side **AbortController** cancellation ("Stop Response") and responsive Cyber-Dark UI designed with Tailwind CSS and React.
- Decoupled system architecture into a high-performance **FastAPI** REST backend deployed on Render and a high-availability **Vite SPA** deployed on Vercel.

---

## 4. Step-by-Step Deployment Instructions

### Step A: Deploy the Backend to Render (Free)
1. Push your repository to your private GitHub account.
2. Go to [Render.com](https://render.com/) and sign in with GitHub.
3. Click **New +** ➡️ **Web Service**.
4. Select your `ai-document-assistant` repository.
5. Configure the settings:
   - **Name**: `ai-document-assistant-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn core.main:app --host 0.0.0.0 --port $PORT`
6. Under **Environment Variables**, add:
   - `LLM_PROVIDER`: `groq`
   - `GROQ_API_KEY`: *(Your free Groq API key from console.groq.com)*
   - `API_SECRET_KEY`: `local_sec_token_984712839`
   - `ALLOWED_ORIGINS`: `*`
7. Click **Create Web Service**.
8. Once deployed, copy your backend URL: e.g., `https://ai-document-assistant-api.onrender.com`.

---

### Step B: Deploy the Frontend to Vercel (Free)
1. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** ➡️ **Project**.
3. Import your private repository.
4. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend`
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://ai-document-assistant-api.onrender.com` *(Paste your Render backend URL)*
   - `VITE_API_SECRET_KEY`: `local_sec_token_984712839`
6. Click **Deploy**.
7. In ~60 seconds, your site will be live at `https://ai-document-assistant-xxxx.vercel.app`!

---

## 5. Key Architecture Q&A for Technical Interviews

**Q: Why did you choose Groq for the LLM?**
> *"Groq's LPUs (Language Processing Units) deliver inference speeds of over 500 tokens/sec on Llama 3.1. In a document search tool, users expect near-instant answers rather than waiting 15–20 seconds for standard CPU inference."*

**Q: How does the document search (RAG) work under the hood?**
> *"When a document is uploaded, it is extracted page-by-page, segmented into semantic chunks (500 tokens with 50-token overlap), and embedded into high-dimensional vectors via Sentence-Transformers. At query time, we perform cosine similarity search in ChromaDB, retrieve the top relevant chunks, and inject them into the LLM context prompt with citation metadata."*

**Q: How does the 'Stop Response' feature work?**
> *"The frontend utilizes the JavaScript `AbortController` API linked to the HTTP request signal. When the user clicks 'Stop', the client aborts the network request, terminating active stream processing and resetting the UI state without freezing."*
