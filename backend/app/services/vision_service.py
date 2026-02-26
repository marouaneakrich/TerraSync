import uuid
import json
import httpx
import logging
from typing import Optional
from app.config import settings

logger = logging.getLogger(__name__)


async def analyze_item_image(image_base64: str, content_type: str) -> dict:
    """
    Analyze an item image using OpenRouter API with vision-capable models.
    
    Returns categorization, circular value estimation, and recommended paths.
    """
    # If no API key, raise error - don't silently return mock data
    if not settings.OPENROUTER_API_KEY:
        error_msg = "OPENROUTER_API_KEY is not set. Please configure your .env file."
        logger.error(error_msg)
        raise ValueError(error_msg)
    
    # Use vision-capable model (VL = Vision Language)
    vision_model = settings.OPENROUTER_VISION_MODEL
    logger.info(f"Analyzing image with model: {vision_model}")
    
    try:
        # Prepare the image URL for the vision API
        image_url = f"data:{content_type};base64,{image_base64}"
        
        # OpenRouter API request
        async with httpx.AsyncClient(timeout=120.0) as client:
            logger.info(f"Sending request to OpenRouter API with model: {vision_model}")
            
            response = await client.post(
                f"{settings.OPENROUTER_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://terrasync.app",
                    "X-Title": "TerraSync"
                },
                json={
                    "model": vision_model,
                    "messages": [
                        {
                            "role": "system",
                            "content": """You are an expert in circular economy and waste management. Analyze images ACCURATELY and provide REALISTIC valuations.

ANALYSIS RULES:
1. Identify what you see in the image honestly
2. If the image shows a physical item (electronics, furniture, etc.), provide ACCURATE market values based on:
   - Current resale market prices (eBay, Craigslist, etc.)
   - Item condition visible in image
   - Age and wear apparent
3. If image shows agricultural products/crops, provide realistic values based on:
   - Crops in field: Estimate yield potential value ($50-500 per acre based on crop type and condition)
   - Harvested crops: $0.20-2.00 per kg depending on type
   - Agricultural waste: $0.05-0.15 per kg for biomass
4. If image is unclear/doesn't show a sellable item, set monetary_value to 0 and explain why
5. Be specific about what you see - brand, model, type if identifiable

PRICING GUIDELINES (be realistic):
- Working laptop (3-5 years old): $100-300
- Broken/damaged laptop: $20-50 for parts
- Working smartphone (2-3 years old): $150-400
- Furniture (good condition): $50-500 depending on type
- Scrap metal: $0.05-0.20 per lb
- Clothing (good condition): $5-50
- Broken/small electronics: $5-30
- Books: $1-20
- Appliances (working): $50-300
- Appliances (broken): $10-50 for parts
- Crops in field (healthy): $200-500 per acre yield potential
- Crops in field (stressed/diseased): $50-150 per acre yield potential
- Harvested grains: $0.20-0.50 per kg
- Vegetables: $0.50-3.00 per kg
- Agricultural waste: $0.05-0.15 per kg

ECO-CREDITS (based on recyclability/value):
- Electronics: 20-80 credits
- Furniture: 15-50 credits
- Metals: 30-70 credits
- Plastics: 5-20 credits
- Textiles: 5-25 credits
- Organic waste: 5-15 credits
- Agricultural crops (healthy): 15-40 credits
- Agricultural crops (stressed): 5-15 credits
- Biomass/agricultural waste: 10-30 credits

CONFIDENCE SCORE:
- 0.8-0.95: Clear image, easily identifiable item
- 0.5-0.7: Somewhat clear, reasonable identification
- 0.2-0.4: Unclear image or uncertain identification
- 0.1: Cannot identify anything useful

Provide a JSON response with these exact fields:
{
    "category": "electronics|furniture|industrial_scrap|textiles|plastics|metals|organic|other",
    "subcategory": "specific type (e.g., 'laptop_computer', 'office_chair', 'rice_crop', 'soybean_field')",
    "description": "Detailed description of what you see including brand/model if visible, condition details, any damage",
    "condition": "excellent|good|fair|poor",
    "circular_value": {
        "monetary_value": realistic USD value (for crops in field, estimate yield potential per acre),
        "eco_credits": 1-100 based on recyclability/environmental value,
        "carbon_savings_kg": realistic estimate,
        "confidence_score": 0.1-0.95 based on image clarity
    },
    "recommended_paths": ["reuse", "refurbish", "recycle", "upcycle", "donate", "dispose"],
    "environmental_impact": {
        "co2_saved_kg": realistic estimate,
        "waste_diverted_kg": realistic estimate,
        "water_saved_liters": realistic estimate,
        "energy_saved_kwh": realistic estimate
    }
}

Be ACCURATE and REALISTIC. For agricultural products, consider their yield potential and environmental value. Respond ONLY with valid JSON."""
                        },
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": "Analyze this image for circular economy potential. Be HONEST and CRITICAL. If the image is unclear or shows trash/waste, say so. Describe ONLY what you actually see in the image."},
                                {"type": "image_url", "image_url": {"url": image_url}}
                            ]
                        }
                    ],
                    "max_tokens": 2000
                }
            )
            
            logger.info(f"Response status: {response.status_code}")
            
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"API error response: {error_text}")
                raise Exception(f"OpenRouter API error ({response.status_code}): {error_text}")
            
            data = response.json()
            logger.info(f"API response received, choices: {len(data.get('choices', []))}")
            
            if not data.get("choices"):
                raise Exception(f"No choices in OpenRouter response: {data}")
            
            # Parse the response
            content = data["choices"][0]["message"]["content"]
            logger.info(f"Raw response content (first 500 chars): {content[:500]}...")
            
            # Clean up potential markdown code blocks
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
                content = content.strip()
            
            # Handle trailing content after JSON
            try:
                # Find the JSON object
                start_idx = content.find('{')
                end_idx = content.rfind('}') + 1
                if start_idx != -1 and end_idx > start_idx:
                    content = content[start_idx:end_idx]
                
                result = json.loads(content)
            except json.JSONDecodeError as je:
                logger.error(f"JSON parse error: {je}")
                logger.error(f"Problematic content: {content}")
                raise Exception(f"Failed to parse AI response as JSON: {je}")
            
            # Validate required fields
            required_fields = ["category", "subcategory", "description", "condition", "circular_value", "recommended_paths", "environmental_impact"]
            for field in required_fields:
                if field not in result:
                    raise Exception(f"Missing required field in AI response: {field}")
            
            # Validate circular_value subfields
            cv = result.get("circular_value", {})
            for cv_field in ["monetary_value", "eco_credits", "carbon_savings_kg", "confidence_score"]:
                if cv_field not in cv:
                    raise Exception(f"Missing circular_value field: {cv_field}")
            
            result["item_id"] = str(uuid.uuid4())
            
            # Add matching organizations
            result["matching_organizations"] = _get_matching_organizations(result.get("category", "other"))
            
            logger.info(f"Successfully analyzed item: {result.get('category', 'unknown')} - {result.get('subcategory', 'unknown')} (confidence: {result.get('circular_value', {}).get('confidence_score', 0)})")
            
            return result
            
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error calling OpenRouter: {e}")
        raise Exception(f"HTTP error calling OpenRouter: {e.response.text if hasattr(e, 'response') else str(e)}")
    except httpx.TimeoutException:
        logger.error("Timeout calling OpenRouter API")
        raise Exception("Timeout calling OpenRouter API - the request took too long")
    except Exception as e:
        logger.error(f"Vision analysis error: {type(e).__name__}: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise


def _get_mock_analysis() -> dict:
    """Return mock analysis data for development/testing."""
    return {
        "item_id": str(uuid.uuid4()),
        "category": "electronics",
        "subcategory": "laptop_computer",
        "description": "A used laptop computer, approximately 3-5 years old. Appears to be in working condition with minor cosmetic wear.",
        "condition": "good",
        "circular_value": {
            "monetary_value": 150.00,
            "eco_credits": 45,
            "carbon_savings_kg": 12.5,
            "confidence_score": 0.85
        },
        "recommended_paths": ["refurbish", "donate", "recycle"],
        "matching_organizations": _get_matching_organizations("electronics"),
        "environmental_impact": {
            "co2_saved_kg": 12.5,
            "waste_diverted_kg": 2.8,
            "water_saved_liters": 1500,
            "energy_saved_kwh": 85
        }
    }


def _get_matching_organizations(category: str) -> list[dict]:
    """Get mock matching organizations based on category."""
    organizations = {
        "electronics": [
            {"id": "ngo-001", "name": "Tech for All", "type": "ngo", "match_score": 0.92, "distance_km": 5.2},
            {"id": "recycle-001", "name": "E-Waste Solutions", "type": "recycling_center", "match_score": 0.88, "distance_km": 3.1},
            {"id": "ngo-002", "name": "Digital Bridge", "type": "ngo", "match_score": 0.85, "distance_km": 8.7}
        ],
        "furniture": [
            {"id": "ngo-003", "name": "Habitat ReStore", "type": "ngo", "match_score": 0.95, "distance_km": 2.5},
            {"id": "recycle-002", "name": "Furniture Recycling Co", "type": "recycling_center", "match_score": 0.82, "distance_km": 6.3}
        ],
        "industrial_scrap": [
            {"id": "recycle-003", "name": "Industrial Metals Inc", "type": "recycling_center", "match_score": 0.97, "distance_km": 12.0},
            {"id": "recycle-004", "name": "Scrap Solutions", "type": "recycling_center", "match_score": 0.89, "distance_km": 8.5}
        ]
    }
    
    return organizations.get(category, [
        {"id": "ngo-default", "name": "General Reuse Center", "type": "ngo", "match_score": 0.75, "distance_km": 10.0}
    ])
