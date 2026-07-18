from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String, nullable=False)

    file_type = Column(String)

    uploaded_by = Column(Integer)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(String, nullable=False)

    user_message = Column(Text)

    ai_response = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )