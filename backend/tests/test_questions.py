from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_get_all_questions_public():
    response = client.get("/api/questions")
    assert response.status_code == 200
    questions = response.json()
    assert len(questions) == 660
    # Ensure answers are not leaked by default
    sample = questions[0]
    assert "id" in sample
    assert "question" in sample
    assert "options" in sample
    assert "correct_option" not in sample
    assert "explanation" not in sample


def test_filter_by_topic():
    response = client.get("/api/questions?topic=percentages")
    assert response.status_code == 200
    questions = response.json()
    assert len(questions) == 20
    assert all(q["topic"] == "percentages" for q in questions)


def test_filter_by_difficulty():
    response = client.get("/api/questions?topic=percentages&difficulty=3")
    assert response.status_code == 200
    questions = response.json()
    assert len(questions) == 4
    assert all(q["difficulty"] == 3 for q in questions)


def test_get_single_question():
    response = client.get("/api/questions/MATH-PERCENT-001")
    assert response.status_code == 200
    q = response.json()
    assert q["id"] == "MATH-PERCENT-001"
    assert len(q["options"]) == 4


def test_get_single_question_with_details():
    response = client.get("/api/questions/MATH-PERCENT-001?include_answers=true")
    assert response.status_code == 200
    q = response.json()
    assert q["correct_option"] == "B"
    assert "simple" in q["explanation"]
    assert "methods" in q["explanation"]


def test_get_nonexistent_question():
    response = client.get("/api/questions/DOES-NOT-EXIST-999")
    assert response.status_code == 404
