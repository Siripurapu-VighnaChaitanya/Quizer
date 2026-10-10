import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["questions_loaded"] == 660
    assert data["database_required"] is False


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "documentation" in response.json()
