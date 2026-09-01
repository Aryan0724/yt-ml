from typing import List, Optional
from sqlalchemy.orm import Session
from services.radar.service import RadarService
from services.idea.generator import IdeaGenerator
from services.idea.schemas import IdeaOutput, IdeaGenerationResponse
from db.models.idea import IdeaRecord

class IdeaService:
    def __init__(self):
        self.radar_service = RadarService()
        self.generator = IdeaGenerator()

    def generate_and_save_ideas(
        self,
        db: Session,
        workspace_id: str,
        user_id: str,
        topic_slug: str,
        region: str = "IN"
    ) -> IdeaGenerationResponse:
        
        # 1. Fetch real topic evidence from Radar
        topic_data = self.radar_service.get_topic_detail(topic_slug, region)
        
        # 2. Generate Ideas
        ideas = self.generator.generate_ideas(topic_data)
        
        # 3. Persist to Postgres
        for idea_out in ideas:
            record = IdeaRecord(
                id=idea_out.idea_id,
                workspace_id=workspace_id,
                user_id=user_id,
                topic_slug=topic_slug,
                canonical_name=topic_data.canonical_name,
                angle=idea_out.angle,
                title_concept=idea_out.title_concept,
                format=idea_out.format,
                audience=idea_out.audience,
                hook=idea_out.hook,
                why_now=idea_out.why_now,
                evidence=idea_out.evidence,
                difficulty=idea_out.difficulty
            )
            db.add(record)
            
        db.commit()
        
        return IdeaGenerationResponse(
            topic=topic_data.canonical_name,
            classification=topic_data.classification,
            captured_at=topic_data.captured_at,
            ideas=ideas
        )
        
    def get_ideas_for_topic(
        self,
        db: Session,
        workspace_id: str,
        topic_slug: str
    ) -> List[IdeaOutput]:
        records = db.query(IdeaRecord).filter(
            IdeaRecord.workspace_id == workspace_id,
            IdeaRecord.topic_slug == topic_slug
        ).order_by(IdeaRecord.created_at.desc()).all()
        
        return [
            IdeaOutput(
                idea_id=r.id,
                topic=r.canonical_name,
                angle=r.angle,
                title_concept=r.title_concept,
                format=r.format,
                audience=r.audience,
                hook=r.hook,
                why_now=r.why_now,
                evidence=r.evidence,
                difficulty=r.difficulty
            )
            for r in records
        ]
