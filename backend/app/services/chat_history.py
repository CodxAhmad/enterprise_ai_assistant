from sqlalchemy.orm import Session

from app.models import ChatHistory

def save_chat_message(
    db: Session,
    session_id: str,
    user_message: str,
    ai_response: str
):
    chat = ChatHistory(
        session_id=session_id,
        user_message=user_message,
        ai_response=ai_response
    )

    db.add(chat)
    db.commit()

def get_chat_history(
    db: Session,
    session_id: str,
    limit: int = 10
):
    messages = (
        db.query(ChatHistory)
        .filter(
            ChatHistory.session_id == session_id
        )
        .order_by(
            ChatHistory.created_at.desc()
        )
        .limit(limit)
        .all()
    )

    messages.reverse()

    history = []

    for msg in messages:

        history.append(
            f"User: {msg.user_message}"
        )

        history.append(
            f"Assistant: {msg.ai_response}"
        )

    return history