
export interface OHLCData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  price: number;
  change: number;
  rsi: number;
  macd: string;
  category: MarketCategory;
  trendStrength?: number; // 0-100
  marketPhase?: string; // e.g., "Accumulation", "Expansion"
}

export type MarketCategory = 'indices' | 'forex' | 'crypto' | 'sectors' | 'commodities' | 'bonds';

export interface MarketSignal {
  type: 'CORRELATION' | 'MACRO' | 'VOLATILITY';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface Recommendation {
  asset: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  justification: string;
  signals?: string[]; // Liste de tags courts (ex: ["MOMENTUM", "BULLISH_CROSS"])
}

export interface MarketSentiment {
  bullish: number;
  neutral: number;
  bearish: number;
}

export interface NewsItem {
  id: string;
  time: string;
  title: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}
