import os
from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE extracurricular_activities ADD COLUMN cost FLOAT DEFAULT 0.0;"))
        conn.commit()
        print("Successfully added cost column.")
    except Exception as e:
        print("Error:", e)
