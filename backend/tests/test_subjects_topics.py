from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_list_subjects():
    response = client.get("/api/subjects")
    assert response.status_code == 200
    subjects = response.json()
    assert len(subjects) >= 4
    subject_ids = [s["id"] for s in subjects]
    assert "mathematics" in subject_ids
    assert "reasoning" in subject_ids
    assert "indian_polity" in subject_ids
    assert "general_science" in subject_ids


def test_list_topics():
    response = client.get("/api/topics")
    assert response.status_code == 200
    topics = response.json()
    available_topics = [t for t in topics if t["is_available"]]
    assert len(available_topics) == 10
    for t in available_topics:
        assert t["question_count"] == 20


def test_filter_topics_by_subject():
    response = client.get("/api/topics?subject=mathematics")
    assert response.status_code == 200
    topics = response.json()
    avail = [t for t in topics if t["is_available"]]
    assert len(avail) == 3
    avail_ids = [t["id"] for t in avail]
    assert "percentages" in avail_ids
    assert "ratio_and_proportion" in avail_ids
    assert "time_and_work" in avail_ids


def test_list_exams():
    response = client.get("/api/exams")
    assert response.status_code == 200
    exams = response.json()
    assert len(exams) >= 4
    exam_ids = [e["id"] for e in exams]
    assert "rrb-ntpc" in exam_ids
    assert "ssc-cgl" in exam_ids
