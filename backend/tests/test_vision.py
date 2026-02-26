"""Tests for the vision analysis endpoint."""
import pytest
from io import BytesIO
from tests.conftest import client


def test_analyze_item_no_file(client):
    """Test that analysis fails without a file."""
    response = client.post("/api/analyze-item")
    assert response.status_code == 422  # Validation error


def test_analyze_item_invalid_file(client):
    """Test that analysis fails with non-image file."""
    # Create a text file instead of image
    file = BytesIO(b"not an image")
    response = client.post(
        "/api/analyze-item",
        files={"file": ("test.txt", file, "text/plain")}
    )
    assert response.status_code == 400
    assert "must be an image" in response.json()["detail"]


def test_analyze_item_success(client):
    """Test successful item analysis (returns mock data without API key)."""
    # Create a minimal valid PNG image
    file = BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82")
    
    response = client.post(
        "/api/analyze-item",
        files={"file": ("test.png", file, "image/png")}
    )
    
    # Should succeed (returns mock data when no API key)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "analysis" in data
    assert "item_id" in data["analysis"]
    assert "category" in data["analysis"]
    assert "circular_value" in data["analysis"]


def test_analyze_item_returns_expected_fields(client):
    """Test that analysis returns all expected fields."""
    file = BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82")
    
    response = client.post(
        "/api/analyze-item",
        files={"file": ("test.png", file, "image/png")}
    )
    
    data = response.json()
    analysis = data["analysis"]
    
    # Check all required fields
    assert "category" in analysis
    assert "subcategory" in analysis
    assert "description" in analysis
    assert "condition" in analysis
    assert "circular_value" in analysis
    assert "monetary_value" in analysis["circular_value"]
    assert "eco_credits" in analysis["circular_value"]
    assert "carbon_savings_kg" in analysis["circular_value"]
    assert "confidence_score" in analysis["circular_value"]
    assert "recommended_paths" in analysis
    assert "matching_organizations" in analysis
    assert "environmental_impact" in analysis
