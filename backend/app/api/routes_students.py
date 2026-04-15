from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from pydantic import BaseModel
from datetime import date, datetime
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student as StudentModel
import csv
import io

router = APIRouter(prefix="/students", tags=["Students"])

class StudentBase(BaseModel):
    school_id: int
    name: str 
    admission_number: str 
    roll_number: Optional[str] = None 
    dob: Optional[date] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    photo_url: Optional[str] = None 
    current_class: Optional[str] = None
    section: Optional[str] = None
    admission_date: Optional[date] = None
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
    joining_date: Optional[date] = None
    payment_status: str = "Pending" 
    fee_allocations: Optional[List[dict]] = []
    extracurricular_activities: Optional[List[int]] = [] 

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int

    class Config:
        from_attributes = True

@router.get("/check-admission")
def check_admission(admission_number: str, school_id: int, db: Session = Depends(get_db)):
    exists = db.query(StudentModel).filter(
        StudentModel.admission_number == admission_number,
        StudentModel.school_id == school_id
    ).first() is not None
    return {"exists": exists}

@router.post("/import")
async def import_students(school_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    contents = await file.read()
    decoded = contents.decode('utf-8').splitlines()
    reader = csv.DictReader(decoded)
    
    students_to_add = []
    try:
        for row in reader:
            # Comprehensive field mapping
            student_data = {
                "school_id": school_id,
                "name": row.get("name"),
                "admission_number": row.get("admission_number"),
                "roll_number": row.get("roll_number"),
                "current_class": row.get("current_class"),
                "section": row.get("section"),
                "gender": row.get("gender"),
                "blood_group": row.get("blood_group"),
                "father_name": row.get("father_name"),
                "father_phone": row.get("father_phone"),
                "mother_name": row.get("mother_name"),
                "mother_phone": row.get("mother_phone"),
                "guardian_details": row.get("guardian_details"),
                "email": row.get("email"),
                "permanent_address": row.get("permanent_address"),
                "communication_address": row.get("communication_address"),
                "aadhar_number": row.get("aadhar_number"),
                "previous_school": row.get("previous_school"),
                "medical_conditions": row.get("medical_conditions"),
                "transport_required": row.get("transport_required", "").lower() in ["true", "yes", "1"],
                "payment_status": row.get("payment_status", "Pending"),
                "documents_url": row.get("documents_url"),
                "photo_url": row.get("photo_url")
            }
            
            # Handle dates if present
            for date_field in ["dob", "admission_date", "joining_date"]:
                if row.get(date_field):
                    try:
                        # Attempt standard ISO format first
                        val = row[date_field]
                        if '-' in val:
                            student_data[date_field] = datetime.strptime(val, '%Y-%m-%d').date()
                        elif '/' in val:
                            student_data[date_field] = datetime.strptime(val, '%d/%m/%Y').date()
                    except ValueError:
                        pass 
            
            # Handle numerics
            for num_field in ["tuition", "transport", "exam", "misc", "total", "paid"]:
                if row.get(num_field):
                    try:
                        student_data[num_field] = float(row[num_field])
                    except ValueError:
                        student_data[num_field] = 0.0

            db_student = StudentModel(**student_data)
            db.add(db_student)
        
        db.commit()
        return {"message": f"Successfully imported students"}
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Import failed: Duplicate admission number detected.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

@router.get("/", response_model=List[StudentResponse])
def get_students(school_id: Optional[int] = None, role: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(StudentModel)
    if school_id:
        query = query.filter(StudentModel.school_id == school_id)
    
    result = []
    
    from app.models import ActivityEnrollment, StudentFee
    
    students = query.all()
    for s in students:
        s_dict = {
            c.name: getattr(s, c.name) for c in StudentModel.__table__.columns
        }
        
        if role in ["Administration User", "Staff", "Teacher"]: # Restricted roles
            # Strip sensitive fee data
            s_dict["tuition"] = 0.0
            s_dict["transport"] = 0.0
            s_dict["exam"] = 0.0
            s_dict["misc"] = 0.0
            s_dict["total"] = 0.0
            s_dict["paid"] = 0.0
            s_dict["fee_allocations"] = []
        else:
            fees = db.query(StudentFee).filter(StudentFee.student_id == s.id).all()
            s_dict["fee_allocations"] = [{"fee_head_id": f.fee_head_id, "amount": f.amount} for f in fees]
            
        acts = db.query(ActivityEnrollment).filter(ActivityEnrollment.student_id == s.id).all()
        s_dict["extracurricular_activities"] = [a.activity_id for a in acts]
        
        result.append(s_dict)
            
    return result

@router.post("/", response_model=StudentResponse)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    try:
        data = student.model_dump()
        fees = data.pop("fee_allocations", [])
        activities = data.pop("extracurricular_activities", [])
        
        # Calculate total fee
        total_fee = sum(f.get("amount", 0) for f in fees)
        data["total"] = total_fee
        
        from app.models import ActivityEnrollment, StudentFee
        
        db_student = StudentModel(**data)
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        
        # Add fees
        for fee in fees:
            db_fee = StudentFee(student_id=db_student.id, fee_head_id=fee["fee_head_id"], amount=fee["amount"])
            db.add(db_fee)
            
        # Add activities
        for act_id in activities:
            db_act = ActivityEnrollment(student_id=db_student.id, activity_id=act_id, enrollment_date=date.today())
            db.add(db_act)
            
        db.commit()
        
        # Build response dict
        resp = {c.name: getattr(db_student, c.name) for c in StudentModel.__table__.columns}
        resp["fee_allocations"] = fees
        resp["extracurricular_activities"] = activities
        return resp
    except IntegrityError as e:
        db.rollback()
        error_msg = str(e)
        if "Duplicate entry" in error_msg and "students.admission_number" in error_msg:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Admission number already exists")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database integrity error: " + error_msg)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{student_id}", response_model=StudentResponse)
def update_student(student_id: int, updated_student: StudentCreate, db: Session = Depends(get_db)):
    try:
        db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
        if not db_student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        data = updated_student.model_dump()
        fees = data.pop("fee_allocations", [])
        activities = data.pop("extracurricular_activities", [])
        
        total_fee = sum(f.get("amount", 0) for f in fees)
        data["total"] = total_fee
        
        for key, value in data.items():
            setattr(db_student, key, value)
            
        from app.models import ActivityEnrollment, StudentFee
        
        # Sync fees
        db.query(StudentFee).filter(StudentFee.student_id == student_id).delete()
        for fee in fees:
            db.add(StudentFee(student_id=student_id, fee_head_id=fee["fee_head_id"], amount=fee["amount"]))
            
        # Sync activities
        db.query(ActivityEnrollment).filter(ActivityEnrollment.student_id == student_id).delete()
        for act_id in activities:
            db.add(ActivityEnrollment(student_id=student_id, activity_id=act_id, enrollment_date=date.today()))
        
        db.commit()
        db.refresh(db_student)
        
        resp = {c.name: getattr(db_student, c.name) for c in StudentModel.__table__.columns}
        resp["fee_allocations"] = fees
        resp["extracurricular_activities"] = activities
        return resp
    except IntegrityError as e:
        db.rollback()
        error_msg = str(e)
        if "Duplicate entry" in error_msg and "students.admission_number" in error_msg:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Admission number already exists")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Database integrity error: " + error_msg)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(db_student)
    db.commit()
    return {"detail": "Student deleted"}
