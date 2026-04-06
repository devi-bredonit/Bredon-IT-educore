from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/schools", tags=["Schools"])

class School(BaseModel):
    id: int
    name: str
    branch: Optional[str] = None
    code: str
    address: str
    city: str
    state: str
    pin: str
    contact: str
    email: str
    website: Optional[str] = None
    affiliation: str
    type: str
    academic_year: str
    timezone: str

# Mock database
schools_db = []

@router.get("/", response_model=List[School])
def get_schools():
    return schools_db

@router.post("/", response_model=School)
def create_school(school: School):
    schools_db.append(school)
    return school

@router.get("/{school_id}", response_model=School)
def get_school(school_id: int):
    for school in schools_db:
        if school.id == school_id:
            return school
    raise HTTPException(status_code=404, detail="School not found")
