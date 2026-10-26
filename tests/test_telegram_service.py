import pytest
import httpx
from unittest.mock import patch, AsyncMock
from backend import config
from backend.telegram_service import (
    format_contact_message,
    send_telegram_notification,
    TelegramDeliveryError
)


def test_format_contact_message_escaping():
    """Verify Variant 3 Ultra Minimal Premium format and safe HTML escaping."""
    name = '<script>alert("xss")</script> & John'
    phone = '+998 90 123 45 67 <tag>'
    message = '<b>Bold test</b> & "quotes"'

    formatted = format_contact_message(name, phone, message)

    assert "<script>" not in formatted
    assert "&lt;script&gt;" in formatted
    assert "&amp; John" in formatted
    assert "&lt;b&gt;Bold test&lt;/b&gt;" in formatted
    assert "&lt;tag&gt;" in formatted
    
    # Check Variant 3 Ultra Minimal Premium structure
    assert "<b>AEDEV.</b>" in formatted
    assert "<b>NEW CONTACT REQUEST</b>" in formatted
    assert "━━━━━━━━━━━━━━━━━━━━" in formatted
    assert "<b>FROM</b>" in formatted
    assert "<b>PHONE</b>" in formatted
    assert "<b>MESSAGE</b>" in formatted
    assert "<i>azimxon.uz · Portfolio Contact</i>" in formatted


@pytest.mark.asyncio
async def test_send_telegram_notification_unconfigured():
    """Scenario 9: Verify error raised when credentials are not configured."""
    with patch.object(config, "is_telegram_configured", return_value=False):
        with pytest.raises(TelegramDeliveryError) as exc_info:
            await send_telegram_notification(
                full_name="John Smith",
                phone="+998 90 123 45 67",
                message="Hello from unit tests"
            )
        assert "not configured" in str(exc_info.value)


@pytest.mark.asyncio
async def test_send_telegram_notification_success():
    """Scenario 7: Verify successful delivery when Telegram API returns ok: true."""
    mock_response = httpx.Response(
        status_code=200,
        json={"ok": True, "result": {"message_id": 999}},
        headers={"content-type": "application/json"},
        request=httpx.Request("POST", "https://api.telegram.org")
    )

    with patch.object(config, "is_telegram_configured", return_value=True),          patch.object(config, "TELEGRAM_BOT_TOKEN", "mock_bot_token"),          patch.object(config, "TELEGRAM_CHAT_ID", "123456789"):

        mock_client = AsyncMock(spec=httpx.AsyncClient)
        mock_client.post.return_value = mock_response

        success = await send_telegram_notification(
            full_name="John Smith",
            phone="+998 90 123 45 67",
            message="Hello from unit tests",
            client=mock_client
        )

        assert success is True
        mock_client.post.assert_called_once()
        call_kwargs = mock_client.post.call_args[1]
        assert call_kwargs["json"]["chat_id"] == "123456789"
        assert "John Smith" in call_kwargs["json"]["text"]
        assert "+998 90 123 45 67" in call_kwargs["json"]["text"]
        assert "<b>AEDEV.</b>" in call_kwargs["json"]["text"]


@pytest.mark.asyncio
async def test_send_telegram_notification_api_failure():
    """Scenario 8: Verify error handling when Telegram API rejects the message."""
    mock_response = httpx.Response(
        status_code=400,
        json={"ok": False, "error_code": 400, "description": "Chat not found"},
        headers={"content-type": "application/json"},
        request=httpx.Request("POST", "https://api.telegram.org")
    )

    with patch.object(config, "is_telegram_configured", return_value=True),          patch.object(config, "TELEGRAM_BOT_TOKEN", "mock_bot_token"),          patch.object(config, "TELEGRAM_CHAT_ID", "invalid_id"):

        mock_client = AsyncMock(spec=httpx.AsyncClient)
        mock_client.post.return_value = mock_response

        with pytest.raises(TelegramDeliveryError) as exc_info:
            await send_telegram_notification(
                full_name="John Smith",
                phone="+998 90 123 45 67",
                message="Testing failure case",
                client=mock_client
            )
        assert "Chat not found" in str(exc_info.value)
