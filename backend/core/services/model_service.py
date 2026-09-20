import os
import torch
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFacePipeline
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
from core.config import settings

_embeddings = None
_local_llm = None

# Optimize CPU inference threads for fast on-device generation fallback
if not torch.cuda.is_available():
    try:
        num_threads = min(8, max(2, os.cpu_count() or 4))
        torch.set_num_threads(num_threads)
    except Exception:
        pass

class CloudLLMClient:
    """High-performance LLM client wrapper supporting Groq, OpenAI, and Hugging Face."""
    def __init__(self, provider: str, api_key: str, model_name: str):
        self.provider = provider
        self.api_key = api_key
        self.model_name = model_name

    def invoke(self, prompt: str) -> str:
        if self.provider == "groq":
            try:
                from groq import Groq
                client = Groq(api_key=self.api_key)
                response = client.chat.completions.create(
                    model=self.model_name or "llama-3.1-8b-instant",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are an expert AI Document Assistant. Provide concise, clear, accurate answers grounded in provided document context. Format with clean markdown."
                        },
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=450,
                    temperature=0.2
                )
                return response.choices[0].message.content or "No response generated."
            except Exception as e:
                print(f"[Cloud LLM] Groq execution error: {e}")
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
                    max_tokens=450,
                    temperature=0.2
                )
                return response.choices[0].message.content or "No response generated."
            except Exception as e:
                print(f"[Cloud LLM] OpenAI execution error: {e}")
                raise e

        elif self.provider == "huggingface":
            try:
                from huggingface_hub import InferenceClient
                token = self.api_key or settings.HUGGINGFACEHUB_API_TOKEN or os.environ.get("HUGGINGFACEHUB_API_TOKEN")
                client = InferenceClient(token=token if token else None)
                model_to_use = self.model_name or settings.HF_MODEL or "meta-llama/Meta-Llama-3-8B-Instruct"
                response = client.chat.completions.create(
                    model=model_to_use,
                    messages=[
                        {
                            "role": "system",
                            "content": "You are an expert AI Document Assistant. Provide concise, clear, accurate answers grounded in provided document context. Format with clean markdown."
                        },
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=450,
                    temperature=0.2
                )
                return response.choices[0].message.content or "No response generated."
            except Exception as e:
                print(f"[Hugging Face Client] Hub API notice ({e}), using local Hugging Face transformer pipeline.")
                return get_local_llm().invoke(prompt)

        return "Unsupported model provider."

def get_embeddings():
    """Hugging Face Sentence-Transformers dense embedding model."""
    global _embeddings
    if _embeddings is None:
        print(f"[Model Service] Loading Hugging Face Embeddings ({settings.EMBEDDING_MODEL_NAME})...")
        _embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL_NAME,
            cache_folder=settings.EMBEDDINGS_DIR
        )
    return _embeddings

def get_local_llm():
    """Local Hugging Face Transformers pipeline (Flan-T5)."""
    global _local_llm
    if _local_llm is None:
        print(f"[Model Service] Initializing Local Hugging Face Model ({settings.LLM_MODEL_NAME})...")
        tokenizer = AutoTokenizer.from_pretrained(settings.LLM_MODEL_NAME, cache_dir=settings.HUB_DIR)
        model = AutoModelForSeq2SeqLM.from_pretrained(settings.LLM_MODEL_NAME, cache_dir=settings.HUB_DIR)

        pipe = pipeline(
            "text2text-generation",
            model=model,
            tokenizer=tokenizer,
            max_new_tokens=180,
            truncation=True,
            do_sample=False
        )
        _local_llm = HuggingFacePipeline(pipeline=pipe)
    return _local_llm

def get_llm(custom_api_key: str = None, provider: str = None):
    """
    Returns an LLM client.
    Priority:
    1. Dynamic custom_api_key passed from UI settings
    2. Selected Provider: Groq, OpenAI, or Hugging Face
    3. Server Environment Keys
    4. Local Hugging Face Transformer pipeline
    """
    prov = (provider or settings.LLM_PROVIDER or "auto").lower()
    groq_key = custom_api_key if prov == "groq" else (settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY", ""))
    openai_key = custom_api_key if prov == "openai" else (settings.OPENAI_API_KEY or os.environ.get("OPENAI_API_KEY", ""))
    hf_key = custom_api_key if prov == "huggingface" else (settings.HUGGINGFACEHUB_API_TOKEN or os.environ.get("HUGGINGFACEHUB_API_TOKEN", ""))

    # Detect key format directly if custom key passed
    if custom_api_key:
        if custom_api_key.startswith("gsk_") or prov == "groq":
            return CloudLLMClient("groq", custom_api_key, settings.GROQ_MODEL)
        elif custom_api_key.startswith("sk-") or prov == "openai":
            return CloudLLMClient("openai", custom_api_key, settings.OPENAI_MODEL)
        elif custom_api_key.startswith("hf_") or prov == "huggingface":
            return CloudLLMClient("huggingface", custom_api_key, settings.HF_MODEL)

    if (prov in ["groq", "auto"]) and groq_key:
        return CloudLLMClient("groq", groq_key, settings.GROQ_MODEL)

    if (prov in ["openai", "auto"]) and openai_key:
        return CloudLLMClient("openai", openai_key, settings.OPENAI_MODEL)

    if prov == "huggingface":
        if hf_key:
            return CloudLLMClient("huggingface", hf_key, settings.HF_MODEL)
        return get_local_llm()

    # Local Hugging Face fallback
    return get_local_llm()
