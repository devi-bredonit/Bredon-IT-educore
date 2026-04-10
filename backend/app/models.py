from sqlalchemy import Column, Integer, String, Boolean, Date, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    logo = Column(Text, nullable=True) # Store logo URL or base64
    branch = Column(String(255))
    code = Column(String(50), unique=True)
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    pin = Column(String(20))
    contact = Column(String(50))
    email = Column(String(255))
    website = Column(String(255))
    affiliation = Column(String(100)) # CBSE / ICSE / etc.
    type = Column(String(100)) # Day / Boarding / Co-ed
    academic_year = Column(String(50)) # e.g. "2024–2025" or "April–March"
    timezone = Column(String(50))
    is_active = Column(Boolean, default=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    username = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(50)) # Super Admin, Corporate User, Admin User
    profile_name = Column(String(255))
    phone = Column(String(20))
    email = Column(String(255))
    is_active = Column(Boolean, default=True)
    permissions = Column(Text, nullable=True) # JSON string of permissions/rights

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
    photo_url = Column(Text, nullable=True)
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
    documents_url = Column(Text) # JSON mapping of document names to URLs
    joining_date = Column(Date)
    payment_status = Column(String(50), default="Pending")
    
    # Fee structure (Annual totals)
    tuition = Column(Float, default=0.0)
    transport = Column(Float, default=0.0)
    exam = Column(Float, default=0.0)
    misc = Column(Float, default=0.0)
    total = Column(Float, default=0.0)
    paid = Column(Float, default=0.0)

    fee_allocations = relationship("StudentFee", back_populates="student")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    student_name = Column(String(255))
    fee_type = Column(String(100)) # Tuition, Transport, Exam, Misc
    amount_paid = Column(Float)
    discount_type = Column(String(100)) # General, Sibling, Teacher, Others
    payment_mode = Column(String(50)) # Cash, UPI, Bank Transfer
    remarks = Column(Text)
    payment_date = Column(Date)
    transaction_id = Column(String(255), nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
    action = Column(String(255)) # e.g. "Record Payment", "Create Student"
    details = Column(Text)
    timestamp = Column(Date)

class FeeHead(Base):
    __tablename__ = "fee_heads"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    school = relationship("School")

class StudentFee(Base):
    __tablename__ = "student_fees"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    fee_head_id = Column(Integer, ForeignKey("fee_heads.id"))
    amount = Column(Float, default=0.0)

    student = relationship("Student", back_populates="fee_allocations")
    fee_head = relationship("FeeHead")

class ClassFeeStructure(Base):
    __tablename__ = "class_fee_structure"
    
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"))
    class_name = Column(String(50), nullable=False) # e.g. "1", "2", "LKG"
    fee_head_id = Column(Integer, ForeignKey("fee_heads.id"))
    amount = Column(Float, default=0.0)
    
    school = relationship("School")
    fee_head = relationship("FeeHead")

class Staff(Base):
    __tablename__ = "staff"
    
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"))
    name = Column(String(255), nullable=False)
    role = Column(String(100), nullable=False) # e.g. Teacher, Principal, Assistant
    skills_details = Column(Text)
    contact_info = Column(String(255))
    is_active = Column(Boolean, default=True)
    photo_url = Column(Text, nullable=True)
    joining_date = Column(Date, nullable=True)

class ExtracurricularActivity(Base):
    __tablename__ = "extracurricular_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    capacity = Column(Integer, nullable=True)
    
    enrollments = relationship("ActivityEnrollment", back_populates="activity")

class ActivityEnrollment(Base):
    __tablename__ = "activity_enrollments"
    
    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("extracurricular_activities.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    enrollment_date = Column(Date)
    
    activity = relationship("ExtracurricularActivity", back_populates="enrollments")
    student = relationship("Student", back_populates="activity_enrollments")

Student.activity_enrollments = relationship("ActivityEnrollment", back_populates="student")
