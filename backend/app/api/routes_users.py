from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter(prefix="/users", tags=["Users"])

class User(BaseModel):
    id: Optional[int] = None
    school_id: Optional[int] = None
    username: str
    password: str
    role: str # Super Admin, Corporate User, Admin User
    profile_name: str
    phone: str
    email: str
    is_active: bool = True

    class Config:
        from_attributes = True

@router.get("/", response_model=List[User])
def get_users(school_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.User)
    if school_id:
        query = query.filter(models.User.school_id == school_id)
    return query.all()

@router.post("/", response_model=User)
def create_user(user: User, db: Session = Depends(get_db)):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(credentials: dict, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.username == credentials["username"],
        models.User.password == credentials["password"]
    ).first()
    
    if user:
        return {"user": user, "token": "mockjwttoken"}
    raise HTTPException(status_code=401, detail="Invalid username or password")
