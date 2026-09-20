import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

class Settings:
    SERVER_HOST: str = os.environ.get("SERVER_HOST", "0.0.0.0")
    SERVER_PORT: int = int(os.environ.get("SERVER_PORT", "8000"))
    ALLOWED_ORIGINS: list = os.environ.get("ALLOWED_ORIGINS", "*").split(",")
    API_SECRET_KEY: str = os.environ.get("API_SECRET_KEY", "local_sec_token_984712839")

    # Document & Vector Storage Directories
    UPLOADS_DIR: str = os.path.join(BASE_DIR, "uploads")
    CHROMA_DIR: str = os.path.join(BASE_DIR, ".chroma_db")
    MODELS_DIR: str = os.path.join(BASE_DIR, ".models")
    EMBEDDINGS_DIR: str = os.path.join(MODELS_DIR, "embeddings")
    HUB_DIR: str = os.path.join(MODELS_DIR, "hub")

    DATA_DIR: str = os.path.join(BASE_DIR, "data")

    # Embedding & RAG Parameters
    EMBEDDING_MODEL_NAME: str = os.environ.get("EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
    LLM_MODEL_NAME: str = os.environ.get("LLM_MODEL_NAME", "MBZUAI/LaMini-Flan-T5-248M")
    MAX_FILE_SIZE_BYTES: int = int(os.environ.get("MAX_FILE_SIZE_MB", "50")) * 1024 * 1024

    # Cloud & Hugging Face LLM Providers
    LLM_PROVIDER: str = os.environ.get("LLM_PROVIDER", "groq")
    GROQ_API_KEY: str = os.environ.get("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")
    OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    HUGGINGFACEHUB_API_TOKEN: str = os.environ.get("HUGGINGFACEHUB_API_TOKEN", "")
    HF_MODEL: str = os.environ.get("HF_MODEL", "meta-llama/Meta-Llama-3-8B-Instruct")

    def __init__(self):
        os.makedirs(self.UPLOADS_DIR, exist_ok=True)
        os.makedirs(self.CHROMA_DIR, exist_ok=True)
        os.makedirs(self.DATA_DIR, exist_ok=True)
        os.makedirs(self.MODELS_DIR, exist_ok=True)
        os.makedirs(self.EMBEDDINGS_DIR, exist_ok=True)
        os.makedirs(self.HUB_DIR, exist_ok=True)

        os.environ["HF_HOME"] = self.MODELS_DIR
        os.environ["HF_HUB_CACHE"] = self.HUB_DIR
        os.environ["SENTENCE_TRANSFORMERS_HOME"] = self.EMBEDDINGS_DIR

settings = Settings()
