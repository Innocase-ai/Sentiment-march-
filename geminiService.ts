import { MarketAsset, Recommendation, MarketSignal } from "./types.ts";

export interface MarketNews {
  title: string;
  uri: string;
  source: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  imageUrl?: string;
}

export interface UnifiedIntelligence {
  recommendations: Recommendation[];
  summary: string;
  news: MarketNews[];
  signals: MarketSignal[];
  quotaReached?: boolean;
}

// Response type for single asset intelligence
interface SingleAssetIntelligence {
  recommendation: Recommendation;
}

/**
 * Calls the Netlify Function to get intelligence.
 * The API Key is now securely stored on the server side.
 */
export async function getOmniIntelligence(marketData: MarketAsset[]): Promise<UnifiedIntelligence> {
  try {
    const response = await fetch('/.netlify/functions/omni-intelligence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ marketData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server Error: ${response.status}`);
    }

    const intelligence = await response.json();
    return intelligence;

  } catch (error: any) {
    console.error("OmniIntelligence Error:", error);

    return {
      recommendations: [],
      summary: "Erreur de connexion au service d'intelligence (Backend).",
      news: [],
      signals: [],
      quotaReached: false
    };
  }
}

export async function generateNewsImage(title: string): Promise<string | undefined> {
  // TODO: Move image generation to a secure backend function as well.
  // Currently disabled to prevent API Key leakage.
  console.warn("Image generation disabled pending backend migration.");
  return undefined;
}

/**
 * Requests a specific deep dive analysis for a single asset.
 */
export async function getAssetIntelligence(asset: MarketAsset): Promise<Recommendation | null> {
  try {
    const response = await fetch('/.netlify/functions/omni-intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetAsset: asset }),
    });

    if (!response.ok) throw new Error("Backend Error");

    const data: SingleAssetIntelligence = await response.json();
    return data.recommendation;
  } catch (error) {
    console.error("Asset Intelligence Error:", error);
    return null;
  }
}
