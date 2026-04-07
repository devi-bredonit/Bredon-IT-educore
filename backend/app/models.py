from sqlalchemy import Column, Integer, String, Boolean, Date, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    branch = Column(String(255))
    code = Column(String(50), unique=True)
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    pin = Column(String(20))
    contact = Column(String(20))
    email = Column(String(255))
    website = Column(String(255))
    affiliation = Column(String(100))
    type = Column(String(100))
    academic_year = Column(String(20))
    timezone = Column(String(50))

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    username = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(50))
    profile_name = Column(String(255))
    phone = Column(String(20))
    email = Column(String(255))
    is_active = Column(Boolean, default=True)

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"))
    name = Column(String(255), nullable=False)
    admission_number = Column(String(50), unique=True)
    roll_number = Column(String(50))
    dob = Column(Date)
    gender = Column(String(20))
    blood_group = Column(String(10))
    photo_url = Column(String(255))
    current_class = Column(String(50))
    section = Column(String(50))
    admission_date = Column(Date)
    previous_school = Column(String(255))
    father_name = Column(String(255))
    father_phone = Column(String(20))
    mother_name = Column(String(255))
    mother_phone = Column(String(20))
    guardian_details = Column(Text)
    email = Column(String(255))
    permanent_address = Column(Text)
    communication_address = Column(Text)
    aadhar_number = Column(String(50))
    transport_required = Column(Boolean, default=False)
    medical_conditions = Column(Text)
    documents_url = Column(String(255))
    joining_date = Column(Date)
    payment_status = Column(String(50), default="Pending")
    
    # Fee details (for mock/existing logic compatibility)
    tuition = Column(Float, default=0.0)
    transport = Column(Float, default=0.0)
    exam = Column(Float, default=0.0)
    misc = Column(Float, default=0.0)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    student_name = Column(String(255))
    fee_type = Column(String(100))
    amount_paid = Column(Float)
    discount_type = Column(String(100))
    payment_mode = Column(String(50))
    remarks = Column(Text)
    payment_date = Column(Date)
