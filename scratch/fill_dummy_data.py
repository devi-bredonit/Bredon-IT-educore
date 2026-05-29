import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from datetime import date

load_dotenv(dotenv_path='backend/.env')
engine = create_engine(os.getenv('DATABASE_URL'))

with engine.connect() as conn:
    print("--- Filling dummy data for school 10 ---")
    # Identify students with missing critical data
    res = conn.execute(text("SELECT id FROM students WHERE school_id=10 AND (joining_date IS NULL OR dob IS NULL OR gender IS NULL)")).fetchall()
    ids = [row[0] for row in res]
    
    if not ids:
        print("No students found with missing critical criteria, but let's check all NULLs.")
    
    # Update logic for all NULLs in school 10
    update_query = text("""
        UPDATE students 
        SET 
            dob = COALESCE(dob, '2010-01-01'),
            gender = COALESCE(gender, 'Male'),
            blood_group = COALESCE(blood_group, 'O+'),
            admission_date = COALESCE(admission_date, '2024-04-01'),
            father_phone = COALESCE(father_phone, '0000000000'),
            mother_name = COALESCE(mother_name, 'Unknown'),
            mother_phone = COALESCE(mother_phone, '0000000000'),
            permanent_address = COALESCE(permanent_address, 'Update Required'),
            joining_date = COALESCE(joining_date, '2024-04-01'),
            email = COALESCE(email, 'student@example.com'),
            father_name = COALESCE(father_name, 'Unknown'),
            current_class = COALESCE(current_class, '1'),
            section = COALESCE(section, 'A')
        WHERE school_id = 10 
        AND (
            dob IS NULL OR gender IS NULL OR blood_group IS NULL OR 
            admission_date IS NULL OR father_phone IS NULL OR mother_name IS NULL OR
            mother_phone IS NULL OR permanent_address IS NULL OR joining_date IS NULL OR
            email IS NULL OR father_name IS NULL OR current_class IS NULL OR section IS NULL
        )
    """)
    
    result = conn.execute(update_query)
    conn.commit()
    print(f"Updated {result.rowcount} students in school 10.")
