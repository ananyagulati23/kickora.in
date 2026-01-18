from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    full_name: Optional[str] = None
    age: Optional[int] = None
    date_of_birth: Optional[str] = None
    profile_photo_url: Optional[str] = None

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    full_name: Optional[str] = None
    age: Optional[int] = None
    date_of_birth: Optional[str] = None
    profile_photo_url: Optional[str] = None

class UserResponse(UserBase):
    id: str
    is_admin: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Authentication Schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None

# Testimonial Schemas
class TestimonialBase(BaseModel):
    text: str
    rating: int
    name: Optional[str] = None

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    text: Optional[str] = None
    rating: Optional[int] = None
    name: Optional[str] = None

class TestimonialResponse(TestimonialBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Gallery Schemas
class GalleryBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: str
    category: str

class GalleryCreate(GalleryBase):
    pass

class GalleryUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None

class GalleryResponse(GalleryBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Match Schemas
class MatchBase(BaseModel):
    date: str
    time: str
    location: str
    price: float
    max_players: int = 22
    players_left: int = 22

class MatchCreate(MatchBase):
    pass

class MatchUpdate(BaseModel):
    date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    price: Optional[float] = None
    max_players: Optional[int] = None
    players_left: Optional[int] = None
    is_active: Optional[bool] = None

class MatchResponse(MatchBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Booking Schemas
class BookingBase(BaseModel):
    match_id: str

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: str
    user_id: str
    booking_time: datetime
    is_cancelled: bool
    cancelled_at: Optional[datetime] = None
    refund_amount: Optional[float] = None

    class Config:
        from_attributes = True

# Payment Schemas
class PaymentBase(BaseModel):
    booking_id: str
    amount: float
    payment_method: str

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    transaction_id: Optional[str] = None
    status: Optional[str] = None

class PaymentResponse(PaymentBase):
    id: str
    transaction_id: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Admin Schemas
class AdminModeRequest(BaseModel):
    password: str

class AdminModeResponse(BaseModel):
    access_granted: bool
    message: str

# Google OAuth Schemas
class GoogleAuthRequest(BaseModel):
    code: str

class GoogleUserInfo(BaseModel):
    email: str
    name: str
    picture: Optional[str] = None 