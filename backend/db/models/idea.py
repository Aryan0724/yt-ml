import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from db.base import Base

class IdeaRecord(Base):
    __tablename__ = "ideas"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String, index=True, nullable=False)
    user_id = Column(String, index=True, nullable=False)
    
    topic_slug = Column(String, nullable=False)
    canonical_name = Column(String, nullable=False)
    
    angle = Column(String, nullable=False)
    title_concept = Column(String, nullable=False)
    format = Column(String, nullable=False)
    audience = Column(String, nullable=False)
    hook = Column(Text, nullable=False)
    why_now = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
