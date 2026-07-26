from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .client import generate, SampleOutput

router = APIRouter(prefix="/api/generate", tags=["pydantic-ai"])

class GenerateRequest(BaseModel):
    prompt: str

@router.post("", response_model=SampleOutput)
async def handle_generate(request: GenerateRequest):
    """Handle generation requests via Pydantic AI."""
    try:
        result = await generate(request.prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
