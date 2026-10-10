import logging
import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.app.services.question_service import load_question_bank
from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.exams import router as exams_router
from backend.app.api.routes.subjects import router as subjects_router
from backend.app.api.routes.topics import router as topics_router
from backend.app.api.routes.questions import router as questions_router
from backend.app.api.routes.practice import router as practice_router
from backend.app.api.routes.mock_tests import router as mock_tests_router
from backend.app.api.routes.quality import router as quality_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("ExamPrepHub")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("ExamPrep Hub backend starting up...")
    load_question_bank()
    yield
    logger.info("ExamPrep Hub backend shutting down...")


app = FastAPI(
    title="ExamPrep Hub API",
    description="Government Exam Question-Practice Platform API (No-Database Architecture)",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes under /api
app.include_router(health_router, prefix="/api")
app.include_router(exams_router, prefix="/api")
app.include_router(subjects_router, prefix="/api")
app.include_router(topics_router, prefix="/api")
app.include_router(questions_router, prefix="/api")
app.include_router(practice_router, prefix="/api")
app.include_router(mock_tests_router, prefix="/api")
app.include_router(quality_router, prefix="/api")


frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
serve_frontend_flag = os.getenv("SERVE_FRONTEND", "").lower() in ("1", "true", "yes")

if serve_frontend_flag and frontend_dist.exists():
    if (frontend_dist / "assets").exists():
        app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        target = frontend_dist / full_path
        if full_path and target.is_file():
            return FileResponse(target)
        return FileResponse(frontend_dist / "index.html")
else:
    @app.get("/")
    def root():
        return {
            "message": "Welcome to ExamPrep Hub API. Visit /docs for the interactive Swagger UI.",
            "documentation": "/docs",
            "health": "/api/health",
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
