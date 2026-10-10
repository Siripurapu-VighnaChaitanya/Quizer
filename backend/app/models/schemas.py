from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class OptionModel(BaseModel):
    id: str = Field(..., description="Option ID: A, B, C, or D")
    text: str = Field(..., description="Option statement text")


class MethodExplanation(BaseModel):
    name: str
    steps: List[str]


class ExplanationModel(BaseModel):
    simple: str
    steps: List[str] = []
    methods: Optional[List[MethodExplanation]] = None
    exam_tip: Optional[str] = None
    reference: Optional[str] = None


class QuestionPublic(BaseModel):
    id: str
    subject: str
    topic: str
    difficulty: int
    question: str
    options: List[OptionModel]


class QuestionDetail(QuestionPublic):
    correct_option: str
    explanation: ExplanationModel


class PracticeSubmitRequest(BaseModel):
    question_id: str
    selected_option: str


class ProgressiveHint(BaseModel):
    current_difficulty: int
    recommended_difficulty: int
    reason: str


class PracticeSubmitResponse(BaseModel):
    question_id: str
    is_correct: bool
    selected_option: str
    correct_option: str
    explanation: ExplanationModel
    progressive_suggestion: Optional[ProgressiveHint] = None


class PracticeRevealRequest(BaseModel):
    question_id: str


class PracticeRevealResponse(BaseModel):
    question_id: str
    correct_option: str
    explanation: ExplanationModel


class TopicMeta(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    file: Optional[str] = None
    is_available: bool = False
    question_count: int = 0


class SubjectMeta(BaseModel):
    id: str
    name: str
    short_name: str
    description: str
    icon: str
    color: str
    topics: List[TopicMeta]


class MarkingScheme(BaseModel):
    correct: float = 1.0
    negative: float = 0.33
    time_per_q_seconds: int = 60


class ExamMeta(BaseModel):
    id: str
    name: str
    organization: str
    stage: str
    description: str
    marking_scheme: MarkingScheme
    subjects_included: List[str]


class MockTestGenerateRequest(BaseModel):
    test_type: str = Field(..., description="topic | subject | full_exam")
    target_id: str = Field(..., description="Topic ID, Subject ID, or Exam ID")
    question_count: int = Field(default=10, ge=5, le=50)
    difficulty: Optional[int] = Field(default=None, ge=1, le=5)
    time_limit_minutes: Optional[int] = Field(default=15, ge=0, le=180)
    negative_marking: float = Field(default=0.33, ge=0.0, le=1.0)
    marks_per_question: float = Field(default=1.0, ge=0.5, le=5.0)


class MockTestGenerated(BaseModel):
    test_id: str
    title: str
    subtitle: str
    question_count: int
    time_limit_minutes: Optional[int]
    negative_marking: float
    marks_per_question: float
    questions: List[QuestionPublic]


class MockTestSubmitRequest(BaseModel):
    test_id: str
    time_spent_seconds: int = 0
    answers: Dict[str, str] = {}
    flagged: List[str] = []
    marks_per_question: float = 1.0
    negative_marking: float = 0.33


class QuestionReview(BaseModel):
    question_id: str
    subject: str
    topic: str
    difficulty: int
    question: str
    options: List[OptionModel]
    selected_option: Optional[str] = None
    correct_option: str
    status: str  # "correct", "incorrect", "skipped"
    marks_awarded: float
    explanation: ExplanationModel


class MockTestSubmitResponse(BaseModel):
    test_id: str
    total_questions: int
    attempted: int
    correct: int
    incorrect: int
    skipped: int
    total_marks: float
    score: float
    percentage: float
    accuracy: float
    time_spent_seconds: int
    questions_review: List[QuestionReview]
