const API_BASE_URL = 'https://terrasync.up.railway.app';

console.log('API Base URL:', API_BASE_URL);

export interface AnalysisResult {
  item_id: string;
  category: string;
  subcategory: string;
  description: string;
  condition: string;
  circular_value: {
    monetary_value: number;
    eco_credits: number;
    carbon_savings_kg: number;
    confidence_score: number;
  };
  recommended_paths: string[];
  matching_organizations: Array<{
    id: string;
    name: string;
    type: string;
    match_score: number;
    distance_km: number;
  }>;
  environmental_impact: {
    co2_saved_kg: number;
    waste_diverted_kg: number;
    water_saved_liters: number;
    energy_saved_kwh: number;
  };
}

export interface TradeResult {
  trade_id: string;
  status: string;
  negotiation_steps: Array<{
    step: number;
    action: string;
    party: string;
    details: string;
    timestamp: string;
  }>;
  matches: Array<{
    organization_id: string;
    organization_name: string;
    organization_type: string;
    match_score: number;
    proposed_terms: {
      credit_offer: number;
      pickup_available: boolean;
      estimated_carbon_savings: number;
    };
    distance_km: number;
  }>;
  best_match: {
    organization_id: string;
    organization_name: string;
    organization_type: string;
    match_score: number;
    proposed_terms: {
      credit_offer: number;
      pickup_available: boolean;
      estimated_carbon_savings: number;
    };
    distance_km: number;
  } | null;
  eco_credits_earned: number;
  carbon_impact_kg: number;
}

export interface ImpactStats {
  co2_sequestered_tons: number;
  waste_diverted_kg: number;
  eco_credits_earned: number;
  recovery_rate_percent: number;
  items_processed: number;
  active_users: number;
}

export async function analyzeItem(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);

  const url = `${API_BASE_URL}/api/analyze-item`.replace(/\/+/g, '/');
  console.log('=== API DEBUG ===');
  console.log('API Base URL:', API_BASE_URL);
  console.log('Full URL:', url);
  console.log('File:', file.name, file.type, file.size);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('================');

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    
    if (!data.success) {
      throw new Error(data.error || 'Analysis failed');
    }

    console.log('Analysis result:', data.analysis);
    return data.analysis;
  } catch (error: any) {
    console.error('API call failed:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    throw error;
  }
}

export async function orchestrateTrade(
  itemId: string,
  userId: string,
  preferredPath?: string,
  location?: { lat: number; lng: number }
): Promise<TradeResult> {
  const response = await fetch(`${API_BASE_URL}/api/orchestrate-trade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      item_id: itemId,
      user_id: userId,
      preferred_path: preferredPath,
      location,
    }),
  });

  if (!response.ok) {
    throw new Error(`Trade orchestration failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Trade orchestration failed');
  }

  return data;
}

export async function getImpactStats(): Promise<ImpactStats> {
  const response = await fetch(`${API_BASE_URL}/api/impact-stats`);

  if (!response.ok) {
    throw new Error(`Failed to fetch impact stats: ${response.statusText}`);
  }

  return response.json();
}
