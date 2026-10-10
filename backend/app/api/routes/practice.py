from fastapi import APIRouter
from backend.app.models.schemas import (
    PracticeSubmitRequest,
    PracticeSubmitResponse,
    PracticeRevealRequest,
    PracticeRevealResponse,
)
from backend.app.services.practice_service import (
    evaluate_practice_answer,
    reveal_practice_answer,
)

router = APIRouter(prefix="/practice", tags=["Practice"])


@router.post("/submit", response_model=PracticeSubmitResponse)
def submit_practice_answer(req: PracticeSubmitRequest):
    return evaluate_practice_answer(req)


@router.post("/reveal", response_model=PracticeRevealResponse)
def reveal_answer_solution(req: PracticeRevealRequest):
    return reveal_practice_answer(req)
