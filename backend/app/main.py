from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .database import engine
from .routers.company import router as company_router
from .routers.market import router as market_router
from .routers.chat import router as chat_router

app = FastAPI(title="Stock Screener API", version="1.1.0")

# Set a comma-separated allowlist of frontend origins in FRONTEND_ORIGINS.
allowed_origins = [
    origin.strip()
    for origin in __import__("os").getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,https://hmstock-screener.netlify.app"
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(company_router)
app.include_router(market_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {"message": "Stock Screener API is running"}


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as exc:
        return {"status": "unhealthy", "database": "disconnected", "error": str(exc)}
