from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from sqlalchemy import text
from database import Base, engine
from routers import auth, users, transactions, goals

# Create all tables on startup
Base.metadata.create_all(bind=engine)

# Safe SQLite migrations for newly added columns
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE transactions ADD COLUMN is_fixed BOOLEAN DEFAULT 0"))
        conn.commit()
    except Exception:
        pass
    try:
        conn.execute(text("ALTER TABLE transactions ADD COLUMN frequency VARCHAR DEFAULT NULL"))
        conn.commit()
    except Exception:
        pass

app = FastAPI(
    title="Mamani Finance API",
    description="Custom backend for Mamani – Prosperity & Security",
    version="1.0.0",
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Allow local development servers (Vite/React on ports 5173, 5174, etc.) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(goals.router)


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "message": "Mamani API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
