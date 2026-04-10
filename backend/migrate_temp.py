from sqlalchemy import create_engine
from sqlalchemy.sql import text

DATABASE_URL = "mysql+pymysql://admin:Kushi2025@kushi-db-dev.clo860uqivuz.ap-south-1.rds.amazonaws.com/educore"
engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE fee_heads CHANGE academic_session class_name VARCHAR(50) NULL;"))
        conn.commit()
        print("Successfully renamed 'academic_session' to 'class_name' in fee_heads.")
except Exception as e:
    print(f"Error: {e}")
