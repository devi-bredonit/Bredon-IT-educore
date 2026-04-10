from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api import routes_users, routes_schools, routes_students, routes_fees, routes_fee_configs, routes_activities, routes_staff, routes_class_fees
from app import models
from app.database import engine

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduCore+ API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(routes_users.router)
app.include_router(routes_schools.router)
app.include_router(routes_students.router)
app.include_router(routes_fees.router)
app.include_router(routes_fee_configs.router)
app.include_router(routes_activities.router)
app.include_router(routes_staff.router)
app.include_router(routes_class_fees.router)

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
