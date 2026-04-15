import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')
engine = create_engine(os.getenv('DATABASE_URL'))

with engine.connect() as conn:
    print("--- Students for School 10 ---")
    res = conn.execute(text("SELECT id, name, admission_number, current_class, section FROM students WHERE school_id=10")).fetchall()
    for row in res:
        print(row)
    
    print("\n--- Fee Heads for School 10 ---")
    res = conn.execute(text("SELECT id, name FROM fee_heads WHERE school_id=10")).fetchall()
    for row in res:
        print(row)
