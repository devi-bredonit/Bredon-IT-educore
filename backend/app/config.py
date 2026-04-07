import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# ─── Database ────────────────────────────────────────────────
DB_HOST     = os.getenv("DB_HOST", "localhost")
DB_PORT     = int(os.getenv("DB_PORT", 3306))
DB_NAME     = os.getenv("DB_NAME", "educore_db")
DB_USER     = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

# SQLAlchemy connection URL
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# ─── Auth ─────────────────────────────────────────────────────
SECRET_KEY                  = os.getenv("SECRET_KEY", "change-this-in-production")
ALGORITHM                   = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# ─── App ──────────────────────────────────────────────────────
APP_ENV = os.getenv("APP_ENV", "development")
DEBUG   = os.getenv("DEBUG", "True").lower() == "true"
