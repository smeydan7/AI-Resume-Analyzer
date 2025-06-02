import io
import os
from datetime import datetime

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings
import pdfplumber

class Settings(BaseSettings):
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173"]
    OPENAI_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()

app = FastAPI(title="AI Resume Analyzer")

# Enable CORS so React (localhost:5173) can reach us
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@app.get("/")
async def root():
    return {"message": "Welcome to AI Resume Analyzer API"}

@app.post("/parse-resume")
async def parse_resume(resume: UploadFile = File(...)):
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
        return {"text": text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF parsing failed: {e}")

