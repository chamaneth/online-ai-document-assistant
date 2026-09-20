from fastapi import APIRouter, Depends
from core.security import verify_api_key
from core.services.rag_service import rag_service

router = APIRouter(tags=["Health & Status"])

@router.get("/health", dependencies=[Depends(verify_api_key)])
def health_check():
    return {
        "status": "healthy",
        "service": "AI Document Assistant Backend",
        "indexed_docs_count": len(rag_service.indexed_documents),
        "db_initialized": rag_service.vector_db is not None
    }

@router.get("/indexed_docs", dependencies=[Depends(verify_api_key)])
def get_indexed_docs():
    return {
        "documents": rag_service.indexed_documents,
        "count": len(rag_service.indexed_documents)
    }
