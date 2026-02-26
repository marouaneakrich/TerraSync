from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime
import random

router = APIRouter()


class Activity(BaseModel):
    id: str
    type: str
    description: str
    impact: int
    timestamp: str
    location: str | None = None


class ImpactStats(BaseModel):
    co2_sequestered_tons: int
    waste_diverted_kg: int
    eco_credits_earned: int
    recovery_rate_percent: int
    items_processed: int
    active_users: int


class ImpactResponse(BaseModel):
    stats: ImpactStats
    recent_activities: List[Activity]
    weekly_data: List[dict]


@router.get("/impact-stats", response_model=ImpactResponse)
async def get_impact_stats():
    """
    Get real-time impact statistics for the dashboard.
    """
    # In production, these would come from a database
    stats = ImpactStats(
        co2_sequestered_tons=2847,
        waste_diverted_kg=156420,
        eco_credits_earned=892340,
        recovery_rate_percent=94,
        items_processed=45231,
        active_users=12847,
    )
    
    activities = [
        Activity(
            id="act-001",
            type="trade",
            description="Laptop donated to Tech for All",
            impact=45,
            timestamp=datetime.utcnow().isoformat(),
            location="New York, NY"
        ),
        Activity(
            id="act-002",
            type="analysis",
            description="Furniture analyzed for reuse",
            impact=12,
            timestamp=datetime.utcnow().isoformat(),
            location=None
        ),
        Activity(
            id="act-003",
            type="credit",
            description="Eco-credits earned from recycling",
            impact=38,
            timestamp=datetime.utcnow().isoformat(),
            location=None
        ),
        Activity(
            id="act-004",
            type="trade",
            description="Industrial scrap matched with recycler",
            impact=67,
            timestamp=datetime.utcnow().isoformat(),
            location="Brooklyn, NY"
        ),
        Activity(
            id="act-005",
            type="analysis",
            description="Electronics analyzed for refurbishment",
            impact=23,
            timestamp=datetime.utcnow().isoformat(),
            location=None
        ),
    ]
    
    weekly_data = [
        {"day": "Mon", "value": random.randint(100, 200)},
        {"day": "Tue", "value": random.randint(150, 250)},
        {"day": "Wed", "value": random.randint(100, 200)},
        {"day": "Thu", "value": random.randint(200, 300)},
        {"day": "Fri", "value": random.randint(150, 250)},
        {"day": "Sat", "value": random.randint(250, 350)},
        {"day": "Sun", "value": random.randint(200, 300)},
    ]
    
    return ImpactResponse(
        stats=stats,
        recent_activities=activities,
        weekly_data=weekly_data
    )
