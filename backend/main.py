from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routers import auth, testimonials, gallery, matches, payment, admin
from config import settings

# Create database tables
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Create FastAPI app
app = FastAPI(
    title="Kickora Football Booking API",
    description="Backend API for Kickora football booking platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(testimonials.router, prefix="/api/v1")
app.include_router(gallery.router, prefix="/api/v1")
app.include_router(matches.router, prefix="/api/v1")
app.include_router(payment.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    await create_tables()

@app.get("/")
async def root():
    return {
        "message": "Welcome to Kickora Football Booking API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 