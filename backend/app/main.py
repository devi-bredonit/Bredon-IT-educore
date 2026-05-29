from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import traceback
import uvicorn

from app.api import routes_users, routes_schools, routes_students, routes_fees, routes_fee_configs, routes_activities, routes_staff, routes_class_fees
from app import models
from app.database import engine

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduCore+ API")

# ── CORS middleware ────────────────────────────────────────────────────────────
# Must be registered FIRST so every response (including error responses) gets
# the Access-Control-Allow-Origin header injected by Starlette.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ── Global unhandled-exception handler ─────────────────────────────────────────
# When the backend crashes with an unhandled Python exception, Starlette/FastAPI
# would normally return a plain 500 response that skips CORS headers.
# By catching it here and returning a JSONResponse, the CORS middleware above can
# still inject the Allow-Origin header — so the browser sees a proper 500 JSON
# error instead of a misleading "CORS blocked" error.
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    print(f"\n[UNHANDLED ERROR] {request.method} {request.url}\n{tb}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"},
    )

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(routes_users.router)
app.include_router(routes_schools.router)
app.include_router(routes_students.router)
app.include_router(routes_fees.router)
app.include_router(routes_fee_configs.router)
app.include_router(routes_activities.router)
app.include_router(routes_staff.router)
app.include_router(routes_class_fees.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to EduCore+ API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
