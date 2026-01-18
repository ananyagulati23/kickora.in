from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
from typing import List
from database import get_db
from models import User, Testimonial, Match, Gallery, Booking, Payment
from schemas import UserResponse, TestimonialResponse, MatchResponse, GalleryResponse
from config import settings

router = APIRouter(prefix="/admin", tags=["admin"])

# Admin mode password verification
async def verify_admin_mode_password(password: str):
    if password != settings.admin_mode_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin mode password"
        )
    return True

# User Management
@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    password: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(
        select(User)
        .offset(skip)
        .limit(limit)
        .order_by(User.created_at.desc())
    )
    users = result.scalars().all()
    return [UserResponse.from_orm(user) for user in users]

@router.put("/users/{user_id}/admin")
async def toggle_user_admin_status(
    user_id: str,
    password: str,
    is_admin: bool,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_admin = is_admin
    await db.commit()
    
    return {"message": f"User admin status updated to {is_admin}"}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    password: str,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    await db.execute(delete(User).where(User.id == user_id))
    await db.commit()
    
    return {"message": "User deleted successfully"}

# Testimonial Management
@router.get("/testimonials", response_model=List[TestimonialResponse])
async def get_all_testimonials(
    password: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(
        select(Testimonial)
        .offset(skip)
        .limit(limit)
        .order_by(Testimonial.created_at.desc())
    )
    testimonials = result.scalars().all()
    return [TestimonialResponse.from_orm(t) for t in testimonials]

@router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial_admin(
    testimonial_id: str,
    password: str,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(
        select(Testimonial).where(Testimonial.id == testimonial_id)
    )
    testimonial = result.scalar_one_or_none()
    
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    await db.execute(delete(Testimonial).where(Testimonial.id == testimonial_id))
    await db.commit()
    
    return {"message": "Testimonial deleted successfully"}

# Match Management
@router.get("/matches", response_model=List[MatchResponse])
async def get_all_matches(
    password: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(
        select(Match)
        .offset(skip)
        .limit(limit)
        .order_by(Match.created_at.desc())
    )
    matches = result.scalars().all()
    return [MatchResponse.from_orm(match) for match in matches]

@router.delete("/matches/{match_id}")
async def delete_match_admin(
    match_id: str,
    password: str,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(select(Match).where(Match.id == match_id))
    match = result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    await db.execute(delete(Match).where(Match.id == match_id))
    await db.commit()
    
    return {"message": "Match deleted successfully"}

# Gallery Management
@router.get("/gallery", response_model=List[GalleryResponse])
async def get_all_gallery_items(
    password: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(
        select(Gallery)
        .offset(skip)
        .limit(limit)
        .order_by(Gallery.created_at.desc())
    )
    gallery_items = result.scalars().all()
    return [GalleryResponse.from_orm(item) for item in gallery_items]

@router.delete("/gallery/{gallery_id}")
async def delete_gallery_item_admin(
    gallery_id: str,
    password: str,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(select(Gallery).where(Gallery.id == gallery_id))
    gallery_item = result.scalar_one_or_none()
    
    if not gallery_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery item not found"
        )
    
    await db.execute(delete(Gallery).where(Gallery.id == gallery_id))
    await db.commit()
    
    return {"message": "Gallery item deleted successfully"}

# Booking Management
@router.get("/bookings")
async def get_all_bookings(
    password: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(
        select(Booking)
        .offset(skip)
        .limit(limit)
        .order_by(Booking.booking_time.desc())
    )
    bookings = result.scalars().all()
    
    # Convert to dict for easier handling
    booking_list = []
    for booking in bookings:
        booking_dict = {
            "id": booking.id,
            "user_id": booking.user_id,
            "match_id": booking.match_id,
            "booking_time": booking.booking_time,
            "is_cancelled": booking.is_cancelled,
            "cancelled_at": booking.cancelled_at,
            "refund_amount": booking.refund_amount
        }
        booking_list.append(booking_dict)
    
    return booking_list

@router.delete("/bookings/{booking_id}")
async def delete_booking_admin(
    booking_id: str,
    password: str,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    await db.execute(delete(Booking).where(Booking.id == booking_id))
    await db.commit()
    
    return {"message": "Booking deleted successfully"}

# Payment Management
@router.get("/payments")
async def get_all_payments(
    password: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(
        select(Payment)
        .offset(skip)
        .limit(limit)
        .order_by(Payment.created_at.desc())
    )
    payments = result.scalars().all()
    
    # Convert to dict for easier handling
    payment_list = []
    for payment in payments:
        payment_dict = {
            "id": payment.id,
            "booking_id": payment.booking_id,
            "amount": payment.amount,
            "payment_method": payment.payment_method,
            "transaction_id": payment.transaction_id,
            "status": payment.status,
            "created_at": payment.created_at,
            "updated_at": payment.updated_at
        }
        payment_list.append(payment_dict)
    
    return payment_list

@router.delete("/payments/{payment_id}")
async def delete_payment_admin(
    payment_id: str,
    password: str,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    result = await db.execute(select(Payment).where(Payment.id == payment_id))
    payment = result.scalar_one_or_none()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    await db.execute(delete(Payment).where(Payment.id == payment_id))
    await db.commit()
    
    return {"message": "Payment deleted successfully"}

# Database Statistics
@router.get("/stats")
async def get_database_stats(
    password: str,
    db: AsyncSession = Depends(get_db)
):
    await verify_admin_mode_password(password)
    
    # Count all entities
    users_count = await db.execute(select(User))
    users_count = len(users_count.scalars().all())
    
    testimonials_count = await db.execute(select(Testimonial))
    testimonials_count = len(testimonials_count.scalars().all())
    
    matches_count = await db.execute(select(Match))
    matches_count = len(matches_count.scalars().all())
    
    gallery_count = await db.execute(select(Gallery))
    gallery_count = len(gallery_count.scalars().all())
    
    bookings_count = await db.execute(select(Booking))
    bookings_count = len(bookings_count.scalars().all())
    
    payments_count = await db.execute(select(Payment))
    payments_count = len(payments_count.scalars().all())
    
    return {
        "total_users": users_count,
        "total_testimonials": testimonials_count,
        "total_matches": matches_count,
        "total_gallery_items": gallery_count,
        "total_bookings": bookings_count,
        "total_payments": payments_count
    } 