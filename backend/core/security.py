from typing import Optional
from fastapi import HTTPException, Header, Request
from core.config import settings

async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    expected_key = (settings.API_SECRET_KEY or "").strip()
    if expected_key and expected_key not in ("YOUR_API_SECRET_KEY", "optional", "none", ""):
        if not x_api_key or x_api_key != expected_key:
            raise HTTPException(status_code=403, detail="Unauthorized API Request: Invalid or Missing Security Token")


