import io
import os
from datetime import datetime

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pdfplumber

from .database import engine, SessionLocal, Base
from . import models, schemas
from pydantic_settings import BaseSettings

# Load settings (including OPENAI_API_KEY & DATABASE_URL)
class Settings(BaseSettings):
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173"]
    OPENAI_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Resume Analyzer")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@app.get("/")
async def root():
    return {"message": "Welcome to AI Resume Analyzer API"}

@app.post("/resumes/", response_model=schemas.ResumeOut)
async def create_resume(db: Session = Depends(get_db), resume: UploadFile = File(...)):
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    contents = await resume.read()
    try:
        text = ""
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        # Persist
        db_resume = models.Resume(raw_text=text.strip())
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
        return db_resume
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF parsing failed: {e}")

@app.get("/resumes/{resume_id}", response_model=schemas.ResumeOut)
def read_resume(resume_id: str, db: Session = Depends(get_db)):
    db_resume = db.query(models.Resume).get(resume_id)
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return db_resume
