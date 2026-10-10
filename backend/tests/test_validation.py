from fastapi.testclient import TestClient
from backend.app.main import app
from backend.scripts.validate_questions import validate_question_bank

client = TestClient(app)


def test_question_bank_strict_validation():
    report = validate_question_bank(strict_distribution=True)
    assert report["is_valid"] is True
    assert report["total_questions"] == 660
    assert report["topics_found"] == 33
    assert len(report["errors"]) == 0
    # Every difficulty level must have exactly 132 questions (4 per topic * 33 topics)
    for lvl in range(1, 6):
        assert report["difficulty_distribution"][lvl] == 132


def test_quality_report_api():
    response = client.get("/api/quality-report")
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is True
    assert data["total_questions"] == 660
    assert data["topics_found"] == 33
