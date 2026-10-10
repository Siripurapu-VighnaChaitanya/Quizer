from fastapi import APIRouter
from backend.scripts.validate_questions import validate_question_bank

router = APIRouter(prefix="/quality-report", tags=["Quality & Verification"])


@router.get("")
def get_quality_report():
    return validate_question_bank(strict_distribution=True)
