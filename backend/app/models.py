from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Text
from app.database import Base

class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    branch = Column(String(255), nullable=True)
    code = Column(String(50))
    address = Column(String(500))
    city = Column(String(100))
    state = Column(String(100))
    pin = Column(String(20))
    contact = Column(String(100))
    email = Column(String(255))
    website = Column(String(255), nullable=True)
    affiliation = Column(String(100))
    type = Column(String(100))
    academic_year = Column(String(50))
    timezone = Column(String(50))
    logo = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    name = Column(String(255))
    admission_number = Column(String(100), unique=True)
    roll_number = Column(String(50), nullable=True)
    dob = Column(Date)
    gender = Column(String(50))
    blood_group = Column(String(20))
    photo_url = Column(String(500), nullable=True)
    current_class = Column(String(50))
    section = Column(String(50))
    admission_date = Column(Date)
    previous_school = Column(String(255), nullable=True)
    father_name = Column(String(255))
    father_phone = Column(String(50))
    mother_name = Column(String(255))
    mother_phone = Column(String(50))
    guardian_details = Column(String(500), nullable=True)
    email = Column(String(255))
    permanent_address = Column(String(500))
    communication_address = Column(String(500), nullable=True)
    aadhar_number = Column(String(50), nullable=True)
    transport_required = Column(Boolean, default=False)
    medical_conditions = Column(String(500), nullable=True)
    documents_url = Column(String(500), nullable=True)
    joining_date = Column(Date)
    payment_status = Column(String(50), default="Pending")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    username = Column(String(255), unique=True)
    password = Column(String(255))
    role = Column(String(50))
    profile_name = Column(String(255))
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    permissions = Column(Text, nullable=True)
