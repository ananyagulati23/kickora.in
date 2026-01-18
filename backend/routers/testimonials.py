from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from database import get_db
from models import User, Testimonial
from schemas import TestimonialCreate, TestimonialResponse, TestimonialUpdate
from auth import get_current_active_user

router = APIRouter(prefix="/testimonials", tags=["testimonials"])

@router.post("/", response_model=TestimonialResponse)
async def create_testimonial(
    testimonial_data: TestimonialCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    testimonial = Testimonial(
        user_id=current_user.id,
        text=testimonial_data.text,
        rating=testimonial_data.rating,
        name=testimonial_data.name or current_user.full_name
    )
    
    db.add(testimonial)
    await db.commit()
    await db.refresh(testimonial)
    
    return TestimonialResponse.from_orm(testimonial)

@router.get("/", response_model=List[TestimonialResponse])
async def get_testimonials(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Testimonial)
        .where(Testimonial.is_active == True)
        .offset(skip)
        .limit(limit)
        .order_by(Testimonial.created_at.desc())
    )
    testimonials = result.scalars().all()
    return [TestimonialResponse.from_orm(t) for t in testimonials]

@router.get("/{testimonial_id}", response_model=TestimonialResponse)
async def get_testimonial(
    testimonial_id: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Testimonial).where(Testimonial.id == testimonial_id)
    )
    testimonial = result.scalar_one_or_none()
    
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    return TestimonialResponse.from_orm(testimonial)

@router.put("/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: str,
    testimonial_data: TestimonialUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Testimonial).where(Testimonial.id == testimonial_id)
    )
    testimonial = result.scalar_one_or_none()
    
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    # Only allow users to update their own testimonials or admins
    if testimonial.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this testimonial"
        )
    
    # Update fields
    if testimonial_data.text is not None:
        testimonial.text = testimonial_data.text
    if testimonial_data.rating is not None:
        testimonial.rating = testimonial_data.rating
    if testimonial_data.name is not None:
        testimonial.name = testimonial_data.name
    
    await db.commit()
    await db.refresh(testimonial)
    
    return TestimonialResponse.from_orm(testimonial)

@router.delete("/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Testimonial).where(Testimonial.id == testimonial_id)
    )
    testimonial = result.scalar_one_or_none()
    
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found"
        )
    
    # Only allow users to delete their own testimonials or admins
    if testimonial.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this testimonial"
        )
    
    await db.execute(delete(Testimonial).where(Testimonial.id == testimonial_id))
    await db.commit()
    
    return {"message": "Testimonial deleted successfully"}

@router.get("/user/{user_id}", response_model=List[TestimonialResponse])
async def get_user_testimonials(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Testimonial).where(Testimonial.user_id == user_id)
    )
    testimonials = result.scalars().all()
    return [TestimonialResponse.from_orm(t) for t in testimonials] 