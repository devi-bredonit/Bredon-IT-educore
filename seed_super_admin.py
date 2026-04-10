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

def seed_super_admin():
    session = SessionLocal()
    try:
        username = "Educore"
        password = "Educore@2026"
        role = "Super Admin"
        profile_name = "EduCore Super Admin"
        
        print(f"Checking for user '{username}'...")
        result = session.execute(text("SELECT id FROM users WHERE username = :u"), {"u": username}).fetchone()
        
        if not result:
            print(f"Creating Super Admin user '{username}'...")
            session.execute(text("""
                INSERT INTO users (username, password, role, profile_name, is_active)
                VALUES (:u, :p, :r, :n, 1)
            """), {"u": username, "p": password, "r": role, "n": profile_name})
            print("Super Admin user created successfully.")
        else:
            print(f"User '{username}' already exists. Updating password...")
            session.execute(text("""
                UPDATE users SET password = :p, role = :r WHERE username = :u
            """), {"u": username, "p": password, "r": role})
            print("Password updated successfully.")

        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    seed_super_admin()
