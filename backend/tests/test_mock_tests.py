from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_mock_test_presets():
    response = client.get("/api/mock-tests")
    assert response.status_code == 200
    data = response.json()
    assert "presets" in data
    assert len(data["presets"]) >= 3


def test_generate_mock_test_by_topic():
    payload = {
        "test_type": "topic",
        "target_id": "percentages",
        "question_count": 10,
        "time_limit_minutes": 15,
        "negative_marking": 0.33,
        "marks_per_question": 1.0,
    }
    response = client.post("/api/mock-tests/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "test_id" in data
    assert data["question_count"] == 10
    assert len(data["questions"]) == 10
    # Ensure answers are not revealed in generated mock test
    for q in data["questions"]:
        assert "correct_option" not in q
        assert "explanation" not in q


def test_generate_mock_test_by_full_exam():
    payload = {
        "test_type": "full_exam",
        "target_id": "rrb-ntpc",
        "question_count": 20,
        "time_limit_minutes": 20,
        "negative_marking": 0.33,
        "marks_per_question": 1.0,
    }
    response = client.post("/api/mock-tests/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["question_count"] == 20
    assert len(data["questions"]) == 20


def test_evaluate_mock_test_submission():
    # 1. Generate test with 5 questions
    gen_payload = {
        "test_type": "topic",
        "target_id": "percentages",
        "question_count": 5,
        "time_limit_minutes": 10,
        "negative_marking": 0.25,
        "marks_per_question": 1.0,
    }
    gen_res = client.post("/api/mock-tests/generate", json=gen_payload).json()
    test_id = gen_res["test_id"]
    q_ids = [q["id"] for q in gen_res["questions"]]

    # We know MATH-PERCENT-001 has correct answer B, MATH-PERCENT-002 has correct answer B
    # Let's craft known answers
    answers = {}
    if "MATH-PERCENT-001" in q_ids:
        answers["MATH-PERCENT-001"] = "B"  # Correct (+1.0)
    if "MATH-PERCENT-002" in q_ids:
        answers["MATH-PERCENT-002"] = "A"  # Incorrect (-0.25)

    sub_payload = {
        "test_id": test_id,
        "time_spent_seconds": 120,
        "answers": answers,
        "marks_per_question": 1.0,
        "negative_marking": 0.25,
    }
    eval_res = client.post("/api/mock-tests/submit", json=sub_payload)
    assert eval_res.status_code == 200
    res_data = eval_res.json()

    assert res_data["total_questions"] == 5
    assert res_data["time_spent_seconds"] == 120
    assert len(res_data["questions_review"]) == 5
    # Ensure review contains detailed explanations for each question
    for rev in res_data["questions_review"]:
        assert "correct_option" in rev
        assert "status" in rev
        assert "explanation" in rev
        assert rev["status"] in ["correct", "incorrect", "skipped"]
