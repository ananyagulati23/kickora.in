from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=True, index=True)
    phone_number = Column(String(20), nullable=True)
    full_name = Column(String(100), nullable=True)
    age = Column(Integer, nullable=True)
    date_of_birth = Column(String(20), nullable=True)
    profile_photo_url = Column(String(500), nullable=True)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    testimonials = relationship("Testimonial", back_populates="user", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")

class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    name = Column(String(100), nullable=True)  # Optional display name
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="testimonials")

class Gallery(Base):
    __tablename__ = "gallery"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=False)
    category = Column(String(50), nullable=False)  # match, turf, equipment
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Match(Base):
    __tablename__ = "matches"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    date = Column(String(20), nullable=False)  # Format: "2024-01-15"
    time = Column(String(10), nullable=False)  # Format: "18:00"
    location = Column(String(200), nullable=False)
    price = Column(Float, nullable=False, default=299.0)
    max_players = Column(Integer, default=22)
    players_left = Column(Integer, default=22)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    bookings = relationship("Booking", back_populates="match", cascade="all, delete-orphan")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    match_id = Column(String, ForeignKey("matches.id"), nullable=False)
    booking_time = Column(DateTime(timezone=True), server_default=func.now())
    is_cancelled = Column(Boolean, default=False)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    refund_amount = Column(Float, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="bookings")
    match = relationship("Match", back_populates="bookings")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), nullable=False)  # card, upi, netbanking
    transaction_id = Column(String(100), nullable=True)
    status = Column(String(20), default="pending")  # pending, completed, failed, refunded
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 