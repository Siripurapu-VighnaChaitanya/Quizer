from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_practice_submit_correct_answer():
    # MATH-PERCENT-001 correct answer is B
    payload = {"question_id": "MATH-PERCENT-001", "selected_option": "B"}
    response = client.post("/api/practice/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_correct"] is True
    assert data["selected_option"] == "B"
    assert data["correct_option"] == "B"
    assert "explanation" in data
    assert data["progressive_suggestion"] is not None
    assert data["progressive_suggestion"]["recommended_difficulty"] == 2


def test_practice_submit_incorrect_answer():
    # MATH-PERCENT-001 correct answer is B, submit A
    payload = {"question_id": "MATH-PERCENT-001", "selected_option": "A"}
    response = client.post("/api/practice/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_correct"] is False
    assert data["selected_option"] == "A"
    assert data["correct_option"] == "B"
    assert "explanation" in data


def test_practice_submit_invalid_option():
    payload = {"question_id": "MATH-PERCENT-001", "selected_option": "Z"}
    response = client.post("/api/practice/submit", json=payload)
    assert response.status_code == 400


def test_practice_submit_nonexistent_question():
    payload = {"question_id": "INVALID-ID-000", "selected_option": "A"}
    response = client.post("/api/practice/submit", json=payload)
    assert response.status_code == 404


def test_practice_reveal_answer():
    payload = {"question_id": "POL-RIGHTS-002"}
    response = client.post("/api/practice/reveal", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["question_id"] == "POL-RIGHTS-002"
    assert data["correct_option"] == "C"  # Article 17
    assert "untouchability" in data["explanation"]["simple"].lower()
