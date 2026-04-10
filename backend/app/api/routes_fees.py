from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from datetime import date as date_type

router = APIRouter(prefix="/fees", tags=["Fees"])

class PaymentBase(BaseModel):
    student_id: int
    student_name: str
    fee_type: str
    amount_paid: float
    discount_type: str
    payment_mode: str
    remarks: Optional[str] = None
    payment_date: Optional[date_type] = None
    transaction_id: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    id: int
    school_id: Optional[int] = None

    class Config:
        from_attributes = True

@router.get("/dashboard-summary")
def get_dashboard_summary(school_id: int, standard: str = "All", section: str = "All", db: Session = Depends(get_db)):
    # school_id = 0 means Super Admin view (all schools)
    query = db.query(models.Student)
    if school_id > 0:
        query = query.filter(models.Student.school_id == school_id)
        
    if standard != "All":
        query = query.filter(models.Student.current_class == standard)
    if section != "All":
        query = query.filter(models.Student.section == section)
    
    students = query.all()
    total_received = sum(s.paid for s in students)
    total_expected = sum(s.total for s in students)
    pending = total_expected - total_received
    
    return {
        "totalPaymentReceived": total_received,
        "pendingPaymentToBeReceived": pending,
        "totalStudentCount": len(students)
    }

@router.post("/record-payment", response_model=Payment)
def record_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    # Find student
    student = db.query(models.Student).filter(models.Student.id == payment.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Update student paid amount
    student.paid += payment.amount_paid
    if student.paid >= student.total:
        student.payment_status = "Paid"
    elif student.paid > 0:
        student.payment_status = "Partial"
    
    # Create payment record
    db_payment = models.Payment(
        **payment.model_dump(),
        school_id=student.school_id
    )
    db.add(db_payment)
    
    # Capture Audit
    audit = models.AuditLog(
        school_id=student.school_id,
        student_id=student.id,
        action="Record Payment",
        details=f"Payment of ₹{payment.amount_paid} recorded for {student.name}. Mode: {payment.payment_mode}",
        timestamp=date_type.today()
    )
    db.add(audit)
    
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.get("/audits", response_model=List[dict])
def get_audits(school_id: int, student_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.AuditLog).filter(models.AuditLog.school_id == school_id)
    if student_id:
        query = query.filter(models.AuditLog.student_id == student_id)
    
    audits = query.order_by(models.AuditLog.timestamp.desc()).all()
    return [{"id": a.id, "action": a.action, "details": a.details, "timestamp": a.timestamp.isoformat()} for a in audits]
