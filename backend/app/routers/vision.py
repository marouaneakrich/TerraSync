from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Optional
from pydantic import BaseModel
from enum import Enum
import base64
import logging
from app.services.vision_service import analyze_item_image

router = APIRouter()
logger = logging.getLogger(__name__)


class ItemCategory(str, Enum):
    ELECTRONICS = "electronics"
    FURNITURE = "furniture"
    INDUSTRIAL_SCRAP = "industrial_scrap"
    TEXTILES = "textiles"
    PLASTICS = "plastics"
    METALS = "metals"
    ORGANIC = "organic"
    OTHER = "other"


class RecyclingPath(str, Enum):
    REUSE = "reuse"
    REFURBISH = "refurbish"
    RECYCLE = "recycle"
    UPCYCLE = "upcycle"
    DONATE = "donate"
    DISPOSE = "dispose"


class CircularValue(BaseModel):
    monetary_value: float
    eco_credits: int
    carbon_savings_kg: float
    confidence_score: float


class AnalysisResult(BaseModel):
    item_id: str
    category: ItemCategory
    subcategory: str
    description: str
    condition: str
    circular_value: CircularValue
    recommended_paths: list[str]  # Changed from list[RecyclingPath] to allow any string
    matching_organizations: list[dict]
    environmental_impact: dict


class AnalyzeItemResponse(BaseModel):
    success: bool
    analysis: Optional[AnalysisResult] = None
    error: Optional[str] = None


@router.post("/analyze-item")
async def analyze_item(file: UploadFile = File(...)):
    """
    Analyze an uploaded item image using AI vision.
    
    Returns categorization, circular value estimation, and recommended recycling paths.
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image data
        image_data = await file.read()
        image_base64 = base64.b64encode(image_data).decode("utf-8")
        
        # Analyze using vision service
        result = await analyze_item_image(image_base64, file.content_type)
        
        return AnalyzeItemResponse(
            success=True,
            analysis=AnalysisResult(**result)
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Analysis error: {error_msg}")
        
        # Check for specific OpenRouter errors
        if "No endpoints found" in error_msg:
            raise HTTPException(
                status_code=503, 
                detail="The vision model is currently unavailable. Please try again later or contact support."
            )
        elif "Timeout" in error_msg:
            raise HTTPException(
                status_code=504,
                detail="The analysis request timed out. Please try with a smaller image."
            )
        else:
            raise HTTPException(status_code=500, detail=f"Analysis failed: {error_msg}")
