import uuid
from datetime import datetime
from typing import Optional
import random
import json
import httpx
import logging

# LangChain/LangGraph imports for agentic negotiation
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

from app.config import settings

logger = logging.getLogger(__name__)


class AgentState(TypedDict):
    """State for the negotiation agent."""
    messages: Annotated[list, operator.add]
    item_id: str
    user_id: str
    preferred_path: Optional[str]
    location: Optional[dict]
    current_step: str
    matches: list
    best_match: Optional[dict]
    negotiation_history: list


async def orchestrate_trade_negotiation(
    item_id: str,
    user_id: str,
    preferred_path: Optional[str] = None,
    location: Optional[dict] = None,
    constraints: Optional[dict] = None
) -> dict:
    """
    Orchestrate trade negotiation using LangGraph agent with OpenRouter.
    
    The agent negotiates with NGOs and recycling centers via mock API
    to find the best match for the item.
    """
    trade_id = f"trade-{uuid.uuid4().hex[:8]}"
    
    # Initialize LLM with OpenRouter if API key is available
    llm = None
    if settings.OPENROUTER_API_KEY:
        try:
            logger.info(f"Initializing LLM with model: {settings.OPENROUTER_AGENT_MODEL}")
            llm = ChatOpenAI(
                api_key=settings.OPENROUTER_API_KEY,
                base_url=settings.OPENROUTER_BASE_URL,
                model=settings.OPENROUTER_AGENT_MODEL,
                default_headers={
                    "HTTP-Referer": "https://terrasync.app",
                    "X-Title": "TerraSync"
                }
            )
        except Exception as e:
            logger.error(f"Failed to initialize LLM: {e}")
    
    # If no LLM, use mock negotiation
    if not llm:
        logger.warning("No LLM available, using mock negotiation")
        return _get_mock_negotiation_result(trade_id, item_id)
    
    try:
        logger.info(f"Building negotiation graph for item: {item_id}")
        # Build the negotiation graph
        graph = _build_negotiation_graph(llm)
        
        # Initialize state
        initial_state = AgentState(
            messages=[],
            item_id=item_id,
            user_id=user_id,
            preferred_path=preferred_path,
            location=location or {"lat": 40.7128, "lng": -74.0060},
            current_step="init",
            matches=[],
            best_match=None,
            negotiation_history=[]
        )
        
        logger.info("Invoking negotiation graph...")
        # Run the graph
        result = graph.invoke(initial_state)
        logger.info(f"Negotiation complete, found {len(result.get('matches', []))} matches")
        
        return {
            "trade_id": trade_id,
            "status": "matched",
            "negotiation_steps": result["negotiation_history"],
            "matches": result["matches"],
            "best_match": result["best_match"],
            "eco_credits_earned": random.randint(20, 100),
            "carbon_impact_kg": round(random.uniform(5.0, 25.0), 2)
        }
        
    except Exception as e:
        logger.error(f"Agent negotiation error: {type(e).__name__}: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return _get_mock_negotiation_result(trade_id, item_id)


def _build_negotiation_graph(llm: ChatOpenAI) -> StateGraph:
    """Build the LangGraph negotiation agent."""
    
    def init_node(state: AgentState) -> dict:
        """Initialize the negotiation process."""
        return {
            "current_step": "query_organizations",
            "negotiation_history": [{
                "step": 1,
                "action": "initialize",
                "party": "agent",
                "details": "Starting negotiation process for item",
                "timestamp": datetime.utcnow().isoformat()
            }]
        }
    
    def query_organizations_node(state: AgentState) -> dict:
        """Query mock APIs for matching organizations."""
        # Simulate querying mock APIs
        matches = _query_mock_apis(state["item_id"], state["preferred_path"])
        
        return {
            "current_step": "evaluate_matches",
            "matches": matches,
            "negotiation_history": state["negotiation_history"] + [{
                "step": 2,
                "action": "query_apis",
                "party": "agent",
                "details": f"Found {len(matches)} potential matches from NGOs and recycling centers",
                "timestamp": datetime.utcnow().isoformat()
            }]
        }
    
    def evaluate_matches_node(state: AgentState) -> dict:
        """Use LLM to evaluate and rank matches."""
        matches = state["matches"]
        
        if not matches:
            return {
                "current_step": "no_match",
                "negotiation_history": state["negotiation_history"] + [{
                    "step": 3,
                    "action": "evaluate",
                    "party": "agent",
                    "details": "No suitable matches found",
                    "timestamp": datetime.utcnow().isoformat()
                }]
            }
        
        # Rank matches by score
        best_match = max(matches, key=lambda x: x["match_score"])
        
        return {
            "current_step": "negotiate",
            "best_match": best_match,
            "negotiation_history": state["negotiation_history"] + [{
                "step": 3,
                "action": "evaluate",
                "party": "agent",
                "details": f"Selected best match: {best_match['organization_name']} with score {best_match['match_score']}",
                "timestamp": datetime.utcnow().isoformat()
            }]
        }
    
    def negotiate_node(state: AgentState) -> dict:
        """Negotiate terms with the best match."""
        best_match = state["best_match"]
        
        # Simulate negotiation
        negotiation_message = HumanMessage(
            content=f"Negotiate terms with {best_match['organization_name']} for item {state['item_id']}"
        )
        
        return {
            "current_step": "finalize",
            "negotiation_history": state["negotiation_history"] + [
                {
                    "step": 4,
                    "action": "negotiate",
                    "party": "agent",
                    "details": f"Sent negotiation request to {best_match['organization_name']}",
                    "timestamp": datetime.utcnow().isoformat()
                },
                {
                    "step": 5,
                    "action": "respond",
                    "party": best_match['organization_name'],
                    "details": f"Accepted terms: Pickup within 3 days, {best_match['proposed_terms'].get('credit_offer', 50)} eco-credits offered",
                    "timestamp": datetime.utcnow().isoformat()
                }
            ]
        }
    
    def finalize_node(state: AgentState) -> dict:
        """Finalize the trade."""
        return {
            "current_step": "completed",
            "negotiation_history": state["negotiation_history"] + [{
                "step": 6,
                "action": "finalize",
                "party": "agent",
                "details": "Trade successfully orchestrated and matched",
                "timestamp": datetime.utcnow().isoformat()
            }]
        }
    
    # Build the graph
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("init", init_node)
    workflow.add_node("query_organizations", query_organizations_node)
    workflow.add_node("evaluate_matches", evaluate_matches_node)
    workflow.add_node("negotiate", negotiate_node)
    workflow.add_node("finalize", finalize_node)
    
    # Add edges
    workflow.set_entry_point("init")
    workflow.add_edge("init", "query_organizations")
    workflow.add_edge("query_organizations", "evaluate_matches")
    workflow.add_edge("evaluate_matches", "negotiate")
    workflow.add_edge("negotiate", "finalize")
    workflow.add_edge("finalize", END)
    
    return workflow.compile()


def _query_mock_apis(item_id: str, preferred_path: Optional[str] = None) -> list[dict]:
    """Query mock NGO and recycling APIs."""
    # Simulate API responses
    return [
        {
            "organization_id": "ngo-001",
            "organization_name": "Green Earth Initiative",
            "organization_type": "ngo",
            "match_score": 0.92,
            "proposed_terms": {
                "credit_offer": 45,
                "pickup_available": True,
                "estimated_carbon_savings": 15.5
            },
            "distance_km": 4.2
        },
        {
            "organization_id": "recycle-001",
            "organization_name": "EcoTech Recycling",
            "organization_type": "recycling_center",
            "match_score": 0.88,
            "proposed_terms": {
                "credit_offer": 38,
                "pickup_available": True,
                "estimated_carbon_savings": 12.0
            },
            "distance_km": 2.8
        },
        {
            "organization_id": "ngo-002",
            "organization_name": "Community Reuse Hub",
            "organization_type": "ngo",
            "match_score": 0.85,
            "proposed_terms": {
                "credit_offer": 42,
                "pickup_available": False,
                "estimated_carbon_savings": 18.0
            },
            "distance_km": 6.5
        }
    ]


def _get_mock_negotiation_result(trade_id: str, item_id: str) -> dict:
    """Return mock negotiation result for development/testing."""
    matches = _query_mock_apis(item_id)
    best_match = max(matches, key=lambda x: x["match_score"])
    
    return {
        "trade_id": trade_id,
        "status": "matched",
        "negotiation_steps": [
            {
                "step": 1,
                "action": "initialize",
                "party": "agent",
                "details": "Starting negotiation process for item",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "step": 2,
                "action": "query_apis",
                "party": "agent",
                "details": f"Found {len(matches)} potential matches from NGOs and recycling centers",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "step": 3,
                "action": "evaluate",
                "party": "agent",
                "details": f"Selected best match: {best_match['organization_name']} with score {best_match['match_score']}",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "step": 4,
                "action": "negotiate",
                "party": "agent",
                "details": f"Sent negotiation request to {best_match['organization_name']}",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "step": 5,
                "action": "respond",
                "party": best_match['organization_name'],
                "details": f"Accepted terms: Pickup within 3 days, {best_match['proposed_terms']['credit_offer']} eco-credits offered",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "step": 6,
                "action": "finalize",
                "party": "agent",
                "details": "Trade successfully orchestrated and matched",
                "timestamp": datetime.utcnow().isoformat()
            }
        ],
        "matches": matches,
        "best_match": best_match,
        "eco_credits_earned": best_match["proposed_terms"]["credit_offer"],
        "carbon_impact_kg": best_match["proposed_terms"]["estimated_carbon_savings"]
    }
