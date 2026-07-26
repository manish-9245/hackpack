from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .client import chat

router = APIRouter(prefix="/api/chat", tags=["langchain"])

class ChatRequest(BaseModel):
    messages: list[dict[str, str]]

class ChatResponse(BaseModel):
    content: str

@router.post("", response_model=ChatResponse)
async def handle_chat(request: ChatRequest):
    """Handle chat requests via LangChain."""
    try:
        content = await chat(request.messages)
        return ChatResponse(content=content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
