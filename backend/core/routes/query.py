from fastapi import APIRouter, Depends, HTTPException
from core.security import verify_api_key
from core.schemas import QueryRequest, QueryResponse
from core.services.rag_service import rag_service

router = APIRouter(tags=["Query & Operations"])

@router.post("/query", response_model=QueryResponse, dependencies=[Depends(verify_api_key)])
async def query_rag(request: QueryRequest):
    if len(rag_service.indexed_documents) == 0:
        return QueryResponse(
            question=request.question,
            answer="No documents are currently indexed in your library. Please upload a PDF, Word document, or paste a note in the sidebar first.",
            citations=[]
        )

    return await rag_service.execute_query(
        question=request.question,
        chat_history=request.chat_history or [],
        top_k=request.top_k or 3,
        max_length=request.max_length or 512,
        custom_api_key=request.api_key,
        provider=request.provider
    )

@router.delete("/clear_db", dependencies=[Depends(verify_api_key)])
@router.post("/clear_db", dependencies=[Depends(verify_api_key)])
async def clear_database():
    return await rag_service.clear_all()
