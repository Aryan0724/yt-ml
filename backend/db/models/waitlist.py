from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.sql import func
from db.base import Base

class WaitlistEntry(Base):
    __tablename__ = "waitlist_entries"

    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=True)
    source = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False, default="pending")
    youtube_channel = Column(String(255), nullable=True)
    niche = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    subscriber_count = Column(String(50), nullable=True)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
