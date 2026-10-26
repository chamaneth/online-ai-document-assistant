from fastapi import APIRouter, File, UploadFile, Depends
from core.security import verify_api_key
from core.schemas import RawTextUploadRequest
from core.services.rag_service import rag_service

router = APIRouter(tags=["Document Management"])

@router.post("/upload_pdf")
@router.post("/upload_file")
async def upload_file(file: UploadFile = File(...)):
    return await rag_service.process_file_upload(file)

@router.post("/upload_text")
async def upload_raw_text(request: RawTextUploadRequest):
    return await rag_service.process_raw_text_upload(request.title, request.content)

@router.delete("/document/{filename}")
async def delete_document(filename: str):
    return await rag_service.delete_single_document(filename)
