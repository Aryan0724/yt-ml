from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db.session import get_db
from routers.dependencies import get_current_user_workspace
from services.idea.schemas import IdeaGenerationRequest, IdeaGenerationResponse, IdeaOutput
from services.idea.service import IdeaService

router = APIRouter(prefix="/ideas", tags=["Ideas"])

@router.post("/generate", response_model=IdeaGenerationResponse)
def generate_ideas(
    request: IdeaGenerationRequest,
    workspace_ctx: dict = Depends(get_current_user_workspace),
    db: Session = Depends(get_db)
):
    service = IdeaService()
    try:
        return service.generate_and_save_ideas(
            db=db,
            workspace_id=workspace_ctx["workspace_id"],
            user_id=workspace_ctx["user_id"],
            topic_slug=request.topic_slug,
            region=request.region
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[IdeaOutput])
def get_ideas(
    topic_slug: str,
    workspace_ctx: dict = Depends(get_current_user_workspace),
    db: Session = Depends(get_db)
):
    service = IdeaService()
    return service.get_ideas_for_topic(
        db=db,
        workspace_id=workspace_ctx["workspace_id"],
        topic_slug=topic_slug
    )
