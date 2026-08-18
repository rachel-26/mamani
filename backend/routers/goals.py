from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db, Goal, User
from models.schemas import GoalCreate, GoalOut, GoalUpdate, DepositPayload
from dependencies import get_current_user

router = APIRouter(prefix="/goals", tags=["goals"])


def _to_out(goal: Goal) -> GoalOut:
    saved = goal.saved_amount if goal.saved_amount is not None else 0.0
    target = goal.target_amount if goal.target_amount is not None else 0.0
    pct = (saved / target * 100) if target > 0 else 0.0
    data = GoalOut.model_validate(goal)
    data.saved_amount = saved
    data.progress_percentage = round(pct, 1)
    return data


@router.get("", response_model=List[GoalOut])
def list_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goals = db.query(Goal).filter(Goal.owner_id == current_user.id).all()
    return [_to_out(g) for g in goals]


@router.post("", response_model=GoalOut, status_code=status.HTTP_201_CREATED)
def create_goal(
    payload: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal_dict = payload.model_dump()
    if goal_dict.get("saved_amount") is None:
        goal_dict["saved_amount"] = 0.0
    goal = Goal(**goal_dict, owner_id=current_user.id)
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return _to_out(goal)


@router.put("/{goal_id}", response_model=GoalOut)
def update_goal(
    goal_id: int,
    payload: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id, Goal.owner_id == current_user.id
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    db.commit()
    db.refresh(goal)
    return _to_out(goal)


@router.patch("/{goal_id}/deposit", response_model=GoalOut)
def deposit_to_goal(
    goal_id: int,
    payload: DepositPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add funds to an existing goal's saved_amount."""
    goal = db.query(Goal).filter(
        Goal.id == goal_id, Goal.owner_id == current_user.id
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    current_saved = goal.saved_amount if goal.saved_amount is not None else 0.0
    goal.saved_amount = round(current_saved + payload.amount, 2)
    db.commit()
    db.refresh(goal)
    return _to_out(goal)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id, Goal.owner_id == current_user.id
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
