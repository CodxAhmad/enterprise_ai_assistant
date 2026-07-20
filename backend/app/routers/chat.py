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


@router.get("/sessions")
def get_sessions(db: Session = Depends(get_db)):
    from app.models import ChatHistory
    chats = db.query(ChatHistory).order_by(ChatHistory.created_at.asc()).all()
    
    sessions = {}
    for chat in chats:
        if chat.session_id not in sessions:
            title = chat.user_message[:35] + ("..." if len(chat.user_message) > 35 else "")
            sessions[chat.session_id] = {
                "session_id": chat.session_id,
                "title": title,
                "created_at": chat.created_at
            }
        else:
            sessions[chat.session_id]["created_at"] = chat.created_at
            
    sorted_sessions = sorted(sessions.values(), key=lambda x: x["created_at"], reverse=True)
    
    return [
        {
            "session_id": s["session_id"],
            "title": s["title"],
            "last_active": s["created_at"].isoformat() if s["created_at"] else None
        }
        for s in sorted_sessions
    ]


@router.get("/session/{session_id}")
def get_session_history(session_id: str, db: Session = Depends(get_db)):
    from app.models import ChatHistory
    chats = (
        db.query(ChatHistory)
        .filter(ChatHistory.session_id == session_id)
        .order_by(ChatHistory.created_at.asc())
        .all()
    )
    
    messages = []
    for chat in chats:
        messages.append({"role": "user", "content": chat.user_message})
        messages.append({"role": "ai", "content": chat.ai_response})
        
    return messages