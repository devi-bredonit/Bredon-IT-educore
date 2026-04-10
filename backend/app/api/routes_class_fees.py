from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter(prefix="/class-fees", tags=["Class Fee Structure"])

class ClassFeeBase(BaseModel):
    school_id: int
    class_name: str
    fee_head_id: int
    amount: float

class ClassFeeCreate(ClassFeeBase):
    pass

class ClassFeeResponse(ClassFeeBase):
    id: int

    class Config:
        from_attributes = True

@router.get("/", response_model=List[ClassFeeResponse])
def get_class_fees(school_id: int, db: Session = Depends(get_db)):
    return db.query(models.ClassFeeStructure).filter(models.ClassFeeStructure.school_id == school_id).all()

@router.post("/", response_model=ClassFeeResponse)
def create_or_update_class_fee(class_fee: ClassFeeCreate, db: Session = Depends(get_db)):
    # Check if already exists for this class and fee head
    existing = db.query(models.ClassFeeStructure).filter(
        models.ClassFeeStructure.school_id == class_fee.school_id,
        models.ClassFeeStructure.class_name == class_fee.class_name,
        models.ClassFeeStructure.fee_head_id == class_fee.fee_head_id
    ).first()
    
    if existing:
        existing.amount = class_fee.amount
        db.commit()
        db.refresh(existing)
        return existing
    else:
        db_fee = models.ClassFeeStructure(**class_fee.model_dump())
        db.add(db_fee)
        db.commit()
        db.refresh(db_fee)
        return db_fee

@router.delete("/{id}")
def delete_class_fee(id: int, db: Session = Depends(get_db)):
    db_fee = db.query(models.ClassFeeStructure).filter(models.ClassFeeStructure.id == id).first()
    if not db_fee:
        raise HTTPException(status_code=404, detail="Class Fee Structure not found")
        
    db.delete(db_fee)
    db.commit()
    return {"detail": "Class Fee Structure deleted"}
