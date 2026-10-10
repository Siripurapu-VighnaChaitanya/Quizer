import random
import uuid
import time
from typing import Dict, List, Optional
from fastapi import HTTPException
from backend.app.models.schemas import (
    MockTestGenerateRequest,
    MockTestGenerated,
    MockTestSubmitRequest,
    MockTestSubmitResponse,
    QuestionPublic,
    QuestionReview,
    QuestionDetail,
)
from backend.app.services.question_service import (
    get_question_by_id,
    filter_questions,
    get_manifest,
    get_exams,
)

# In-memory store for active generated mock tests: test_id -> test metadata
_active_mock_tests: Dict[str, Dict] = {}


def generate_mock_test(req: MockTestGenerateRequest) -> MockTestGenerated:
    manifest = get_manifest()
    pool: List[QuestionDetail] = []
    title = ""
    subtitle = ""

    if req.test_type == "topic":
        # Find topic name
        topic_name = req.target_id.replace("_", " ").title()
        for sub in manifest.get("subjects", []):
            for top in sub.get("topics", []):
                if top["id"] == req.target_id:
                    topic_name = top["name"]
                    break
        title = f"{topic_name} — Topic Mock Test"
        subtitle = "Subject-specific timed sectional practice"
        pool = filter_questions(topic=req.target_id, difficulty=req.difficulty, include_answers=True)

    elif req.test_type == "subject":
        subject_name = req.target_id.replace("_", " ").title()
        for sub in manifest.get("subjects", []):
            if sub["id"] == req.target_id:
                subject_name = sub["name"]
                break
        title = f"{subject_name} — Subject Mock Test"
        subtitle = "Comprehensive multi-topic subject test"
        pool = filter_questions(subject=req.target_id, difficulty=req.difficulty, include_answers=True)

    elif req.test_type == "full_exam":
        exam_meta = None
        for ex in get_exams():
            if ex.id == req.target_id:
                exam_meta = ex
                break
        if not exam_meta:
            raise HTTPException(status_code=404, detail=f"Exam '{req.target_id}' not found.")

        title = f"{exam_meta.name} — Full Simulation"
        subtitle = f"Real exam pattern simulation ({exam_meta.organization})"

        # Gather from all subjects included
        all_pool = []
        for s_id in exam_meta.subjects_included:
            all_pool.extend(filter_questions(subject=s_id, difficulty=req.difficulty, include_answers=True))
        pool = all_pool

        # Override default marking scheme from exam metadata if not customized
        if req.negative_marking == 0.33 and exam_meta.marking_scheme:
            req.negative_marking = exam_meta.marking_scheme.negative
            req.marks_per_question = exam_meta.marking_scheme.correct

    else:
        raise HTTPException(
            status_code=400, detail=f"Invalid test_type '{req.test_type}'. Must be 'topic', 'subject', or 'full_exam'."
        )

    if not pool:
        raise HTTPException(
            status_code=404,
            detail=f"No questions available matching criteria (target: {req.target_id}, difficulty: {req.difficulty}).",
        )

    # Balance or sample questions
    selected_count = min(req.question_count, len(pool))
    # Stratified or randomized sampling
    shuffled_pool = list(pool)
    random.shuffle(shuffled_pool)
    selected_questions = shuffled_pool[:selected_count]

    test_id = f"test-{uuid.uuid4().hex[:12]}"

    # Save metadata authoritatively in memory
    _active_mock_tests[test_id] = {
        "test_id": test_id,
        "title": title,
        "question_ids": [q.id for q in selected_questions],
        "created_at": time.time(),
        "time_limit_minutes": req.time_limit_minutes,
        "marks_per_question": req.marks_per_question,
        "negative_marking": req.negative_marking,
    }

    # Public questions only (no answers / explanations)
    public_questions = [
        QuestionPublic(
            id=q.id,
            subject=q.subject,
            topic=q.topic,
            difficulty=q.difficulty,
            question=q.question,
            options=q.options,
        )
        for q in selected_questions
    ]

    return MockTestGenerated(
        test_id=test_id,
        title=title,
        subtitle=subtitle,
        question_count=len(public_questions),
        time_limit_minutes=req.time_limit_minutes,
        negative_marking=req.negative_marking,
        marks_per_question=req.marks_per_question,
        questions=public_questions,
    )


def evaluate_mock_test(req: MockTestSubmitRequest) -> MockTestSubmitResponse:
    test_meta = _active_mock_tests.get(req.test_id)
    if not test_meta:
        # Fallback if session expired: try to grade based on answers keys if questions are valid
        q_ids = list(req.answers.keys())
        if not q_ids:
            raise HTTPException(status_code=404, detail=f"Active test '{req.test_id}' not found.")
        test_meta = {
            "test_id": req.test_id,
            "question_ids": q_ids,
            "marks_per_question": req.marks_per_question,
            "negative_marking": req.negative_marking,
        }

    q_ids = test_meta["question_ids"]
    marks_per_q = test_meta.get("marks_per_question", req.marks_per_question)
    neg_mark = test_meta.get("negative_marking", req.negative_marking)

    total_questions = len(q_ids)
    correct_count = 0
    incorrect_count = 0
    skipped_count = 0
    total_score = 0.0
    questions_review = []

    for qid in q_ids:
        q_detail = get_question_by_id(qid)
        if not q_detail:
            continue

        user_ans = req.answers.get(qid)
        if not user_ans:
            status = "skipped"
            marks_awarded = 0.0
            skipped_count += 1
        elif user_ans == q_detail.correct_option:
            status = "correct"
            marks_awarded = marks_per_q
            correct_count += 1
            total_score += marks_awarded
        else:
            status = "incorrect"
            marks_awarded = -abs(neg_mark)
            incorrect_count += 1
            total_score += marks_awarded

        questions_review.append(
            QuestionReview(
                question_id=q_detail.id,
                subject=q_detail.subject,
                topic=q_detail.topic,
                difficulty=q_detail.difficulty,
                question=q_detail.question,
                options=q_detail.options,
                selected_option=user_ans,
                correct_option=q_detail.correct_option,
                status=status,
                marks_awarded=round(marks_awarded, 2),
                explanation=q_detail.explanation,
            )
        )

    attempted_count = correct_count + incorrect_count
    max_marks = total_questions * marks_per_q
    percentage = round((total_score / max_marks * 100), 2) if max_marks > 0 else 0.0
    accuracy = round((correct_count / attempted_count * 100), 2) if attempted_count > 0 else 0.0

    return MockTestSubmitResponse(
        test_id=req.test_id,
        total_questions=total_questions,
        attempted=attempted_count,
        correct=correct_count,
        incorrect=incorrect_count,
        skipped=skipped_count,
        total_marks=round(max_marks, 2),
        score=round(total_score, 2),
        percentage=max(0.0, percentage),
        accuracy=accuracy,
        time_spent_seconds=req.time_spent_seconds,
        questions_review=questions_review,
    )
