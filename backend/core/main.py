import os
import sys

# Ensure backend directory and root directory are in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
root_dir = os.path.dirname(backend_dir)
for p in [backend_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.security import add_security_headers
from core.routes.health import router as health_router
from core.routes.pdf import router as pdf_router
from core.routes.query import router as query_router

def create_app() -> FastAPI:
    app = FastAPI(
        title="AI Document Assistant API",
        description="Full-stack Document Intelligence & RAG Platform with Vector Search, Citations & Fast Inference",
        version="1.0.0"
    )

    app.middleware("http")(add_security_headers)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_origin_regex=r"https?://.*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
        max_age=86400,
    )

    app.include_router(health_router)
    app.include_router(pdf_router)
    app.include_router(query_router)

    @app.on_event("startup")
    async def startup_event():
        import threading
        def warm():
            try:
                from core.services.model_service import get_embeddings
                emb = get_embeddings()
                emb.embed_query("warmup")
                print("[Startup] Lightweight ONNX embedding model pre-warmed!")
            except Exception as e:
                print(f"[Startup] Warmup note: {e}")
        threading.Thread(target=warm, daemon=True).start()

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.SERVER_HOST, port=settings.SERVER_PORT)
