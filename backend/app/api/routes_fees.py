from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import models

router = APIRouter(prefix="/fees", tags=["Fees"])

class Payment(BaseModel):
    id: Optional[int] = None
    student_id: int
    student_name: str
    fee_type: str # Tuition, Transport, Exam, Misc
    amount_paid: float
    discount_type: Optional[str] = None # General, Sibling, Teacher, Others
    payment_mode: str # Cash, UPI, Bank Transfer
    remarks: Optional[str] = None
    payment_date: date

    class Config:
        from_attributes = True

@router.get("/payments", response_model=List[Payment])
def get_payments(db: Session = Depends(get_db)):
    return db.query(models.Payment).all()

@router.post("/record-payment", response_model=Payment)
def record_payment(payment: Payment, db: Session = Depends(get_db)):
    db_payment = models.Payment(**payment.model_dump())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.get("/dashboard-summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_received = db.query(func.sum(models.Payment.amount_paid)).scalar() or 0.0
    
    # Calculate pending (this would ideally be based on student.total - student.paid)
    # For now, we'll keep the mock logic for pending but use database for student count
    total_student_count = db.query(models.Student).count()
    
    # Mocked pending calculation based on student fee details
    total_fees = db.query(func.sum(models.Student.tuition + models.Student.transport + models.Student.exam + models.Student.misc)).scalar() or 0.0
    pending_to_be_received = total_fees - total_received
    
    return {
        "totalPaymentReceived": total_received,
        "pendingPaymentToBeReceived": max(0, pending_to_be_received),
        "totalStudentCount": total_student_count
    }
