from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api import routes_users, routes_schools, routes_students, routes_fees

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

@app.get("/")
def read_root():
    return {"message": "Welcome to EduCore+ API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
