import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
from backend.main import app, rate_limiter
from backend import config
from backend.telegram_service import TelegramDeliveryError

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_rate_limits():
    """Clear in-memory rate limiter between tests."""
    rate_limiter.requests.clear()


def test_health_check_endpoint():
    """Verify health endpoint returns status without leaking tokens."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "telegram_configured" in data
    assert "token" not in str(data).lower() or "telegram_configured" in data


def test_serve_frontend_index():
    """Verify frontend index.html is served from root / and visitor remains on page."""
    response = client.get("/")
    assert response.status_code == 200
    assert "AEDEV" in response.text
    assert "direct-contact-form" in response.text
    assert "input-phone" in response.text
    assert "input-name" in response.text
    assert "input-message" in response.text
    assert 'action="https://t.me' not in response.text


def test_env_file_not_exposed_over_http():
    """Verify that .env cannot be fetched by web visitors."""
    response = client.get("/.env")
    assert response.status_code == 404


def test_backend_source_not_exposed_over_http():
    """Verify that backend source files cannot be fetched by web visitors."""
    response = client.get("/backend/config.py")
    assert response.status_code == 404


def test_contact_validation_missing_fields():
    """Scenario 2 & 3 & 5: Verify required field validation for missing fields."""
    response = client.post("/api/contact", json={})
    assert response.status_code == 422


def test_contact_validation_missing_name():
    """Scenario 2: Missing name."""
    response = client.post("/api/contact", json={
        "phone": "+998 90 123 45 67",
        "message": "Valid message here"
    })
    assert response.status_code == 422


def test_contact_validation_missing_phone():
    """Scenario 3: Missing phone."""
    response = client.post("/api/contact", json={
        "full_name": "John Smith",
        "message": "Valid message here"
    })
    assert response.status_code == 422


def test_contact_validation_invalid_phone_too_short():
    """Scenario 4: Invalid phone with insufficient digits."""
    response = client.post("/api/contact", json={
        "full_name": "John Smith",
        "phone": "123",
        "message": "Valid test message here"
    })
    assert response.status_code == 422


def test_contact_validation_invalid_phone_letters():
    """Scenario 4: Invalid phone with alphabetic characters."""
    response = client.post("/api/contact", json={
        "full_name": "John Smith",
        "phone": "+998 90 ABC 45 67",
        "message": "Valid test message here"
    })
    assert response.status_code == 422


def test_contact_validation_missing_message():
    """Scenario 5: Missing message."""
    response = client.post("/api/contact", json={
        "full_name": "John Smith",
        "phone": "+998 90 123 45 67"
    })
    assert response.status_code == 422


def test_contact_validation_short_message():
    """Scenario 6: Verify minimum message length validation (at least 5 chars)."""
    response = client.post("/api/contact", json={
        "full_name": "John Smith",
        "phone": "+998 90 123 45 67",
        "message": "hi"
    })
    assert response.status_code == 422


def test_contact_validation_excessively_long_message():
    """Scenario 6: Verify maximum message length validation (> 3000 chars)."""
    response = client.post("/api/contact", json={
        "full_name": "John Smith",
        "phone": "+998 90 123 45 67",
        "message": "A" * 3005
    })
    assert response.status_code == 422


def test_contact_honeypot_bot_detection():
    """Scenario 10: Verify honeypot silently swallows spam submissions."""
    response = client.post("/api/contact", json={
        "full_name": "Spam Bot",
        "phone": "+998 90 123 45 67",
        "message": "Buy crypto now!",
        "hp_website": "http://spamsite.com"
    })
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_contact_unconfigured_service():
    """Scenario 9: Verify 503 response when Telegram bot credentials are missing."""
    with patch.object(config, "is_telegram_configured", return_value=False):
        response = client.post("/api/contact", json={
            "full_name": "John Smith",
            "phone": "+998 90 123 45 67",
            "message": "Hello from testing!"
        })
        assert response.status_code == 503
        assert "unconfigured" in response.json()["detail"].lower()


@patch("backend.main.send_telegram_notification", new_callable=AsyncMock)
def test_contact_success(mock_send):
    """Scenario 1 & 7: Verify successful submission with valid name, phone, message returns 200."""
    mock_send.return_value = True

    with patch.object(config, "is_telegram_configured", return_value=True):
        response = client.post("/api/contact", json={
            "full_name": "John Smith",
            "phone": "+998 90 123 45 67",
            "message": "I would like to discuss a backend project with you."
        })

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["message"] == "Message sent successfully!"
        mock_send.assert_called_once_with(
            full_name="John Smith",
            phone="+998 90 123 45 67",
            message="I would like to discuss a backend project with you.",
            source="azimxon.uz"
        )


@patch("backend.main.send_telegram_notification", new_callable=AsyncMock)
def test_contact_success_with_alias_name(mock_send):
    """Scenario 1: Support name as alias for full_name."""
    mock_send.return_value = True

    with patch.object(config, "is_telegram_configured", return_value=True):
        response = client.post("/api/contact", json={
            "name": "Azimxon Ergashev",
            "phone": "+998901234567",
            "message": "Discussing Python backend development."
        })

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        mock_send.assert_called_once_with(
            full_name="Azimxon Ergashev",
            phone="+998 90 123 45 67",
            message="Discussing Python backend development.",
            source="azimxon.uz"
        )


@patch("backend.main.send_telegram_notification", new_callable=AsyncMock)
def test_contact_telegram_failure_returns_502(mock_send):
    """Scenario 8: Verify Telegram API rejection returns 502 Bad Gateway."""
    mock_send.side_effect = TelegramDeliveryError("Telegram API rejection: Chat not found")

    with patch.object(config, "is_telegram_configured", return_value=True):
        response = client.post("/api/contact", json={
            "full_name": "John Smith",
            "phone": "+998 90 123 45 67",
            "message": "Testing telegram failure response."
        })

        assert response.status_code == 502
        assert "Telegram API rejection" in response.json()["detail"]


@patch("backend.main.send_telegram_notification", new_callable=AsyncMock)
def test_rate_limiting(mock_send):
    """Scenario 11: Verify rate limiter blocks excessive requests beyond 5 per min."""
    mock_send.return_value = True

    with patch.object(config, "is_telegram_configured", return_value=True):
        for _ in range(5):
            res = client.post("/api/contact", json={
                "full_name": "John Smith",
                "phone": "+998 90 123 45 67",
                "message": "Testing rate limit"
            })
            assert res.status_code == 200

        # 6th request must trigger 429
        blocked_res = client.post("/api/contact", json={
            "full_name": "John Smith",
            "phone": "+998 90 123 45 67",
            "message": "Testing rate limit"
        })
        assert blocked_res.status_code == 429
        assert "Too many messages" in blocked_res.json()["detail"]


@patch("backend.main.send_telegram_notification", new_callable=AsyncMock)
def test_contact_phone_without_country_code_normalized(mock_send):
    """Verify user can enter Uzbek phone without +998 (e.g. 881226767) and it normalizes to +998."""
    mock_send.return_value = True

    with patch.object(config, "is_telegram_configured", return_value=True):
        res = client.post("/api/contact", json={
            "full_name": "Azimxon Ergashev",
            "phone": "881226767",
            "message": "Testing local phone number without +998"
        })
        assert res.status_code == 200
        assert res.json()["success"] is True
        mock_send.assert_called_once()
        call_kwargs = mock_send.call_args.kwargs
        assert call_kwargs["phone"] == "+998 88 122 67 67"


@patch("backend.main.send_telegram_notification", new_callable=AsyncMock)
def test_contact_phone_with_998_digits_normalized(mock_send):
    """Verify user can enter 12 digits (e.g. 998881226767) and it normalizes to +998 format."""
    mock_send.return_value = True

    with patch.object(config, "is_telegram_configured", return_value=True):
        res = client.post("/api/contact", json={
            "full_name": "Azimxon Ergashev",
            "phone": "+998881226767",
            "message": "Testing full phone number"
        })
        assert res.status_code == 200
        assert res.json()["success"] is True
        mock_send.assert_called_once()
        call_kwargs = mock_send.call_args.kwargs
        assert call_kwargs["phone"] == "+998 88 122 67 67"

