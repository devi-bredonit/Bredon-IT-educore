from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app import models
from datetime import date as date_type
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/students", tags=["Students"])

class StudentBase(BaseModel):
    school_id: int
    name: str
    admission_number: str
    roll_number: Optional[str] = None
    dob: Optional[date_type] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    photo_url: Optional[str] = None
    current_class: str
    section: str
    admission_date: Optional[date_type] = None
    previous_school: Optional[str] = None
    father_name: Optional[str] = None
    father_phone: Optional[str] = None
    mother_name: Optional[str] = None
    mother_phone: Optional[str] = None
    guardian_details: Optional[str] = None
    email: Optional[str] = None
    permanent_address: Optional[str] = None
    communication_address: Optional[str] = None
    aadhar_number: Optional[str] = None
    transport_required: bool = False
    medical_conditions: Optional[str] = None
    documents_url: Optional[str] = None
    joining_date: Optional[date_type] = None
    payment_status: str = "Pending"
    
    # Fees info
    tuition: float = 0.0
    transport: float = 0.0
    exam: float = 0.0
    misc: float = 0.0

class StudentCreate(StudentBase):
    fee_allocations: Optional[List[Dict[str, Any]]] = None

class FeeAllocationResponse(BaseModel):
    id: int
    fee_head_id: int
    amount: float
    
    class Config:
        from_attributes = True

class Student(StudentBase):
    id: int
    total: float = 0.0
    paid: float = 0.0
    fee_allocations: List[FeeAllocationResponse] = []

    class Config:
        from_attributes = True

@router.get("/", response_model=List[Student])
def get_students(school_id: int, standard: str = "All", section: str = "All", db: Session = Depends(get_db)):
    query = db.query(models.Student).filter(models.Student.school_id == school_id)
    if standard != "All":
        query = query.filter(models.Student.current_class == standard)
    if section != "All":
        query = query.filter(models.Student.section == section)
    return query.all()

@router.post("/", response_model=Student)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    try:
        # Calculate initial total
        total = student.tuition + student.transport + student.exam + student.misc
        
        # Prepare student data
        student_data = student.model_dump()
        
        # POP fee_allocations to prevent SQLAlchemy from trying to save it directly
        fee_allocations_data = student_data.pop("fee_allocations", None)
        
        # Ensure dates are not empty strings
        for date_field in ["dob", "admission_date", "joining_date"]:
            if student_data.get(date_field) == "":
                student_data[date_field] = None

        db_student = models.Student(**student_data, total=total, paid=0.0)
        db.add(db_student)
        db.flush() # Get student ID
        
        # Handle dynamic fee allocations
        if fee_allocations_data:
            dynamic_total = 0
            for alloc in fee_allocations_data:
                fee_head_id = alloc.get("fee_head_id")
                amount = alloc.get("amount", 0.0)
                if fee_head_id:
                    db_fee = models.StudentFee(
                        student_id=db_student.id,
                        fee_head_id=fee_head_id,
                        amount=amount
                    )
                    db.add(db_fee)
                    dynamic_total += amount
            
            # If dynamic fees were provided, they should override or add to the total
            # For now, let's add them to the total
            db_student.total += dynamic_total
        
        db.commit()
        db.refresh(db_student)
        
        try:
            # Log Audit
            audit = models.AuditLog(
                school_id=student.school_id,
                action="Create Student",
                details=f"Student {student.name} ({student.admission_number}) onboarded",
                timestamp=date_type.today()
            )
            db.add(audit)
            db.commit()
        except Exception as audit_error:
            logger.error(f"Audit log failed: {audit_error}")
            # Don't fail the whole request if audit log fails
            pass
        
        return db_student
    except IntegrityError as ie:
        logger.error(f"Integrity error creating student: {str(ie)}")
        db.rollback()
        # Look for foreign key constraint failure
        error_msg = str(ie).lower()
        if "foreign key constraint fails" in error_msg:
            raise HTTPException(
                status_code=400,
                detail="Foreign key constraint failed. Please ensure the School exists in the database. Run the seeding script if necessary."
            )
        raise HTTPException(
            status_code=400,
            detail=f"Database integrity error: {str(ie)}"
        )
    except Exception as e:
        logger.error(f"Error creating student: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to create student. This may be due to a database connection issue: {str(e)}"
        )

@router.get("/{student_id}", response_model=Student)
def get_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

@router.put("/{student_id}", response_model=Student)
def update_student(student_id: int, student_update: StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    update_data = student_update.model_dump(exclude_unset=True)
    
    # POP fee_allocations
    update_data.pop("fee_allocations", None)
    
    # Handle dates
    for date_field in ["dob", "admission_date", "joining_date"]:
        if date_field in update_data and update_data[date_field] == "":
            update_data[date_field] = None
            
    for key, value in update_data.items():
        setattr(db_student, key, value)
    
    # Recalculate total including dynamic fee allocations
    dynamic_total = sum(alloc.amount for alloc in db_student.fee_allocations)
    db_student.total = db_student.tuition + db_student.transport + db_student.exam + db_student.misc + dynamic_total
    
    db.commit()
    db.refresh(db_student)
    return db_student

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Log Audit before delete
    audit = models.AuditLog(
        school_id=db_student.school_id,
        action="Delete Student",
        details=f"Student {db_student.name} deleted",
        timestamp=date_type.today()
    )
    db.add(audit)
    
    db.delete(db_student)
    db.commit()
    return {"detail": "Student deleted"}
