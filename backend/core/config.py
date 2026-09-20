import os
import sys
from dotenv import load_dotenv

if getattr(sys, 'frozen', False):
    # Running inside PyInstaller bundled executable
    BASE_DIR = os.path.dirname(sys.executable)
else:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

load_dotenv(os.path.join(BASE_DIR, ".env"))

class Settings:
    SERVER_HOST: str = os.environ.get("SERVER_HOST", "127.0.0.1")
    SERVER_PORT: int = int(os.environ.get("SERVER_PORT", "8000"))
    ALLOWED_ORIGINS: list = os.environ.get("ALLOWED_ORIGINS", "*").split(",")

    API_SECRET_KEY: str = os.environ.get("API_SECRET_KEY", "local_sec_token_984712839")

    # Commercial Enterprise & UX Features
    ENABLE_ADMIN_PANEL: bool = os.environ.get("ENABLE_ADMIN_PANEL", "true").lower() == "true"
    COMPANY_NAME: str = os.environ.get("COMPANY_NAME", "AI Document Assistant")

    USER_DATA_DIR: str = os.environ.get("APP_DATA_DIR", BASE_DIR)

    # Intelligently locate local neural models across dev and packaged exe
    _custom_models = os.environ.get("MODELS_DIR")
    if _custom_models and os.path.exists(_custom_models):
        MODELS_DIR: str = _custom_models
    elif os.path.exists(os.path.join(BASE_DIR, ".models")):
        MODELS_DIR: str = os.path.join(BASE_DIR, ".models")
    elif getattr(sys, 'frozen', False) and os.path.exists(os.path.join(os.path.dirname(os.path.dirname(BASE_DIR)), ".models")):
        MODELS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(BASE_DIR)), ".models")
    else:
        MODELS_DIR: str = os.path.join(USER_DATA_DIR, ".models")

    EMBEDDINGS_DIR: str = os.path.join(MODELS_DIR, "embeddings")
    HUB_DIR: str = os.path.join(MODELS_DIR, "hub")
    CHROMA_DIR: str = os.path.join(USER_DATA_DIR, ".chroma_db")
    UPLOADS_DIR: str = os.path.join(USER_DATA_DIR, "uploads")
    DATA_DIR: str = os.path.join(USER_DATA_DIR, "data")

    EMBEDDING_MODEL_NAME: str = os.environ.get("EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
    LLM_MODEL_NAME: str = os.environ.get("LLM_MODEL_NAME", "MBZUAI/LaMini-Flan-T5-248M")
    MAX_FILE_SIZE_BYTES: int = int(os.environ.get("MAX_FILE_SIZE_MB", "50")) * 1024 * 1024

    # Online Cloud LLM Providers (Groq / OpenAI / Cloud RAG)
    LLM_PROVIDER: str = os.environ.get("LLM_PROVIDER", "auto")
    GROQ_API_KEY: str = os.environ.get("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")
    OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

    def __init__(self):
        os.makedirs(self.EMBEDDINGS_DIR, exist_ok=True)
        os.makedirs(self.HUB_DIR, exist_ok=True)
        os.makedirs(self.CHROMA_DIR, exist_ok=True)
        os.makedirs(self.UPLOADS_DIR, exist_ok=True)
        os.makedirs(self.DATA_DIR, exist_ok=True)

        # Enforce 100% local offline HuggingFace caching & offline privacy
        os.environ["HF_HOME"] = self.MODELS_DIR
        os.environ["HF_HUB_CACHE"] = self.HUB_DIR
        os.environ["SENTENCE_TRANSFORMERS_HOME"] = self.EMBEDDINGS_DIR

settings = Settings()
