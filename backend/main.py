import time
import re
from collections import defaultdict
from typing import Dict, List
import logging

from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, field_validator, model_validator

from backend import config
from backend.telegram_service import send_telegram_notification, TelegramDeliveryError

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("aedev_backend")
# Suppress httpx request logging to prevent token leakage in console logs
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

app = FastAPI(
    title="AEDEV Portfolio Contact API",
    version="1.0.0",
    docs_url="/api/docs" if config.APP_ENV == "development" else None,
    redoc_url=None
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?" if config.APP_ENV == "development" else None,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# Rate Limiter (In-Memory per client IP)
class RateLimiter:
    def __init__(self, max_requests: int = 5, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = defaultdict(list)

    def is_allowed(self, client_ip: str) -> bool:
        now = time.time()
        # Clean older timestamps
        self.requests[client_ip] = [
            ts for ts in self.requests[client_ip] if now - ts < self.window_seconds
        ]
        if len(self.requests[client_ip]) >= self.max_requests:
            return False
        self.requests[client_ip].append(now)
        return True


rate_limiter = RateLimiter(
    max_requests=config.RATE_LIMIT_PER_MINUTE,
    window_seconds=60
)


# Request Schema for Contact Form (Full Name, Phone Number, Message, Honeypot)
class ContactFormRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, description="Visitor's full name")
    phone: str = Field(..., min_length=7, max_length=25, description="Visitor's telephone number")
    message: str = Field(..., min_length=5, max_length=3000, description="Visitor's reason for contact / message")
    hp_website: str = Field(default="", max_length=50, description="Honeypot field for spam detection")

    @model_validator(mode="before")
    @classmethod
    def populate_alias_fields(cls, data):
        if isinstance(data, dict):
            # Support "name" as alias for "full_name"
            if not data.get("full_name") and data.get("name"):
                data["full_name"] = data["name"]
        return data

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Full name must be at least 2 characters.")
        return cleaned

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = v.strip()
        # Ensure only allowed telephone characters
        if not re.match(r"^\+?[0-9\s\-\(\)\.]+$", cleaned):
            raise ValueError("Phone number contains invalid characters.")
        digits = re.sub(r"\D", "", cleaned)
        if not (7 <= len(digits) <= 15):
            raise ValueError("Phone number must contain between 7 and 15 digits.")
        # If 9 digits provided (Uzbek number without +998, e.g. 881226767 or 901234567)
        if len(digits) == 9:
            return f"+998 {digits[:2]} {digits[2:5]} {digits[5:7]} {digits[7:]}"
        # If 12 digits provided starting with 998 (e.g. 998881226767 or +998881226767)
        if len(digits) == 12 and digits.startswith("998"):
            return f"+998 {digits[3:5]} {digits[5:8]} {digits[8:10]} {digits[10:]}"
        return cleaned

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 5:
            raise ValueError("Message must be at least 5 characters.")
        return cleaned


@app.get("/api/health")
async def health_check():
    """
    Health check endpoint verifying server status and whether Telegram credentials are set.
    Never exposes real tokens or chat IDs.
    """
    return {
        "status": "healthy",
        "app_env": config.APP_ENV,
        "telegram_configured": config.is_telegram_configured()
    }


@app.post("/api/contact")
async def handle_contact_form(request: Request, payload: ContactFormRequest):
    """
    Handles Contact Form submissions directly on the portfolio website:
    - Validates full_name, phone, message
    - Checks honeypot spam protection
    - Applies IP rate limiting
    - Dispatches notification to Telegram via @ae_contact_bot to personal chat
    - Keeps visitor on the site at all times
    """
    # 1. Spam check (Honeypot)
    if payload.hp_website.strip():
        logger.warning("Spam detected via honeypot field. Dropping request silently.")
        return {"success": True, "message": "Message sent successfully!"}

    # 2. Rate Limiting by IP
    client_ip = request.client.host if request.client else "unknown"
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()

    if not rate_limiter.is_allowed(client_ip):
        logger.warning("Rate limit exceeded for IP: %s", client_ip)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many messages submitted. Please wait a minute and try again."
        )

    # 3. Check configuration
    if not config.is_telegram_configured():
        logger.error("Attempted contact submission but Telegram credentials are not set in .env")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Contact service is temporarily unconfigured. Please configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID."
        )

    # 4. Dispatch Telegram Notification
    try:
        await send_telegram_notification(
            full_name=payload.full_name,
            phone=payload.phone,
            message=payload.message,
            source="azimxon.uz"
        )
    except TelegramDeliveryError as err:
        logger.error("Failed to deliver message via Telegram: %s", err)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(err)
        )
    except Exception as exc:
        logger.error("Unexpected error delivering message: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send message. Please try again later."
        )

    logger.info("Successfully delivered contact notification for %s (%s)", payload.full_name, payload.phone)
    return {
        "success": True,
        "message": "Message sent successfully!"
    }


# Static Files & Frontend Serving
if config.FRONTEND_DIR.is_dir():
    app.mount("/", StaticFiles(directory=str(config.FRONTEND_DIR), html=True), name="frontend")
else:
    logger.warning("Frontend directory not found at: %s", config.FRONTEND_DIR)
