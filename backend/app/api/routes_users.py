from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Users"])

class User(BaseModel):
    id: int
    school_id: Optional[int] = None
    username: str
    password: str
    role: str # Super Admin, Corporate User, Admin User
    profile_name: str
    phone: str
    email: str
    is_active: bool = True

# Mock database
users_db = [
    User(id=1, username="admin", password="password", role="Super Admin", profile_name="Super Admin", phone="1234567890", email="superadmin@educore.com")
]

@router.get("/", response_model=List[User])
def get_users(school_id: Optional[int] = None):
    if school_id:
        return [u for u in users_db if u.school_id == school_id]
    return users_db

@router.post("/", response_model=User)
def create_user(user: User):
    users_db.append(user)
    return user

@router.post("/login")
def login(credentials: dict):
    for user in users_db:
        if user.username == credentials["username"] and user.password == credentials["password"]:
            return {"user": user, "token": "mockjwttoken"}
    raise HTTPException(status_code=401, detail="Invalid username or password")
