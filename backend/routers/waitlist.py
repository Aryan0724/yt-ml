import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from db.session import get_db_session
from db.models.waitlist import WaitlistEntry
from schemas.waitlist import WaitlistApplyRequest, WaitlistApplyResponse

router = APIRouter(prefix="/waitlist", tags=["Waitlist"])

@router.post("", response_model=WaitlistApplyResponse, status_code=status.HTTP_201_CREATED)
async def apply_for_waitlist(
    payload: WaitlistApplyRequest, 
    db: AsyncSession = Depends(get_db_session)
):
    # Check if already exists
    result = await db.execute(select(WaitlistEntry).where(WaitlistEntry.email == payload.email))
    existing = result.scalars().first()
    
    if existing:
        return WaitlistApplyResponse(
            success=True,
            applicant_id=existing.id,
            credits_assigned=4 if payload.consent_public_showcase else 3,
            showcase_bonus=bool(payload.consent_public_showcase)
        )
    
    applicant_id = f"bw_{uuid.uuid4().hex[:12]}"
    
    new_entry = WaitlistEntry(
        id=applicant_id,
        email=payload.email,
        name=payload.full_name,
        source="website_form",
        status="pending",
        youtube_channel=payload.youtube_channel,
        niche=payload.niche,
        country=payload.country,
        subscriber_count=payload.subscriber_count,
        reason=payload.why_join
    )
    
    db.add(new_entry)
    await db.commit()
    
    return WaitlistApplyResponse(
        success=True,
        applicant_id=applicant_id,
        credits_assigned=4 if payload.consent_public_showcase else 3,
        showcase_bonus=bool(payload.consent_public_showcase)
    )
