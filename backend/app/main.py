from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api import routes_users, routes_schools, routes_students, routes_fees
from app.database import engine, Base
import app.models

try:
    Base.metadata.create_all(bind=engine)
    print("Database connection and table creation successful.")
except Exception as e:
    print(f"CRITICAL ERROR: Could not connect to the database. Error: {e}")

app = FastAPI(title="EduCore+ API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(routes_users.router)
app.include_router(routes_schools.router)
app.include_router(routes_students.router)
app.include_router(routes_fees.router)

from fastapi.responses import JSONResponse
from pydantic import ValidationError

@app.exception_handler(Exception)
async def debug_exception_handler(request, exc):
    import traceback
    print(f"DEBUG: Global Exception caught: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)},
    )

@app.get("/")
def read_root():
    return {"message": "Welcome to EduCore+ API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
