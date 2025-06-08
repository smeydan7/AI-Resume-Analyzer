from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class ResumeCreate(BaseModel):
    raw_text: str

class ResumeOut(BaseModel):
    id: UUID
    uploaded_at: datetime
    raw_text: str

    class Config:
        orm_mode = True
