"""Tests for the impact stats endpoint."""
import pytest
from tests.conftest import client


def test_get_impact_stats(client):
    """Test getting impact statistics."""
    response = client.get("/api/impact-stats")
    
    assert response.status_code == 200
    data = response.json()
    
    # Check stats
    assert "stats" in data
    stats = data["stats"]
    assert "co2_sequestered_tons" in stats
    assert "waste_diverted_kg" in stats
    assert "eco_credits_earned" in stats
    assert "recovery_rate_percent" in stats
    assert "items_processed" in stats
    assert "active_users" in stats


def test_get_impact_stats_returns_activities(client):
    """Test that impact stats returns recent activities."""
    response = client.get("/api/impact-stats")
    
    data = response.json()
    assert "recent_activities" in data
    activities = data["recent_activities"]
    assert len(activities) > 0
    
    # Check activity structure
    for activity in activities:
        assert "id" in activity
        assert "type" in activity
        assert "description" in activity
        assert "impact" in activity
        assert "timestamp" in activity


def test_get_impact_stats_returns_weekly_data(client):
    """Test that impact stats returns weekly data."""
    response = client.get("/api/impact-stats")
    
    data = response.json()
    assert "weekly_data" in data
    weekly = data["weekly_data"]
    assert len(weekly) == 7  # 7 days
    
    for day in weekly:
        assert "day" in day
        assert "value" in day


def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get("/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "terrasync-api"


def test_root_endpoint(client):
    """Test the root endpoint."""
    response = client.get("/")
    
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "docs" in data
    assert "endpoints" in data
