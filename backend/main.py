from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import auth, users, transactions, goals

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mamani Finance API",
    description="Custom backend for Mamani – Prosperity & Security",
    version="1.0.0",
)

# Allow the React dev server (port 5173) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
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
