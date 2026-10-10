import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any
from backend.app.models.schemas import (
    QuestionDetail,
    QuestionPublic,
    SubjectMeta,
    TopicMeta,
    ExamMeta,
    OptionModel,
    ExplanationModel,
)

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
MANIFEST_PATH = DATA_DIR / "manifest.json"

_manifest_cache: Optional[dict] = None
_questions_by_id: Dict[str, QuestionDetail] = {}
_questions_by_topic: Dict[str, List[QuestionDetail]] = {}
_questions_by_subject: Dict[str, List[QuestionDetail]] = {}


def load_question_bank(force_reload: bool = False):
    global _manifest_cache, _questions_by_id, _questions_by_topic, _questions_by_subject

    if _manifest_cache is not None and not force_reload:
        return

    logger.info("Loading question bank from JSON storage...")
    if not MANIFEST_PATH.exists():
        raise FileNotFoundError(f"Manifest file not found at {MANIFEST_PATH}")

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    questions_by_id = {}
    questions_by_topic = {}
    questions_by_subject = {}

    for subject in manifest.get("subjects", []):
        sub_id = subject["id"]
        questions_by_subject[sub_id] = []

        for topic in subject.get("topics", []):
            top_id = topic["id"]
            questions_by_topic[top_id] = []

            if topic.get("is_available") and topic.get("file"):
                filepath = DATA_DIR / topic["file"]
                if filepath.exists():
                    try:
                        with open(filepath, "r", encoding="utf-8") as tf:
                            raw_questions = json.load(tf)
                            for q in raw_questions:
                                q_obj = QuestionDetail(**q)
                                questions_by_id[q_obj.id] = q_obj
                                questions_by_topic[top_id].append(q_obj)
                                questions_by_subject[sub_id].append(q_obj)
                    except Exception as e:
                        logger.error(f"Error loading topic file {filepath}: {e}")

    _manifest_cache = manifest
    _questions_by_id = questions_by_id
    _questions_by_topic = questions_by_topic
    _questions_by_subject = questions_by_subject
    logger.info(f"Loaded {len(_questions_by_id)} questions across {len(_questions_by_topic)} topics.")


def get_manifest():
    if _manifest_cache is None:
        load_question_bank()
    return _manifest_cache


def get_subjects() -> List[SubjectMeta]:
    manifest = get_manifest()
    result = []
    for sub in manifest.get("subjects", []):
        topics = []
        for top in sub.get("topics", []):
            count = len(_questions_by_topic.get(top["id"], []))
            topics.append(
                TopicMeta(
                    id=top["id"],
                    name=top["name"],
                    description=top.get("description"),
                    file=top.get("file"),
                    is_available=top.get("is_available", False),
                    question_count=count if top.get("is_available") else 0,
                )
            )
        result.append(
            SubjectMeta(
                id=sub["id"],
                name=sub["name"],
                short_name=sub["short_name"],
                description=sub["description"],
                icon=sub["icon"],
                color=sub["color"],
                topics=topics,
            )
        )
    return result


def get_topics(subject_id: Optional[str] = None) -> List[TopicMeta]:
    manifest = get_manifest()
    topics = []
    for sub in manifest.get("subjects", []):
        if subject_id is None or sub["id"] == subject_id:
            for top in sub.get("topics", []):
                count = len(_questions_by_topic.get(top["id"], []))
                topics.append(
                    TopicMeta(
                        id=top["id"],
                        name=top["name"],
                        description=top.get("description"),
                        file=top.get("file"),
                        is_available=top.get("is_available", False),
                        question_count=count if top.get("is_available") else 0,
                    )
                )
    return topics


def get_exams() -> List[ExamMeta]:
    manifest = get_manifest()
    return [ExamMeta(**ex) for ex in manifest.get("exams", [])]


def get_question_by_id(question_id: str) -> Optional[QuestionDetail]:
    if not _questions_by_id:
        load_question_bank()
    return _questions_by_id.get(question_id)


def get_question_public(question_id: str) -> Optional[QuestionPublic]:
    detail = get_question_by_id(question_id)
    if not detail:
        return None
    return QuestionPublic(
        id=detail.id,
        subject=detail.subject,
        topic=detail.topic,
        difficulty=detail.difficulty,
        question=detail.question,
        options=detail.options,
    )


def filter_questions(
    topic: Optional[str] = None,
    subject: Optional[str] = None,
    difficulty: Optional[int] = None,
    include_answers: bool = False,
) -> List[Any]:
    if not _questions_by_id:
        load_question_bank()

    if topic:
        pool = _questions_by_topic.get(topic, [])
    elif subject:
        pool = _questions_by_subject.get(subject, [])
    else:
        pool = list(_questions_by_id.values())

    if difficulty is not None:
        pool = [q for q in pool if q.difficulty == difficulty]

    if include_answers:
        return pool
    else:
        return [
            QuestionPublic(
                id=q.id,
                subject=q.subject,
                topic=q.topic,
                difficulty=q.difficulty,
                question=q.question,
                options=q.options,
            )
            for q in pool
        ]
