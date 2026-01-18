from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import User, Payment, Booking
from schemas import PaymentCreate, PaymentResponse, PaymentUpdate
from auth import get_current_active_user

router = APIRouter(prefix="/payment", tags=["payment"])

@router.post("/", response_model=PaymentResponse)
async def create_payment(
    payment_data: PaymentCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify booking exists and belongs to user
    result = await db.execute(
        select(Booking).where(
            Booking.id == payment_data.booking_id,
            Booking.user_id == current_user.id
        )
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check if payment already exists
    existing_payment = await db.execute(
        select(Payment).where(Payment.booking_id == payment_data.booking_id)
    )
    if existing_payment.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment already exists for this booking"
        )
    
    # Create payment record
    payment = Payment(
        booking_id=payment_data.booking_id,
        amount=payment_data.amount,
        payment_method=payment_data.payment_method
    )
    
    db.add(payment)
    await db.commit()
    await db.refresh(payment)
    
    return PaymentResponse.from_orm(payment)

@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Payment).where(Payment.id == payment_id)
    )
    payment = result.scalar_one_or_none()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Verify user owns this payment
    booking_result = await db.execute(
        select(Booking).where(Booking.id == payment.booking_id)
    )
    booking = booking_result.scalar_one_or_none()
    
    if not booking or booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this payment"
        )
    
    return PaymentResponse.from_orm(payment)

@router.put("/{payment_id}", response_model=PaymentResponse)
async def update_payment(
    payment_id: str,
    payment_data: PaymentUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Payment).where(Payment.id == payment_id)
    )
    payment = result.scalar_one_or_none()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Verify user owns this payment
    booking_result = await db.execute(
        select(Booking).where(Booking.id == payment.booking_id)
    )
    booking = booking_result.scalar_one_or_none()
    
    if not booking or booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this payment"
        )
    
    # Update fields
    if payment_data.transaction_id is not None:
        payment.transaction_id = payment_data.transaction_id
    if payment_data.status is not None:
        payment.status = payment_data.status
    
    await db.commit()
    await db.refresh(payment)
    
    return PaymentResponse.from_orm(payment)

@router.get("/user/payments")
async def get_user_payments(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Get all bookings for user
    bookings_result = await db.execute(
        select(Booking).where(Booking.user_id == current_user.id)
    )
    bookings = bookings_result.scalars().all()
    booking_ids = [booking.id for booking in bookings]
    
    # Get payments for these bookings
    payments_result = await db.execute(
        select(Payment).where(Payment.booking_id.in_(booking_ids))
    )
    payments = payments_result.scalars().all()
    
    return [PaymentResponse.from_orm(payment) for payment in payments]

@router.post("/{payment_id}/process")
async def process_payment(
    payment_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Process payment through payment gateway
    This is a placeholder for actual payment gateway integration
    """
    result = await db.execute(
        select(Payment).where(Payment.id == payment_id)
    )
    payment = result.scalar_one_or_none()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Verify user owns this payment
    booking_result = await db.execute(
        select(Booking).where(Booking.id == payment.booking_id)
    )
    booking = booking_result.scalar_one_or_none()
    
    if not booking or booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to process this payment"
        )
    
    # Simulate payment processing
    import uuid
    payment.transaction_id = f"TXN_{uuid.uuid4().hex[:8].upper()}"
    payment.status = "completed"
    
    await db.commit()
    await db.refresh(payment)
    
    return {
        "message": "Payment processed successfully",
        "transaction_id": payment.transaction_id,
        "status": payment.status
    } 