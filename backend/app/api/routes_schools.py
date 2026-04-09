from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter(prefix="/schools", tags=["Schools"])

class SchoolBase(BaseModel):
    name: str
    logo: Optional[str] = None
    branch: Optional[str] = None
    code: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pin: Optional[str] = None
    contact: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    affiliation: Optional[str] = None
    type: Optional[str] = None
    academic_year: Optional[str] = None
    timezone: Optional[str] = None
    is_active: bool = True

class SchoolCreate(SchoolBase):
    pass

class SchoolRegister(BaseModel):
    school: SchoolCreate
    admin_name: str
    admin_username: str
    admin_password: str
    admin_email: str
    admin_phone: str

class School(SchoolBase):
    id: int

    class Config:
        from_attributes = True

@router.get("/", response_model=List[School])
def get_schools(db: Session = Depends(get_db)):
    return db.query(models.School).all()

@router.post("/", response_model=School)
def create_school(school: SchoolCreate, db: Session = Depends(get_db)):
    db_school = models.School(**school.model_dump())
    db.add(db_school)
    db.commit()
    db.refresh(db_school)
    return db_school

@router.get("/{school_id}", response_model=School)
def get_school(school_id: int, db: Session = Depends(get_db)):
    db_school = db.query(models.School).filter(models.School.id == school_id).first()
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")
    return db_school

@router.put("/{school_id}", response_model=School)
def update_school(school_id: int, school_update: SchoolCreate, db: Session = Depends(get_db)):
    db_school = db.query(models.School).filter(models.School.id == school_id).first()
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")
    
    update_data = school_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_school, key, value)
    
    db.commit()
    db.refresh(db_school)
    return db_school

@router.post("/register")
def register_school(data: SchoolRegister, db: Session = Depends(get_db)):
    # 1. Create School
    db_school = models.School(**data.school.model_dump())
    db.add(db_school)
    db.flush() # Get school ID
    
    # 2. Create Admin User
    db_user = models.User(
        school_id=db_school.id,
        username=data.admin_username,
        password=data.admin_password,
        role="Administrator",
        profile_name=data.admin_name,
        email=data.admin_email,
        phone=data.admin_phone,
        is_active=True
    )
    db.add(db_user)
    
    # 3. Seed Default Fee Heads
    default_heads = [
        {"name": "Tuition Fee", "description": "Core academic fee"},
        {"name": "Transport Fee", "description": "School bus / transportation"},
        {"name": "Exam Fee", "description": "Examination and assessment charges"},
        {"name": "Miscellaneous", "description": "Other incidental charges"}
    ]
    for head in default_heads:
        db_head = models.FeeHead(
            school_id=db_school.id,
            name=head["name"],
            description=head["description"],
            is_active=True
        )
        db.add(db_head)
        
    db.commit()
    db.refresh(db_school)
    return {"message": "School and Admin account created successfully", "school_id": db_school.id}

@router.delete("/{school_id}")
def delete_school(school_id: int, db: Session = Depends(get_db)):
    db_school = db.query(models.School).filter(models.School.id == school_id).first()
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")
    
    db.delete(db_school)
    db.commit()
    return {"detail": "School deleted"}
