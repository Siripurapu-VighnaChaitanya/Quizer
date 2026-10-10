from typing import Optional
from fastapi import HTTPException
from backend.app.services.question_service import get_question_by_id
from backend.app.models.schemas import (
    PracticeSubmitRequest,
    PracticeSubmitResponse,
    PracticeRevealRequest,
    PracticeRevealResponse,
    ProgressiveHint,
)


def evaluate_practice_answer(
    req: PracticeSubmitRequest,
) -> PracticeSubmitResponse:
    q = get_question_by_id(req.question_id)
    if not q:
        raise HTTPException(
            status_code=404, detail=f"Question '{req.question_id}' not found."
        )

    valid_options = [opt.id for opt in q.options]
    if req.selected_option not in valid_options:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid selected option '{req.selected_option}'. Must be one of {valid_options}.",
        )

    is_correct = req.selected_option == q.correct_option

    # Progressive difficulty hint
    prog_hint = None
    if is_correct:
        if q.difficulty < 5:
            prog_hint = ProgressiveHint(
                current_difficulty=q.difficulty,
                recommended_difficulty=q.difficulty + 1,
                reason=f"Great job! You mastered Level {q.difficulty}. Ready to advance to Level {q.difficulty + 1}.",
            )
        else:
            prog_hint = ProgressiveHint(
                current_difficulty=5,
                recommended_difficulty=5,
                reason="Excellent! You are practicing at maximum Exam Level (Level 5).",
            )
    else:
        if q.difficulty > 1:
            prog_hint = ProgressiveHint(
                current_difficulty=q.difficulty,
                recommended_difficulty=q.difficulty - 1,
                reason=f"Keep practicing! If Level {q.difficulty} feels tricky, try revising concepts at Level {q.difficulty - 1}.",
            )
        else:
            prog_hint = ProgressiveHint(
                current_difficulty=1,
                recommended_difficulty=1,
                reason="Review the explanation steps below before trying the next fundamental question.",
            )

    return PracticeSubmitResponse(
        question_id=q.id,
        is_correct=is_correct,
        selected_option=req.selected_option,
        correct_option=q.correct_option,
        explanation=q.explanation,
        progressive_suggestion=prog_hint,
    )


def reveal_practice_answer(req: PracticeRevealRequest) -> PracticeRevealResponse:
    q = get_question_by_id(req.question_id)
    if not q:
        raise HTTPException(
            status_code=404, detail=f"Question '{req.question_id}' not found."
        )

    return PracticeRevealResponse(
        question_id=q.id,
        correct_option=q.correct_option,
        explanation=q.explanation,
    )
