from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import date

router = APIRouter(prefix="/fees", tags=["Fees"])

class Payment(BaseModel):
    id: int
    student_id: int
    student_name: str
    fee_type: str # Tuition, Transport, Exam, Misc
    amount_paid: float
    discount_type: Optional[str] = None # General, Sibling, Teacher, Others
    payment_mode: str # Cash, UPI, Bank Transfer
    remarks: Optional[str] = None
    payment_date: date

# Mock database
payments_db = [
    Payment(id=1, student_id=1, student_name="John Doe", fee_type="Tuition", amount_paid=5000.0, payment_mode="Cash", payment_date=date(2023, 6, 1))
]

@router.get("/payments", response_model=List[Payment])
def get_payments():
    return payments_db

@router.post("/record-payment", response_model=Payment)
def record_payment(payment: Payment):
    payments_db.append(payment)
    return payment

@router.get("/dashboard-summary")
def get_dashboard_summary():
    total_received = sum(p.amount_paid for p in payments_db)
    pending_to_be_received = 25000.0 # Mocked
    total_student_count = 1 # Mocked
    return {
        "totalPaymentReceived": total_received,
        "pendingPaymentToBeReceived": pending_to_be_received,
        "totalStudentCount": total_student_count
    }
