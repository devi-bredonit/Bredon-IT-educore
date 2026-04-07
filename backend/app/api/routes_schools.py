from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter(prefix="/schools", tags=["Schools"])

class School(BaseModel):
    id: Optional[int] = None
    name: str
    branch: Optional[str] = None
    code: str
    address: str
    city: str
    state: str
    pin: str
    contact: str
    email: str
    website: Optional[str] = None
    affiliation: str
    type: str
    academic_year: str
    timezone: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[School])
def get_schools(db: Session = Depends(get_db)):
    return db.query(models.School).all()

@router.post("/", response_model=School)
def create_school(school: School, db: Session = Depends(get_db)):
    db_school = models.School(**school.model_dump())
    db.add(db_school)
    db.commit()
    db.refresh(db_school)
    return db_school

@router.get("/{school_id}", response_model=School)
def get_school(school_id: int, db: Session = Depends(get_db)):
    db_school = db.query(models.School).filter(models.School.id == school_id).first()
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")
    return db_school
