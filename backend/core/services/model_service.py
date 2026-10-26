import os
from typing import List, Optional
from langchain_core.embeddings import Embeddings
from core.config import settings

_embeddings = None

class ChromaONNXEmbeddings(Embeddings):
    """
    Ultra-lightweight ONNX dense embeddings adapter using Chroma's built-in ONNX runtime.
    Uses <50MB RAM instead of 600MB PyTorch memory to prevent OOM kills (502 Bad Gateway) on cloud free tiers.
    """
    def __init__(self):
        import chromadb.utils.embedding_functions as ef
        self._ef = ef.DefaultEmbeddingFunction()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        embeddings: List[List[float]] = []
        batch_size = 32
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            embeddings.extend(self._ef(batch))
        return embeddings

    def embed_query(self, text: str) -> List[float]:
        return self._ef([text])[0]

class CloudLLMClient:
    """High-performance LLM client wrapper supporting Groq API online models."""
    def __init__(self, provider: str, api_key: str, model_name: str = None):
        self.provider = provider
        self.api_key = api_key
        self.model_name = model_name or settings.GROQ_MODEL or "llama-3.1-8b-instant"

    def invoke(self, prompt: str) -> str:
        if self.provider == "groq":
            try:
                from groq import Groq
                client = Groq(api_key=self.api_key)

                candidate_models = [
                    self.model_name,
                    "openai/gpt-oss-20b",
                    "qwen/qwen3.8-27b",
                    "llama-3.3-70b-versatile",
                    "llama-3.1-8b-instant"
                ]

                last_error = None
                for m in candidate_models:
                    if not m:
                        continue
                    try:
                        response = client.chat.completions.create(
                            model=m,
                            messages=[
                                {
                                    "role": "system",
                                    "content": "You are an expert AI Document Assistant. Provide concise, clear, accurate answers grounded in provided document context. Format with clean markdown."
                                },
                                {"role": "user", "content": prompt}
                            ],
                            max_tokens=512,
                            temperature=0.2
                        )
                        return response.choices[0].message.content or "No response generated."
                    except Exception as e:
                        last_error = e
                        err_str = str(e).lower()
                        if "model_not_found" in err_str or "does not exist" in err_str:
                            continue
                        raise e

                if last_error:
                    raise last_error
                return "No response generated."
            except Exception as e:
                print(f"[Groq LLM Client] Execution error: {e}")
                raise e

        elif self.provider == "openai":
            try:
                from openai import OpenAI
                client = OpenAI(api_key=self.api_key)
                response = client.chat.completions.create(
                    model=self.model_name or "gpt-4o-mini",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are an expert AI Document Assistant. Provide concise, clear, accurate answers grounded in provided document context. Format with clean markdown."
                        },
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=512,
                    temperature=0.2
                )
                return response.choices[0].message.content or "No response generated."
            except Exception as e:
                print(f"[OpenAI Client] Execution error: {e}")
                raise e

        raise ValueError(f"Unsupported model provider '{self.provider}'. Only Groq API is supported.")

def get_embeddings():
    """Returns lightweight dense embeddings (<50MB RAM) for high-performance vector search."""
    global _embeddings
    if _embeddings is None:
        print("[Model Service] Initializing lightweight ONNX embeddings (<50MB RAM)...")
        _embeddings = ChromaONNXEmbeddings()
    return _embeddings

def get_llm(custom_api_key: str = None, provider: str = None, model_name: str = None):
    """
    Returns an online LLM client using Groq API.
    Priority:
    1. Dynamic custom_api_key passed from UI settings
    2. Server Environment GROQ_API_KEY
    """
    prov = (provider or settings.LLM_PROVIDER or "groq").lower()
    selected_model = model_name or settings.GROQ_MODEL or "llama-3.1-8b-instant"

    groq_key = custom_api_key if (prov == "groq" or not custom_api_key or custom_api_key.startswith("gsk_")) else (settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY", ""))

    # If user selected openai specifically and has sk- key
    if prov == "openai" or (custom_api_key and custom_api_key.startswith("sk-")):
        openai_key = custom_api_key if prov == "openai" else (settings.OPENAI_API_KEY or os.environ.get("OPENAI_API_KEY", ""))
        if openai_key:
            return CloudLLMClient("openai", openai_key, model_name or settings.OPENAI_MODEL)

    # Groq API (Primary Online Model)
    if not groq_key:
        groq_key = settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY", "")

    if not groq_key:
        raise ValueError(
            "Groq API Key is required. Please set the GROQ_API_KEY environment variable on the server, "
            "or enter your Groq API Key (gsk_...) in the application Settings modal."
        )

    return CloudLLMClient("groq", groq_key, selected_model)
