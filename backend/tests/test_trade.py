"""Tests for the trade orchestration endpoint."""
import pytest
from tests.conftest import client


def test_orchestrate_trade_success(client):
    """Test successful trade orchestration."""
    response = client.post(
        "/api/orchestrate-trade",
        json={
            "item_id": "test-item-123",
            "user_id": "test-user-456"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "trade_id" in data
    assert data["status"] == "matched"
    assert "negotiation_steps" in data
    assert "matches" in data
    assert "eco_credits_earned" in data
    assert "carbon_impact_kg" in data


def test_orchestrate_trade_with_preferred_path(client):
    """Test trade orchestration with preferred path."""
    response = client.post(
        "/api/orchestrate-trade",
        json={
            "item_id": "test-item-123",
            "user_id": "test-user-456",
            "preferred_path": "donate"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_orchestrate_trade_with_location(client):
    """Test trade orchestration with location."""
    response = client.post(
        "/api/orchestrate-trade",
        json={
            "item_id": "test-item-123",
            "user_id": "test-user-456",
            "location": {"lat": 40.7128, "lng": -74.0060}
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_orchestrate_trade_returns_best_match(client):
    """Test that trade returns a best match."""
    response = client.post(
        "/api/orchestrate-trade",
        json={
            "item_id": "test-item-123",
            "user_id": "test-user-456"
        }
    )
    
    data = response.json()
    assert data["best_match"] is not None
    assert "organization_name" in data["best_match"]
    assert "match_score" in data["best_match"]
    assert "proposed_terms" in data["best_match"]


def test_orchestrate_trade_negotiation_steps(client):
    """Test that negotiation steps are returned."""
    response = client.post(
        "/api/orchestrate-trade",
        json={
            "item_id": "test-item-123",
            "user_id": "test-user-456"
        }
    )
    
    data = response.json()
    steps = data["negotiation_steps"]
    assert len(steps) > 0
    
    # Check step structure
    for step in steps:
        assert "step" in step
        assert "action" in step
        assert "party" in step
        assert "details" in step
        assert "timestamp" in step
