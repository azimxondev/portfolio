import html
import logging
from typing import Optional
import httpx
from backend import config

logger = logging.getLogger("telegram_service")


class TelegramDeliveryError(Exception):
    """Raised when delivery to Telegram Bot API fails."""
    pass


def format_contact_message(full_name: str, phone: str, message: str, source: str = "azimxon.uz") -> str:
    """
    Formats the message for Telegram using safe HTML escaping.
    The exact format matches the specification:
    📩 NEW AEDEV PORTFOLIO MESSAGE

    👤 Name: <full_name>

    📞 Phone: <phone>

    💬 Message:
    <message>

    🌐 Source: <source>
    """
    safe_name = html.escape(full_name.strip())
    safe_phone = html.escape(phone.strip())
    safe_message = html.escape(message.strip())
    safe_source = html.escape(source.strip())

    return (
        f"📩 <b>NEW AEDEV PORTFOLIO MESSAGE</b>\n\n"
        f"👤 <b>Name:</b> {safe_name}\n\n"
        f"📞 <b>Phone:</b> {safe_phone}\n\n"
        f"💬 <b>Message:</b>\n"
        f"{safe_message}\n\n"
        f"🌐 <b>Source:</b> {safe_source}"
    )


async def send_telegram_notification(
    full_name: str,
    phone: str,
    message: str,
    source: str = "azimxon.uz",
    client: Optional[httpx.AsyncClient] = None
) -> bool:
    """
    Sends contact submission to Telegram Bot API.
    Raises TelegramDeliveryError with safe descriptions on failure (never leaking secrets).
    """
    if not config.is_telegram_configured():
        logger.warning("Telegram Bot is not configured. Missing valid token or chat ID.")
        raise TelegramDeliveryError("Telegram bot credentials are not configured.")

    text = format_contact_message(full_name, phone, message, source)
    url = f"https://api.telegram.org/bot{config.TELEGRAM_BOT_TOKEN}/sendMessage"

    payload = {
        "chat_id": config.TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }

    should_close_client = False
    if client is None:
        client = httpx.AsyncClient(timeout=10.0)
        should_close_client = True

    try:
        response = await client.post(url, json=payload)
        data = response.json() if response.headers.get("content-type", "").startswith("application/json") else {}

        if response.status_code != 200 or not data.get("ok"):
            error_code = data.get("error_code", response.status_code)
            error_desc = data.get("description", "Unknown Telegram API error")
            logger.error("Telegram API rejection: %s (code: %s)", error_desc, error_code)
            raise TelegramDeliveryError(f"Telegram API delivery failed: {error_desc}")

        return True

    except httpx.TimeoutException as exc:
        logger.error("Telegram API request timed out.")
        raise TelegramDeliveryError("Telegram API request timed out. Please try again.") from exc
    except httpx.RequestError as exc:
        logger.error("Network error while connecting to Telegram API: %s", type(exc).__name__)
        raise TelegramDeliveryError("Network error connecting to Telegram service.") from exc
    finally:
        if should_close_client:
            await client.aclose()
