from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
from typing import Optional
from enum import Enum
from app.services.agent_service import orchestrate_trade_negotiation

router = APIRouter()


class TradeRequest(BaseModel):
    item_id: str
    user_id: str
    preferred_outcome: str = "best_value"
    negotiation_strategy: str = "balanced"


class NegotiationResult(BaseModel):
    success: bool
    transaction_id: Optional[str] = None
    negotiated_value: Optional[float] = None
    eco_credits_earned: Optional[int] = None
    partner_info: Optional[dict] = None
    message: str


class OrchestrateTradeResponse(BaseModel):
    success: bool
    result: Optional[NegotiationResult] = None
    error: Optional[str] = None


@router.post("/orchestrate-trade", response_model=OrchestrateTradeResponse)
async def orchestrate_trade_post(request: TradeRequest):
    """
    Orchestrate a trade negotiation using AI agent.
    """
    try:
        # Call the agent service to orchestrate the trade
        result = await orchestrate_trade_negotiation(
            item_id=request.item_id,
            user_id=request.user_id,
            preferred_outcome=request.preferred_outcome,
            negotiation_strategy=request.negotiation_strategy
        )
        
        response_data = OrchestrateTradeResponse(
            success=True,
            result=result
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
        
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Trade orchestration error: {error_msg}")
        
        error_response = OrchestrateTradeResponse(
            success=False,
            error=f"Trade orchestration failed: {error_msg}"
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


@router.options("/orchestrate-trade")
async def orchestrate_trade_options():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*"
        }
    )
