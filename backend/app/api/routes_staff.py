from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from datetime import date

router = APIRouter(prefix="/staff", tags=["Staff & Teachers"])

class StaffBase(BaseModel):
    school_id: int
    name: str
    role: str
    skills_details: Optional[str] = None
    contact_info: Optional[str] = None
    is_active: bool = True
    photo_url: Optional[str] = None
    joining_date: Optional[date] = None
    salary: Optional[float] = None

class StaffCreate(StaffBase):
    pass

class StaffResponse(StaffBase):
    id: int

    class Config:
        from_attributes = True

@router.get("/", response_model=List[StaffResponse])
def get_staff(school_id: int, db: Session = Depends(get_db)):
    return db.query(models.Staff).filter(models.Staff.school_id == school_id).all()

@router.post("/", response_model=StaffResponse)
def create_staff(staff: StaffCreate, db: Session = Depends(get_db)):
    db_staff = models.Staff(**staff.model_dump())
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

@router.put("/{staff_id}", response_model=StaffResponse)
def update_staff(staff_id: int, staff: StaffCreate, db: Session = Depends(get_db)):
    db_staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not db_staff:
        raise HTTPException(status_code=404, detail="Staff not found")
        
    for key, value in staff.model_dump().items():
        setattr(db_staff, key, value)
        
    db.commit()
    db.refresh(db_staff)
    return db_staff

@router.delete("/{staff_id}")
def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    db_staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not db_staff:
        raise HTTPException(status_code=404, detail="Staff not found")
        
    db.delete(db_staff)
    db.commit()
    return {"detail": "Staff deleted"}
