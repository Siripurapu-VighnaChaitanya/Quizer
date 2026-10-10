from typing import List, Optional
from fastapi import APIRouter, Query
from backend.app.models.schemas import TopicMeta
from backend.app.services.question_service import get_topics

router = APIRouter(prefix="/topics", tags=["Topics"])


@router.get("", response_model=List[TopicMeta])
def list_topics(subject: Optional[str] = Query(None, description="Filter topics by subject ID")):
    return get_topics(subject_id=subject)
