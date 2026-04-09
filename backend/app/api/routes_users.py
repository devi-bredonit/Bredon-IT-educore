from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter(prefix="/users", tags=["Users"])

class UserBase(BaseModel):
    school_id: Optional[int] = None
    username: str
    role: str # Super Admin, Corporate User, Admin User
    profile_name: str
    phone: str
    email: str
    is_active: bool = True
    permissions: Optional[str] = None # JSON permissions

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

@router.get("/", response_model=List[UserResponse])
def get_users(school_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.User)
    if school_id:
        query = query.filter(models.User.school_id == school_id)
    return query.all()

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserBase, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
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
        # Include school info if it exists
        school_info = None
        if user.school_id:
            school = db.query(models.School).filter(models.School.id == user.school_id).first()
            if school:
                school_info = school
                
        return {
            "user": user, 
            "token": "mockjwttoken",
            "school_info": school_info
        }
    raise HTTPException(status_code=401, detail="Invalid username or password")

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted"}
