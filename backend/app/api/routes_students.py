from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import date
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student as StudentModel

router = APIRouter(prefix="/students", tags=["Students"])

class StudentBase(BaseModel):
    school_id: int
    name: str 
    admission_number: str 
    roll_number: Optional[str] = None 
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
    communication_address: Optional[str] = None 
    aadhar_number: Optional[str] = None 
    transport_required: bool = False 
    medical_conditions: Optional[str] = None 
    documents_url: Optional[str] = None 
    joining_date: date 
    payment_status: str = "Pending" 

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int

    class Config:
        from_attributes = True

@router.get("/", response_model=List[StudentResponse])
def get_students(school_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(StudentModel)
    if school_id:
        query = query.filter(StudentModel.school_id == school_id)
    return query.all()

@router.post("/", response_model=StudentResponse)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    print(f"DEBUG: Received request to create student: {student.name} for school_id: {student.school_id}")
    try:
        db_student = StudentModel(**student.model_dump())
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        print(f"DEBUG: Successfully created student: {db_student.id}")
        return db_student
    except Exception as e:
        db.rollback()
        print(f"DEBUG: Failed to create student. Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{student_id}", response_model=StudentResponse)
def update_student(student_id: int, updated_student: StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    for key, value in updated_student.model_dump().items():
        setattr(db_student, key, value)
    
    db.commit()
    db.refresh(db_student)
    return db_student

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(db_student)
    db.commit()
    return {"detail": "Student deleted"}
