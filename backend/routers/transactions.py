from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db, Transaction, User
from models.schemas import TransactionCreate, TransactionOut, TransactionSummary, RecentTransaction
from dependencies import get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/summary", response_model=TransactionSummary)
def get_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Returns aggregated financial stats + last 5 transactions for the dashboard."""
    all_tx = (
        db.query(Transaction)
        .filter(Transaction.owner_id == current_user.id)
        .order_by(Transaction.date.desc())
        .all()
    )

    total_income = sum(t.amount for t in all_tx if not t.is_expense)
    total_expenses = sum(t.amount for t in all_tx if t.is_expense)
    net_worth = total_income - total_expenses
    savings_rate = round((net_worth / total_income * 100), 1) if total_income > 0 else 0.0

    recent = all_tx[:5]

    return TransactionSummary(
        net_worth=net_worth,
        total_income=total_income,
        total_expenses=total_expenses,
        savings_rate=savings_rate,
        recent_transactions=[
            RecentTransaction(
                id=t.id,
                title=t.title,
                category=t.category,
                amount=t.amount,
                is_expense=t.is_expense,
                account=t.account or "Main Savings",
                date=t.date,
                notes=t.notes,
            )
            for t in recent
        ],
    )


@router.get("", response_model=List[TransactionOut])
def list_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    category: Optional[str] = None,
    is_expense: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Transaction)
        .filter(Transaction.owner_id == current_user.id)
    )
    if category:
        query = query.filter(Transaction.category == category)
    if is_expense is not None:
        query = query.filter(Transaction.is_expense == is_expense)

    return query.order_by(Transaction.date.desc()).offset(skip).limit(limit).all()


@router.post("", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
def create_transaction(
    payload: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = Transaction(
        **payload.model_dump(exclude={"date"}),
        date=payload.date or datetime.utcnow(),
        owner_id=current_user.id,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


@router.delete("/{tx_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    tx_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = db.query(Transaction).filter(
        Transaction.id == tx_id, Transaction.owner_id == current_user.id
    ).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(tx)
    db.commit()
