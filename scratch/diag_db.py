import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')
engine = create_engine(os.getenv('DATABASE_URL'))

with engine.connect() as conn:
    print("--- User 'pramu' ---")
    res = conn.execute(text("SELECT id, username, role, school_id FROM users WHERE username='pramu'")).fetchone()
    print(res)
    
    print("\n--- Schools ---")
    res = conn.execute(text("SELECT id, name FROM schools")).fetchall()
    for row in res:
        print(row)
        
    print("\n--- Recent Students ---")
    res = conn.execute(text("SELECT id, name, school_id, admission_number FROM students ORDER BY id DESC LIMIT 5")).fetchall()
    for row in res:
        print(row)
