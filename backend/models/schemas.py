from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


# ── Auth ─────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── User ─────────────────────────────────────────────────────────────────────

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    currency: Optional[str] = None
    avatar_url: Optional[str] = None


class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    currency: str = "USD ($)"
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Transaction ───────────────────────────────────────────────────────────────

class TransactionCreate(BaseModel):
    title: str
    category: str
    amount: float
    is_expense: bool = True
    notes: Optional[str] = None
    account: Optional[str] = "Main Savings"
    date: Optional[datetime] = None
    receipt_url: Optional[str] = None


class TransactionOut(TransactionCreate):
    id: int
    owner_id: int
    date: datetime

    class Config:
        from_attributes = True


# ── Dashboard Summary ─────────────────────────────────────────────────────────

class RecentTransaction(BaseModel):
    id: int
    title: str
    category: str
    amount: float
    is_expense: bool
    account: Optional[str] = "Main Savings"
    date: datetime
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class TransactionSummary(BaseModel):
    net_worth: float
    total_income: float
    total_expenses: float
    savings_rate: float
    recent_transactions: List[RecentTransaction]


# ── Goal ──────────────────────────────────────────────────────────────────────

class GoalCreate(BaseModel):
    title: str
    target_amount: float
    saved_amount: float = 0.0
    target_date: Optional[datetime] = None
    is_short_term: bool = True
    color_index: int = 0
    image_url: Optional[str] = None


class GoalUpdate(BaseModel):
    saved_amount: Optional[float] = None
    title: Optional[str] = None
    target_amount: Optional[float] = None
    target_date: Optional[datetime] = None


class DepositPayload(BaseModel):
    amount: float


class GoalOut(GoalCreate):
    id: int
    owner_id: int
    progress_percentage: float = 0.0

    class Config:
        from_attributes = True
