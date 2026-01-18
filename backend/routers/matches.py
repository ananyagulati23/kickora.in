from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from datetime import datetime, timedelta
from database import get_db
from models import User, Match, Booking
from schemas import MatchCreate, MatchResponse, MatchUpdate, BookingCreate, BookingResponse
from auth import get_current_active_user

router = APIRouter(prefix="/matches", tags=["matches"])

@router.post("/", response_model=MatchResponse)
async def create_match(
    match_data: MatchCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Only admins can create matches
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create matches"
        )
    
    match = Match(
        date=match_data.date,
        time=match_data.time,
        location=match_data.location,
        price=match_data.price,
        max_players=match_data.max_players,
        players_left=match_data.players_left
    )
    
    db.add(match)
    await db.commit()
    await db.refresh(match)
    
    return MatchResponse.from_orm(match)

@router.get("/", response_model=List[MatchResponse])
async def get_matches(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    query = select(Match)
    
    if active_only:
        query = query.where(Match.is_active == True)
    
    result = await db.execute(
        query
        .offset(skip)
        .limit(limit)
        .order_by(Match.date.asc(), Match.time.asc())
    )
    matches = result.scalars().all()
    return [MatchResponse.from_orm(match) for match in matches]

@router.get("/{match_id}", response_model=MatchResponse)
async def get_match(
    match_id: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Match).where(Match.id == match_id)
    )
    match = result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    return MatchResponse.from_orm(match)

@router.put("/{match_id}", response_model=MatchResponse)
async def update_match(
    match_id: str,
    match_data: MatchUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Only admins can update matches
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update matches"
        )
    
    result = await db.execute(
        select(Match).where(Match.id == match_id)
    )
    match = result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    # Update fields
    if match_data.date is not None:
        match.date = match_data.date
    if match_data.time is not None:
        match.time = match_data.time
    if match_data.location is not None:
        match.location = match_data.location
    if match_data.price is not None:
        match.price = match_data.price
    if match_data.max_players is not None:
        match.max_players = match_data.max_players
    if match_data.players_left is not None:
        match.players_left = match_data.players_left
    if match_data.is_active is not None:
        match.is_active = match_data.is_active
    
    await db.commit()
    await db.refresh(match)
    
    return MatchResponse.from_orm(match)

@router.delete("/{match_id}")
async def delete_match(
    match_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Only admins can delete matches
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete matches"
        )
    
    result = await db.execute(
        select(Match).where(Match.id == match_id)
    )
    match = result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    await db.execute(delete(Match).where(Match.id == match_id))
    await db.commit()
    
    return {"message": "Match deleted successfully"}

# Booking endpoints
@router.post("/{match_id}/book", response_model=BookingResponse)
async def book_match(
    match_id: str,
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Get match
    result = await db.execute(
        select(Match).where(Match.id == match_id)
    )
    match = result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    if not match.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Match is not active"
        )
    
    if match.players_left <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Match is full"
        )
    
    # Check if user already booked this match
    existing_booking = await db.execute(
        select(Booking).where(
            Booking.user_id == current_user.id,
            Booking.match_id == match_id,
            Booking.is_cancelled == False
        )
    )
    if existing_booking.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already booked this match"
        )
    
    # Create booking
    booking = Booking(
        user_id=current_user.id,
        match_id=match_id
    )
    
    # Decrement players left
    match.players_left -= 1
    
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    
    return BookingResponse.from_orm(booking)

@router.post("/{match_id}/cancel")
async def cancel_booking(
    match_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Get booking
    result = await db.execute(
        select(Booking).where(
            Booking.user_id == current_user.id,
            Booking.match_id == match_id,
            Booking.is_cancelled == False
        )
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check if within 24 hours for full refund
    booking_time = booking.booking_time
    current_time = datetime.utcnow()
    time_diff = current_time - booking_time
    
    if time_diff <= timedelta(hours=24):
        booking.refund_amount = match.price  # Full refund
    else:
        booking.refund_amount = 0  # No refund after 24 hours
    
    booking.is_cancelled = True
    booking.cancelled_at = current_time
    
    # Increment players left
    match = await db.execute(select(Match).where(Match.id == match_id))
    match = match.scalar_one_or_none()
    if match:
        match.players_left += 1
    
    await db.commit()
    
    return {
        "message": "Booking cancelled successfully",
        "refund_amount": booking.refund_amount
    }

@router.get("/user/bookings", response_model=List[BookingResponse])
async def get_user_bookings(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Booking).where(Booking.user_id == current_user.id)
        .order_by(Booking.booking_time.desc())
    )
    bookings = result.scalars().all()
    return [BookingResponse.from_orm(booking) for booking in bookings] 