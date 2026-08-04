from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db, Goal, User
from models.schemas import GoalCreate, GoalOut, GoalUpdate
from dependencies import get_current_user

router = APIRouter(prefix="/goals", tags=["goals"])


def _to_out(goal: Goal) -> GoalOut:
    pct = (goal.saved_amount / goal.target_amount * 100) if goal.target_amount else 0
    data = GoalOut.model_validate(goal)
    data.progress_percentage = round(pct, 1)
    return data


@router.get("/", response_model=List[GoalOut])
def list_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goals = db.query(Goal).filter(Goal.owner_id == current_user.id).all()
    return [_to_out(g) for g in goals]


@router.post("/", response_model=GoalOut, status_code=status.HTTP_201_CREATED)
def create_goal(
    payload: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = Goal(**payload.model_dump(), owner_id=current_user.id)
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
