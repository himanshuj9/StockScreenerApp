from fastapi import FastAPI
from sqlalchemy import text

from .database import engine
from .routers.company import router as company_router

app = FastAPI(
    title="Stock Screener API",
    version="1.0.0"
)

app.include_router(company_router)

@app.get("/")
def root():
    return {
        "message": "Stock Screener API is running"
    }


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }