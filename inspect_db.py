import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

inspector = inspect(engine)
for table_name in inspector.get_table_names():
    print(f"Table: {table_name}")
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    print(f"Columns: {columns}")
