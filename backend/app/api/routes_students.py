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
    fee_allocations: Optional[List[dict]] = []
    extracurricular_activities: Optional[List[int]] = [] 

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int

    class Config:
        from_attributes = True

@router.get("/", response_model=List[StudentResponse])
def get_students(school_id: Optional[int] = None, role: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(StudentModel)
    if school_id:
        query = query.filter(StudentModel.school_id == school_id)
    
    result = []
    
    from app.models import ActivityEnrollment, StudentFee
    
    for s in students:
        s_dict = {
            c.name: getattr(s, c.name) for c in StudentModel.__table__.columns
        }
        
        if role == "Administration User":
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
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{student_id}", response_model=StudentResponse)
def update_student(student_id: int, updated_student: StudentCreate, db: Session = Depends(get_db)):
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

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(db_student)
    db.commit()
    return {"detail": "Student deleted"}
