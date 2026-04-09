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

def seed():
    session = SessionLocal()
    try:
        # 1. Check if default school exists
        print("Checking for default school (ID: 1)...")
        result = session.execute(text("SELECT id FROM schools WHERE id = 1")).fetchone()
        
        if not result:
            print("Creating default school...")
            session.execute(text("""
                INSERT INTO schools (id, name, branch, code, city, is_active)
                VALUES (1, 'EduCore+ High School', 'Main Branch', 'ED001', 'Mumbai', 1)
            """))
            print("Default school created.")
        else:
            print("Default school already exists.")

        # 2. Check if default user exists
        print("Checking for default user 'admin'...")
        result = session.execute(text("SELECT id FROM users WHERE username = 'admin'")).fetchone()
        
        if not result:
            print("Creating default user...")
            # Using MD5 for now if passwords aren't hashed differently, or just plain text if that's what's expected
            # Given previous context, it might be plain text or a specific hash. 
            # I'll check routes_users.py to see how passwords are handled.
            session.execute(text("""
                INSERT INTO users (username, password, role, profile_name, school_id, is_active)
                VALUES ('admin', 'admin123', 'Super Admin', 'Main Administrator', 1, 1)
            """))
            print("Default user created.")
        else:
            print("Default user already exists.")

        session.commit()
        print("Seeding completed successfully!")
    except Exception as e:
        session.rollback()
        print(f"Error during seeding: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    seed()
