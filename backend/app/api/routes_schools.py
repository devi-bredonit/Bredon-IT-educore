from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import School as SchoolModel

router = APIRouter(prefix="/schools", tags=["Schools"])

class SchoolBase(BaseModel):
    name: str
    branch: Optional[str] = None
    code: Optional[str] = None
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
    logo: Optional[str] = None
    is_active: Optional[bool] = True

class SchoolCreate(SchoolBase):
    pass

class SchoolResponse(SchoolBase):
    id: int

    class Config:
        from_attributes = True

@router.get("/", response_model=List[SchoolResponse])
def get_schools(db: Session = Depends(get_db)):
    print("DEBUG: Fetching all schools from database...")
    try:
        schools = db.query(SchoolModel).all()
        print(f"DEBUG: Found {len(schools)} schools.")
        return schools
    except Exception as e:
        print(f"DEBUG: Failed to fetch schools. Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=SchoolResponse)
def create_school(school: SchoolCreate, db: Session = Depends(get_db)):
    print(f"DEBUG: Received request to create school: {school.name}")
    try:
        db_school = SchoolModel(
            name=school.name,
            branch=school.branch,
            code=school.code,
            address=school.address,
            city=school.city,
            state=school.state,
            pin=school.pin,
            contact=school.contact,
            email=school.email,
            website=school.website,
            affiliation=school.affiliation,
            type=school.type,
            academic_year=school.academic_year,
            timezone=school.timezone,
            logo=school.logo
        )
        db.add(db_school)
        db.commit()
        db.refresh(db_school)
        print(f"DEBUG: Successfully created school: {db_school.id}")
        return db_school
    except Exception as e:
        db.rollback()
        print(f"DEBUG: Failed to create school. Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{school_id}", response_model=SchoolResponse)
def get_school(school_id: int, db: Session = Depends(get_db)):
    school = db.query(SchoolModel).filter(SchoolModel.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return school

@router.put("/{school_id}", response_model=SchoolResponse)
def update_school(school_id: int, school_update: SchoolCreate, db: Session = Depends(get_db)):
    db_school = db.query(SchoolModel).filter(SchoolModel.id == school_id).first()
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")
    
    for key, value in school_update.model_dump().items():
        setattr(db_school, key, value)
    
    db.commit()
    db.refresh(db_school)
    return db_school

@router.delete("/{school_id}")
def delete_school(school_id: int, db: Session = Depends(get_db)):
    db_school = db.query(SchoolModel).filter(SchoolModel.id == school_id).first()
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")
    
    db.delete(db_school)
    db.commit()
    return {"message": "School deleted successfully"}
