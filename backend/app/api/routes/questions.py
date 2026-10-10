from typing import List, Optional, Union
from fastapi import APIRouter, Query, HTTPException
from backend.app.models.schemas import QuestionPublic, QuestionDetail
from backend.app.services.question_service import filter_questions, get_question_by_id

router = APIRouter(prefix="/questions", tags=["Questions"])


@router.get("", response_model=List[Union[QuestionDetail, QuestionPublic]])
def get_questions(
    topic: Optional[str] = Query(None, description="Topic ID (e.g. percentages)"),
    subject: Optional[str] = Query(None, description="Subject ID (e.g. mathematics)"),
    difficulty: Optional[int] = Query(None, ge=1, le=5, description="Difficulty Level (1-5)"),
    include_answers: bool = Query(False, description="Whether to include correct answer and explanations"),
):
    return filter_questions(
        topic=topic,
        subject=subject,
        difficulty=difficulty,
        include_answers=include_answers,
    )


@router.get("/{question_id}", response_model=Union[QuestionDetail, QuestionPublic])
def get_single_question(
    question_id: str,
    include_answers: bool = Query(False, description="Whether to include correct answer and explanation"),
):
    q = get_question_by_id(question_id)
    if not q:
        raise HTTPException(status_code=404, detail=f"Question '{question_id}' not found.")

    if include_answers:
        return q
    else:
        return QuestionPublic(
            id=q.id,
            subject=q.subject,
            topic=q.topic,
            difficulty=q.difficulty,
            question=q.question,
            options=q.options,
        )
