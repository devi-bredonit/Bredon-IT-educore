from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter(prefix="/fee-configs", tags=["Fee Configurations"])

FREQUENCY_OPTIONS = ["Annual", "Quarterly", "Monthly", "One-time", "Bi-Annual"]

class FeeHeadBase(BaseModel):
    school_id: int
    name: str
    description: Optional[str] = None
    amount: float = 0.0
    frequency: str = "Annual"
    class_name: Optional[str] = None
    is_active: bool = True

    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Fee type name cannot be empty')
        return v.strip()

    @field_validator('school_id')
    @classmethod
    def school_id_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('A valid school_id is required')
        return v

    @field_validator('amount')
    @classmethod
    def amount_must_be_non_negative(cls, v):
        if v < 0:
            raise ValueError('Amount cannot be negative')
        return v

    @field_validator('frequency')
    @classmethod
    def frequency_must_be_valid(cls, v):
        if v not in FREQUENCY_OPTIONS:
            raise ValueError(f'Frequency must be one of: {", ".join(FREQUENCY_OPTIONS)}')
        return v


class FeeHeadCreate(FeeHeadBase):
    pass


class FeeHead(FeeHeadBase):
    id: int

    class Config:
        from_attributes = True


@router.get("/heads", response_model=List[FeeHead])
def get_fee_heads(
    school_id: int,
    class_name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all fee heads for a specific school, optionally filtered by class."""
    school = db.query(models.School).filter(models.School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail=f"School with id {school_id} not found")

    query = db.query(models.FeeHead).filter(models.FeeHead.school_id == school_id)
    if class_name:
        query = query.filter(models.FeeHead.class_name == class_name)
    return query.order_by(models.FeeHead.name).all()


@router.get("/heads/classes", response_model=List[str])
def get_classes_for_school(school_id: int, db: Session = Depends(get_db)):
    """Get all distinct classes that have fee heads defined for a school."""
    rows = (
        db.query(models.FeeHead.class_name)
        .filter(models.FeeHead.school_id == school_id, models.FeeHead.class_name.isnot(None))
        .distinct()
        .all()
    )
    return [r[0] for r in rows if r[0]]


@router.post("/heads", response_model=FeeHead, status_code=201)
def create_fee_head(fee_head: FeeHeadCreate, db: Session = Depends(get_db)):
    """Create a new fee head for a school."""
    school = db.query(models.School).filter(models.School.id == fee_head.school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail=f"School with id {fee_head.school_id} not found")

    # Check for duplicate name within same school + session
    existing = db.query(models.FeeHead).filter(
        models.FeeHead.school_id == fee_head.school_id,
        models.FeeHead.name == fee_head.name,
        models.FeeHead.class_name == fee_head.class_name
    ).first()
    if existing:
        class_label = f" for class '{fee_head.class_name}'" if fee_head.class_name else ""
        raise HTTPException(
            status_code=409,
            detail=f"A fee type named '{fee_head.name}' already exists for this school{class_label}"
        )

    try:
        db_head = models.FeeHead(**fee_head.model_dump())
        db.add(db_head)
        db.commit()
        db.refresh(db_head)
        return db_head
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.put("/heads/{head_id}", response_model=FeeHead)
def update_fee_head(head_id: int, fee_head: FeeHeadCreate, db: Session = Depends(get_db)):
    """Update an existing fee head (name, description, amount, frequency, session, active status)."""
    db_head = db.query(models.FeeHead).filter(models.FeeHead.id == head_id).first()
    if not db_head:
        raise HTTPException(status_code=404, detail="Fee Head not found")

    # Check duplicate name (exclude self)
    existing = db.query(models.FeeHead).filter(
        models.FeeHead.school_id == fee_head.school_id,
        models.FeeHead.name == fee_head.name,
        models.FeeHead.class_name == fee_head.class_name,
        models.FeeHead.id != head_id
    ).first()
    if existing:
        class_label = f" for class '{fee_head.class_name}'" if fee_head.class_name else ""
        raise HTTPException(
            status_code=409,
            detail=f"A fee type named '{fee_head.name}' already exists{class_label}"
        )

    try:
        for key, value in fee_head.model_dump().items():
            setattr(db_head, key, value)
        db.commit()
        db.refresh(db_head)
        return db_head
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/heads/{head_id}")
def delete_fee_head(head_id: int, db: Session = Depends(get_db)):
    """Delete a fee head by ID."""
    db_head = db.query(models.FeeHead).filter(models.FeeHead.id == head_id).first()
    if not db_head:
        raise HTTPException(status_code=404, detail="Fee Head not found")

    try:
        db.delete(db_head)
        db.commit()
        return {"detail": "Fee Head deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
