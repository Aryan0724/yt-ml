from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class WaitlistApplyRequest(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    youtube_channel: Optional[str] = None
    niche: Optional[str] = None
    country: Optional[str] = None
    subscriber_count: Optional[str] = None
    why_join: Optional[str] = None
    consent_public_showcase: Optional[bool] = False

class WaitlistApplyResponse(BaseModel):
    success: bool
    applicant_id: str
    credits_assigned: int
    showcase_bonus: bool

class WaitlistEntryResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
