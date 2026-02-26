from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
from enum import Enum
from app.services.agent_service import orchestrate_trade_negotiation

router = APIRouter()


class TradeStatus(str, Enum):
    PENDING = "pending"
    NEGOTIATING = "negotiating"
    MATCHED = "matched"
    COMPLETED = "completed"
    FAILED = "failed"


class TradeRequest(BaseModel):
    item_id: str
    user_id: str
    preferred_path: Optional[str] = None
    location: Optional[dict] = None
    constraints: Optional[dict] = None


class NegotiationStep(BaseModel):
    step: int
    action: str
    party: str
    details: str
    timestamp: str


class MatchResult(BaseModel):
    organization_id: str
    organization_name: str
    organization_type: str
    match_score: float
    proposed_terms: dict
    distance_km: Optional[float]


class OrchestrateTradeResponse(BaseModel):
    success: bool
    trade_id: str
    status: TradeStatus
    negotiation_steps: list[NegotiationStep]
    matches: list[MatchResult]
    best_match: Optional[MatchResult]
    eco_credits_earned: int
    carbon_impact_kg: float
    error: Optional[str] = None


@router.post("/orchestrate-trade", response_model=OrchestrateTradeResponse)
@router.options("/orchestrate-trade")
async def orchestrate_trade(request: TradeRequest = None):
    """
    Orchestrate trade negotiation using AI agents.
    
    The agent negotiates with NGOs and recycling centers via mock API
    to find the best match for the item.
    """
    # Handle OPTIONS preflight request
    if request is None:
        return JSONResponse(
            status_code=200,
            content={"message": "CORS preflight successful"},
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        )
    
    try:
        result = await orchestrate_trade_negotiation(
            item_id=request.item_id,
            user_id=request.user_id,
            preferred_path=request.preferred_path,
            location=request.location,
            constraints=request.constraints
        )
        
        response_data = OrchestrateTradeResponse(
            success=True,
            trade_id=result["trade_id"],
            status=TradeStatus(result["status"]),
            negotiation_steps=[NegotiationStep(**step) for step in result["negotiation_steps"]],
            matches=[MatchResult(**match) for match in result["matches"]],
            best_match=MatchResult(**result["best_match"]) if result.get("best_match") else None,
            eco_credits_earned=result["eco_credits_earned"],
            carbon_impact_kg=result["carbon_impact_kg"]
        )
        
        return JSONResponse(
            status_code=200,
            content=response_data.dict(),
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        )
        
    except Exception as e:
        error_response = OrchestrateTradeResponse(
            success=False,
            trade_id="",
            status=TradeStatus.FAILED,
            negotiation_steps=[],
            matches=[],
            best_match=None,
            eco_credits_earned=0,
            carbon_impact_kg=0,
            error=str(e)
        )
        
        return JSONResponse(
            status_code=500,
            content=error_response.dict(),
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        )
