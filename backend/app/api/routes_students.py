from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from datetime import date

router = APIRouter(prefix="/students", tags=["Students"])

class Student(BaseModel):
    id: Optional[int] = None
    school_id: int
    name: str
    admission_number: str
    roll_number: str
    dob: date
    gender: str
    blood_group: str
    photo_url: Optional[str] = None
    current_class: str
    section: str
    admission_date: date
    previous_school: Optional[str] = None
    father_name: str
    father_phone: str
    mother_name: str
    mother_phone: str
    guardian_details: Optional[str] = None
    email: str
    permanent_address: str
    communication_address: str
    aadhar_number: str
    transport_required: bool = False
    medical_conditions: Optional[str] = None
    documents_url: Optional[str] = None
    joining_date: date
    payment_status: str = "Pending"
    
    # Fee details
    tuition: float = 0.0
    transport: float = 0.0
    exam: float = 0.0
    misc: float = 0.0

    class Config:
        from_attributes = True

@router.get("/", response_model=List[Student])
def get_students(school_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.Student)
    if school_id:
        query = query.filter(models.Student.school_id == school_id)
    return query.all()

@router.post("/", response_model=Student)
def create_student(student: Student, db: Session = Depends(get_db)):
    db_student = models.Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.get("/{student_id}", response_model=Student)
def get_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

@router.put("/{student_id}", response_model=Student)
def update_student(student_id: int, updated_student: Student, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    for key, value in updated_student.model_dump(exclude_unset=True).items():
        setattr(db_student, key, value)
    
    db.commit()
    db.refresh(db_student)
    return db_student

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(db_student)
    db.commit()
    return {"detail": "Student deleted"}
