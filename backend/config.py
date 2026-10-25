import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory for the portfolio bot project
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env if present
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

# Telegram Bot Credentials
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "").strip()

# App Configuration
APP_ENV = os.getenv("APP_ENV", "development").strip().lower()
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")

# Rate Limiting & Security
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "5"))
ALLOWED_ORIGINS_RAW = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:8000,http://127.0.0.1:8000"
)
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS_RAW.split(",") if origin.strip()]

# Static Frontend Directory
FRONTEND_DIR = BASE_DIR / "frontend"


def is_telegram_configured() -> bool:
    """
    Checks whether real Telegram credentials have been supplied.
    Returns False if values are default placeholders or empty.
    """
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return False
    if "your_bot_token_here" in TELEGRAM_BOT_TOKEN.lower():
        return False
    if "your_chat_id_here" in TELEGRAM_CHAT_ID.lower():
        return False
    return True
