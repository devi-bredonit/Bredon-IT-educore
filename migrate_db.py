import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

migrations = [
    "ALTER TABLE schools ADD COLUMN is_active BOOLEAN DEFAULT 1",
    "ALTER TABLE users ADD COLUMN permissions TEXT",
    "ALTER TABLE students ADD COLUMN tuition FLOAT DEFAULT 0.0",
    "ALTER TABLE students ADD COLUMN transport FLOAT DEFAULT 0.0",
    "ALTER TABLE students ADD COLUMN exam FLOAT DEFAULT 0.0",
    "ALTER TABLE students ADD COLUMN misc FLOAT DEFAULT 0.0",
    "ALTER TABLE students ADD COLUMN total FLOAT DEFAULT 0.0",
    "ALTER TABLE students ADD COLUMN paid FLOAT DEFAULT 0.0",
    "ALTER TABLE payments ADD COLUMN school_id INT",
    "ALTER TABLE payments ADD COLUMN transaction_id VARCHAR(255)"
]

with engine.connect() as conn:
    for sql in migrations:
        try:
            print(f"Executing: {sql}")
            conn.execute(text(sql))
            conn.commit()
            print("Success")
        except Exception as e:
            print(f"Error or already exists: {e}")
