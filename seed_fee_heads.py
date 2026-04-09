import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="backend/.env")
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in backend/.env")
    exit(1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

DEFAULT_FEE_HEADS = [
    {"name": "Tuition Fee", "description": "Core academic fee"},
    {"name": "Transport Fee", "description": "School bus / transportation"},
    {"name": "Exam Fee", "description": "Examination and assessment charges"},
    {"name": "Miscellaneous", "description": "Other incidental charges"}
]

def seed():
    session = SessionLocal()
    try:
        # Get all schools
        schools = session.execute(text("SELECT id FROM schools")).fetchall()
        
        for school in schools:
            school_id = school[0]
            print(f"Seeding fee heads for School ID: {school_id}...")
            
            for head in DEFAULT_FEE_HEADS:
                # Check if exists
                exists = session.execute(
                    text("SELECT id FROM fee_heads WHERE school_id = :s AND name = :n"),
                    {"s": school_id, "n": head["name"]}
                ).fetchone()
                
                if not exists:
                    session.execute(
                        text("INSERT INTO fee_heads (school_id, name, description, is_active) VALUES (:s, :n, :d, 1)"),
                        {"s": school_id, "n": head["name"], "d": head["description"]}
                    )
                    print(f"  Added: {head['name']}")
                else:
                    print(f"  Already exists: {head['name']}")
        
        session.commit()
        print("Seeding completed successfully!")
    except Exception as e:
        session.rollback()
        print(f"Error during seeding: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    seed()
