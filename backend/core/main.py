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
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(pdf_router)
    app.include_router(query_router)

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.SERVER_HOST, port=settings.SERVER_PORT)
