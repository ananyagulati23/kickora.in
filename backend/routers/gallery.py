from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from database import get_db
from models import Gallery
from schemas import GalleryCreate, GalleryResponse, GalleryUpdate
from auth import get_current_active_user

router = APIRouter(prefix="/gallery", tags=["gallery"])

@router.post("/", response_model=GalleryResponse)
async def create_gallery_item(
    gallery_data: GalleryCreate,
    db: AsyncSession = Depends(get_db)
):
    gallery_item = Gallery(
        title=gallery_data.title,
        description=gallery_data.description,
        image_url=gallery_data.image_url,
        category=gallery_data.category
    )
    
    db.add(gallery_item)
    await db.commit()
    await db.refresh(gallery_item)
    
    return GalleryResponse.from_orm(gallery_item)

@router.get("/", response_model=List[GalleryResponse])
async def get_gallery_items(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Gallery).where(Gallery.is_active == True)
    
    if category:
        query = query.where(Gallery.category == category)
    
    result = await db.execute(
        query
        .offset(skip)
        .limit(limit)
        .order_by(Gallery.created_at.desc())
    )
    gallery_items = result.scalars().all()
    return [GalleryResponse.from_orm(item) for item in gallery_items]

@router.get("/{gallery_id}", response_model=GalleryResponse)
async def get_gallery_item(
    gallery_id: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Gallery).where(Gallery.id == gallery_id)
    )
    gallery_item = result.scalar_one_or_none()
    
    if not gallery_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery item not found"
        )
    
    return GalleryResponse.from_orm(gallery_item)

@router.put("/{gallery_id}", response_model=GalleryResponse)
async def update_gallery_item(
    gallery_id: str,
    gallery_data: GalleryUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Gallery).where(Gallery.id == gallery_id)
    )
    gallery_item = result.scalar_one_or_none()
    
    if not gallery_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery item not found"
        )
    
    # Update fields
    if gallery_data.title is not None:
        gallery_item.title = gallery_data.title
    if gallery_data.description is not None:
        gallery_item.description = gallery_data.description
    if gallery_data.image_url is not None:
        gallery_item.image_url = gallery_data.image_url
    if gallery_data.category is not None:
        gallery_item.category = gallery_data.category
    if gallery_data.is_active is not None:
        gallery_item.is_active = gallery_data.is_active
    
    await db.commit()
    await db.refresh(gallery_item)
    
    return GalleryResponse.from_orm(gallery_item)

@router.delete("/{gallery_id}")
async def delete_gallery_item(
    gallery_id: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Gallery).where(Gallery.id == gallery_id)
    )
    gallery_item = result.scalar_one_or_none()
    
    if not gallery_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery item not found"
        )
    
    await db.execute(delete(Gallery).where(Gallery.id == gallery_id))
    await db.commit()
    
    return {"message": "Gallery item deleted successfully"}

@router.get("/categories/list")
async def get_gallery_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Gallery.category)
        .where(Gallery.is_active == True)
        .distinct()
    )
    categories = result.scalars().all()
    return {"categories": list(categories)} 