from typing import List, Dict, Any
from fastapi import APIRouter
from backend.app.models.schemas import (
    MockTestGenerateRequest,
    MockTestGenerated,
    MockTestSubmitRequest,
    MockTestSubmitResponse,
)
from backend.app.services.mock_test_service import (
    generate_mock_test,
    evaluate_mock_test,
)
from backend.app.services.question_service import get_exams, get_subjects

router = APIRouter(prefix="/mock-tests", tags=["Mock Tests"])


@router.get("", response_model=Dict[str, Any])
def get_mock_test_presets():
    exams = get_exams()
    subjects = get_subjects()

    presets = [
        {
            "id": "full-rrb-ntpc",
            "title": "RRB NTPC CBT-1 Full Simulation",
            "type": "full_exam",
            "target_id": "rrb-ntpc",
            "questions_count": 20,
            "time_minutes": 20,
            "negative_marking": 0.33,
            "description": "20 Questions across Quant, Reasoning, Polity, and Science.",
        },
        {
            "id": "full-ssc-cgl",
            "title": "SSC CGL Tier-I General Simulation",
            "type": "full_exam",
            "target_id": "ssc-cgl",
            "questions_count": 20,
            "time_minutes": 20,
            "negative_marking": 0.50,
            "description": "20 Questions simulating Staff Selection Commission Tier-1 pattern.",
        },
        {
            "id": "subject-quant",
            "title": "Quantitative Aptitude Sectional",
            "type": "subject",
            "target_id": "mathematics",
            "questions_count": 15,
            "time_minutes": 15,
            "negative_marking": 0.33,
            "description": "Multi-topic speed test covering Percentages, Ratios, and Work.",
        },
        {
            "id": "subject-reasoning",
            "title": "Reasoning Ability Sectional",
            "type": "subject",
            "target_id": "reasoning",
            "questions_count": 15,
            "time_minutes": 15,
            "negative_marking": 0.33,
            "description": "Series, Blood Relations, and Direction Sense analytical mock.",
        },
        {
            "id": "subject-polity-science",
            "title": "General Awareness & Science Speed Test",
            "type": "subject",
            "target_id": "indian_polity",
            "questions_count": 15,
            "time_minutes": 10,
            "negative_marking": 0.33,
            "description": "Constitutional provisions and fundamental science recall.",
        },
    ]

    return {
        "presets": presets,
        "available_exams": exams,
        "available_subjects": subjects,
    }


@router.post("/generate", response_model=MockTestGenerated)
def create_mock_test(req: MockTestGenerateRequest):
    return generate_mock_test(req)


@router.post("/submit", response_model=MockTestSubmitResponse)
def submit_and_grade_mock_test(req: MockTestSubmitRequest):
    return evaluate_mock_test(req)
