"""
AEDEV Portfolio Telegram Contact Server Launcher.
Starts the FastAPI application and serves both frontend and API on http://localhost:8000
"""
import sys
from pathlib import Path

# Ensure portfoli bot root is in python path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

import uvicorn
from backend import config

if __name__ == "__main__":
    print(f"Starting AEDEV Portfolio server on http://localhost:{config.PORT} ...")
    print(f"Telegram Configured: {config.is_telegram_configured()}")
    if not config.is_telegram_configured():
        print("NOTE: Telegram credentials are using placeholder values in .env.")
        print("Please configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env to deliver real messages.")
    uvicorn.run(
        "backend.main:app",
        host=config.HOST,
        port=config.PORT,
        reload=(config.APP_ENV == "development"),
        app_dir=str(BASE_DIR)
    )
