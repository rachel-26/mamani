from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db, Transaction, User
from models.schemas import TransactionCreate, TransactionOut
from dependencies import get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/", response_model=List[TransactionOut])
def list_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Transaction)
        .filter(Transaction.owner_id == current_user.id)
        .order_by(Transaction.date.desc())
        .all()
    )


@router.post("/", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
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
