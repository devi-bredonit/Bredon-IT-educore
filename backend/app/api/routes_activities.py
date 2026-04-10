from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from datetime import date

router = APIRouter(prefix="/activities", tags=["Extracurricular Activities"])

class ActivityBase(BaseModel):
    school_id: int
    name: str
    description: Optional[str] = None
    capacity: Optional[int] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: int
    enrolled_count: int = 0

    class Config:
        from_attributes = True

class EnrollmentBase(BaseModel):
    activity_id: int
    student_id: int

@router.get("/", response_model=List[ActivityResponse])
def get_activities(school_id: int, db: Session = Depends(get_db)):
    activities = db.query(models.ExtracurricularActivity).filter(models.ExtracurricularActivity.school_id == school_id).all()
    
    result = []
    for act in activities:
        enrolled_count = db.query(models.ActivityEnrollment).filter(models.ActivityEnrollment.activity_id == act.id).count()
        act_dict = act.__dict__.copy()
        act_dict["enrolled_count"] = enrolled_count
        result.append(act_dict)
        
    return result

@router.post("/", response_model=ActivityResponse)
def create_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    db_act = models.ExtracurricularActivity(**activity.model_dump())
    db.add(db_act)
    db.commit()
    db.refresh(db_act)
    
    act_dict = db_act.__dict__.copy()
    act_dict["enrolled_count"] = 0
    return act_dict

@router.put("/{activity_id}", response_model=ActivityResponse)
def update_activity(activity_id: int, activity: ActivityCreate, db: Session = Depends(get_db)):
    db_act = db.query(models.ExtracurricularActivity).filter(models.ExtracurricularActivity.id == activity_id).first()
    if not db_act:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    for key, value in activity.model_dump().items():
        setattr(db_act, key, value)
        
    db.commit()
    db.refresh(db_act)
    
    enrolled_count = db.query(models.ActivityEnrollment).filter(models.ActivityEnrollment.activity_id == db_act.id).count()
    act_dict = db_act.__dict__.copy()
    act_dict["enrolled_count"] = enrolled_count
    return act_dict

@router.delete("/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    db_act = db.query(models.ExtracurricularActivity).filter(models.ExtracurricularActivity.id == activity_id).first()
    if not db_act:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    # Delete related enrollments first
    db.query(models.ActivityEnrollment).filter(models.ActivityEnrollment.activity_id == activity_id).delete()
    
    db.delete(db_act)
    db.commit()
    return {"detail": "Activity deleted"}

@router.post("/enroll")
def enroll_student(enrollment: EnrollmentBase, db: Session = Depends(get_db)):
    # Check if already enrolled
    existing = db.query(models.ActivityEnrollment).filter(
        models.ActivityEnrollment.activity_id == enrollment.activity_id,
        models.ActivityEnrollment.student_id == enrollment.student_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Student already enrolled in this activity")
        
    act = db.query(models.ExtracurricularActivity).filter(models.ExtracurricularActivity.id == enrollment.activity_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    enrolled_count = db.query(models.ActivityEnrollment).filter(models.ActivityEnrollment.activity_id == enrollment.activity_id).count()
    if act.capacity and enrolled_count >= act.capacity:
        raise HTTPException(status_code=400, detail="Activity is at full capacity")
        
    db_enrollment = models.ActivityEnrollment(
        activity_id=enrollment.activity_id,
        student_id=enrollment.student_id,
        enrollment_date=date.today()
    )
    db.add(db_enrollment)
    db.commit()
    return {"detail": "Successfully enrolled student"}

@router.delete("/enroll/{activity_id}/{student_id}")
def remove_enrollment(activity_id: int, student_id: int, db: Session = Depends(get_db)):
    db_enrollment = db.query(models.ActivityEnrollment).filter(
        models.ActivityEnrollment.activity_id == activity_id,
        models.ActivityEnrollment.student_id == student_id
    ).first()
    
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
        
    db.delete(db_enrollment)
    db.commit()
    return {"detail": "Enrollment removed"}

@router.get("/{activity_id}/students")
def get_enrolled_students(activity_id: int, db: Session = Depends(get_db)):
    enrollments = db.query(models.ActivityEnrollment).filter(models.ActivityEnrollment.activity_id == activity_id).all()
    students = []
    for enr in enrollments:
        if enr.student:
            students.append({
                "id": enr.student.id,
                "name": enr.student.name,
                "current_class": enr.student.current_class,
                "section": enr.student.section,
                "admission_number": enr.student.admission_number,
                "enrollment_date": enr.enrollment_date
            })
    return students
