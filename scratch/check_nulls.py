import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')
engine = create_engine(os.getenv('DATABASE_URL'))

# Required fields in StudentBase
required_fields = [
    "school_id", "name", "admission_number", "dob", "gender", 
    "blood_group", "current_class", "section", "admission_date", 
    "father_name", "father_phone", "mother_name", "mother_phone", 
    "email", "permanent_address", "joining_date"
]

with engine.connect() as conn:
    print("--- Checking for students with NULL required fields (School 10) ---")
    for field in required_fields:
        res = conn.execute(text(f"SELECT COUNT(*) FROM students WHERE school_id=10 AND {field} IS NULL")).scalar()
        if res > 0:
            print(f"Field '{field}' has {res} NULL values for school 10")
            # Get some example IDs
            ids = conn.execute(text(f"SELECT id FROM students WHERE school_id=10 AND {field} IS NULL LIMIT 3")).fetchall()
            print(f"Example IDs: {[row[0] for row in ids]}")
        else:
            # print(f"Field '{field}' is clean")
            pass
            
    print("\n--- Checking for all students in school 10 ---")
    res = conn.execute(text("SELECT id, name FROM students WHERE school_id=10")).fetchall()
    print(f"Total students in school 10: {len(res)}")
