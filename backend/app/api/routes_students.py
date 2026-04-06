from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import date

router = APIRouter(prefix="/students", tags=["Students"])

class Student(BaseModel):
    id: int
    school_id: int
    name: str # Student Name*
    admission_number: str # Admission Number*
    roll_number: Optional[str] = None # Roll Number
    dob: date # Date of Birth*
    gender: str # Gender*
    blood_group: str # Blood Group*
    photo_url: Optional[str] = None # Photo
    current_class: str # Class*
    section: str # Section*
    admission_date: date # Admission Date
    previous_school: Optional[str] = None # Previous School
    father_name: str # Father Name*
    father_phone: str # Father Phone*
    mother_name: str # Mother Name*
    mother_phone: str # Mother Phone*
    guardian_details: Optional[str] = None # Guardian Details
    email: str # Email ID*
    permanent_address: str # Permanent Address*
    communication_address: Optional[str] = None # Communication Address
    aadhar_number: Optional[str] = None # Aadhar Number (optional)
    transport_required: bool = False # Transport Required (Yes/No)
    medical_conditions: Optional[str] = None # Medical Conditions
    documents_url: Optional[str] = None # Documents (TC, Birth Certificate)
    joining_date: date # Joining Date
    payment_status: str = "Pending" # Pending, Partial, Paid

# Mock database
students_db = [
    Student(id=1, school_id=1, name="John Doe", admission_number="ADM001", roll_number="10", dob=date(2010, 5, 1), gender="Male", blood_group="O+", current_class="10", section="A", admission_date=date(2023, 6, 1), father_name="Robert Doe", father_phone="9876543210", mother_name="Jane Doe", mother_phone="9876543211", email="johndoe@email.com", permanent_address="123, Main St", joining_date=date(2023, 6, 1), payment_status="Partial")
]

@router.get("/", response_model=List[Student])
def get_students(school_id: Optional[int] = None):
    if school_id:
        return [u for u in students_db if u.school_id == school_id]
    return students_db

@router.post("/", response_model=Student)
def create_student(student: Student):
    students_db.append(student)
    return student

@router.put("/{student_id}", response_model=Student)
def update_student(student_id: int, updated_student: Student):
    for i, student in enumerate(students_db):
        if student.id == student_id:
            students_db[i] = updated_student
            return updated_student
    raise HTTPException(status_code=404, detail="Student not found")

@router.delete("/{student_id}")
def delete_student(student_id: int):
    for i, student in enumerate(students_db):
        if student.id == student_id:
            del students_db[i]
            return {"detail": "Student deleted"}
    raise HTTPException(status_code=404, detail="Student not found")
