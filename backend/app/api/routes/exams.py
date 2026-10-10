from typing import List
from fastapi import APIRouter
from backend.app.models.schemas import ExamMeta
from backend.app.services.question_service import get_exams

router = APIRouter(prefix="/exams", tags=["Exams"])


@router.get("", response_model=List[ExamMeta])
def list_exams():
    return get_exams()
