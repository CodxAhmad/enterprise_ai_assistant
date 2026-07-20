from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.agent import stream_answer
from app.services.chat_history import save_chat_message

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class ChatRequest(BaseModel):
    query: str
    session_id: str = "default-session"


@router.post("/")
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    async def event_generator():
        full_response = ""

        async for chunk in stream_answer(request.query, []):
            full_response += chunk
            yield f"data: {chunk}\n\n"

        yield "data: [DONE]\n\n"

        save_chat_message(
            db=db,
            session_id=request.session_id,
            user_message=request.query,
            ai_response=full_response
        )

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )