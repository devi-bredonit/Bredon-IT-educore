from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User as UserModel

router = APIRouter(prefix="/users", tags=["Users"])

class UserBase(BaseModel):
    school_id: Optional[int] = None
    username: str
    role: str
    profile_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = True
    permissions: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    school_id: Optional[int] = None
    username: Optional[str] = None
    role: Optional[str] = None
    profile_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None
    permissions: Optional[str] = None
    password: Optional[str] = None

@router.get("/", response_model=List[UserResponse])
def get_users(school_id: Optional[int] = None, db: Session = Depends(get_db)):
    try:
        query = db.query(UserModel)
        if school_id:
            query = query.filter(UserModel.school_id == school_id)
        return query.all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if username already exists
    existing = db.query(UserModel).filter(UserModel.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    try:
        db_user = UserModel(**user.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        update_data = user_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{user_id}/toggle", response_model=UserResponse)
def toggle_user_status(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.is_active = not db_user.is_active
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        db.delete(db_user)
        db.commit()
        return {"message": "User deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
def login(credentials: dict, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(
        UserModel.username == credentials.get("username"),
        UserModel.password == credentials.get("password")
    ).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"user": UserResponse.model_validate(user), "token": "mockjwttoken"}
