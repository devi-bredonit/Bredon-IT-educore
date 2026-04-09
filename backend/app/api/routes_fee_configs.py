from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter(prefix="/fee-configs", tags=["Fee Configurations"])

class FeeHeadBase(BaseModel):
    school_id: int
    name: str
    description: Optional[str] = None
    is_active: bool = True

class FeeHeadCreate(FeeHeadBase):
    pass

class FeeHead(FeeHeadBase):
    id: int

    class Config:
        from_attributes = True

@router.get("/heads", response_model=List[FeeHead])
def get_fee_heads(school_id: int, db: Session = Depends(get_db)):
    return db.query(models.FeeHead).filter(models.FeeHead.school_id == school_id).all()

@router.post("/heads", response_model=FeeHead)
def create_fee_head(fee_head: FeeHeadCreate, db: Session = Depends(get_db)):
    db_head = models.FeeHead(**fee_head.model_dump())
    db.add(db_head)
    db.commit()
    db.refresh(db_head)
    return db_head

@router.put("/heads/{head_id}", response_model=FeeHead)
def update_fee_head(head_id: int, fee_head: FeeHeadCreate, db: Session = Depends(get_db)):
    db_head = db.query(models.FeeHead).filter(models.FeeHead.id == head_id).first()
    if not db_head:
        raise HTTPException(status_code=404, detail="Fee Head not found")
    
    for key, value in fee_head.model_dump().items():
        setattr(db_head, key, value)
    
    db.commit()
    db.refresh(db_head)
    return db_head

@router.delete("/heads/{head_id}")
def delete_fee_head(head_id: int, db: Session = Depends(get_db)):
    db_head = db.query(models.FeeHead).filter(models.FeeHead.id == head_id).first()
    if not db_head:
        raise HTTPException(status_code=404, detail="Fee Head not found")
    
    db.delete(db_head)
    db.commit()
    return {"detail": "Fee Head deleted"}
