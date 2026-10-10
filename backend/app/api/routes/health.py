from fastapi import APIRouter
from backend.app.services.question_service import get_question_by_id, filter_questions

router = APIRouter(tags=["Health"])


@router.get("/health")
def check_health():
    all_qs = filter_questions(include_answers=True)
    return {
        "status": "ok",
        "service": "ExamPrep Hub Backend",
        "questions_loaded": len(all_qs),
        "database_required": False,
        "storage": "In-Memory Cached JSON",
    }
