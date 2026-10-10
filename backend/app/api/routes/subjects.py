from typing import List
from fastapi import APIRouter
from backend.app.models.schemas import SubjectMeta
from backend.app.services.question_service import get_subjects

router = APIRouter(prefix="/subjects", tags=["Subjects"])


@router.get("", response_model=List[SubjectMeta])
def list_subjects():
    return get_subjects()
