
import { GoogleGenAI, Type } from "@google/genai";
import { MarketAsset, Recommendation, MarketSignal } from "./types.ts";
import * as Sentry from "@sentry/react";

// Fix: Use import.meta.env for Vite and provide fallback
const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.API_KEY) as string;
const genAI = new GoogleGenAI(apiKey);

const FINTWIT_HANDLES = [
  "@CramerTracker", "@litcapital", "@JonahLupton",
  "@alifarhat79", "@Baradez", "@Schuldensuehner", "@KobeissiLetter",
  "@NCheron_bourse", "@fuckthedip", "@investirpoursoi", "@tommydouziech",
  "@Loris_Dalleau", "@MHoubben", "@Investingcom", "@BarnabeBearBull",
  "@Quality_StocksA", "@BoursicoteSmall"
];

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

/**
 * Consolidates all intelligence gathering into a single call.
 */
export async function getOmniIntelligence(marketData: MarketAsset[]): Promise<UnifiedIntelligence> {
  const dataSummary = marketData.map(m =>
    `${m.name} (${m.symbol}): Prix ${m.price}, Var ${m.change}%, RSI ${m.rsi}`
  ).join('\n');

  try {
    // Fix: Correct model selection and tool definition
    const model = genAI.getGenerativeModel({
      model: "models/gemini-3-flash-preview", // Version demandée par l'utilisateur
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            signals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ['CORRELATION', 'MACRO', 'VOLATILITY'] },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
                },
                required: ['type', 'title', 'description', 'impact']
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  asset: { type: Type.STRING },
                  action: { type: Type.STRING, enum: ['BUY', 'SELL', 'HOLD'] },
                  confidence: { type: Type.NUMBER },
                  justification: { type: Type.STRING },
                  signals: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['asset', 'action', 'confidence', 'justification', 'signals']
              }
            }
          },
          required: ['summary', 'signals', 'recommendations']
        }
      },
      tools: [{ googleSearch: {} }] as any,
    });

    const prompt = `Tu es un analyste senior multi-expertises. Utilise Google Search pour scanner les dernières publications de ces experts FinTwit : ${FINTWIT_HANDLES.join(', ')}.
      
    Analyse ces données :
    ${dataSummary}

    Tâches :
    1. Synthèse globale (2 phrases) du sentiment Macro/Technique.
    2. 3 Signaux critiques (Type: MACRO, CORRELATION, VOLATILITY) avec description et impact.
    3. Recommandations de trading (BUY, SELL, HOLD) avec justification et tags de signaux courts (ex: "RSI_BULL", "CRAMER_SIGNAL").
    
    Retourne tout au format JSON strict.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const intelligence = JSON.parse(cleanText || '{}') as UnifiedIntelligence;

    // Extract news links from grounding metadata
    const news: MarketNews[] = [];
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const chunks = groundingMetadata?.groundingChunks || [];

    chunks.forEach((chunk: any) => {
      if (chunk.web) {
        try {
          news.push({
            title: chunk.web.title || "Flash Marché",
            uri: chunk.web.uri,
            source: new URL(chunk.web.uri).hostname.replace('www.', ''),
            time: "LIVE",
            sentiment: 'neutral'
          });
        } catch (e) {
          console.warn("Invalid news URL:", chunk.web.uri);
        }
      }
    });

    return { ...intelligence, news: news.slice(0, 5) };

  } catch (error: any) {
    console.error("OmniIntelligence Error:", error);
    Sentry.captureException(error);

    const isQuotaError = error?.message?.includes('429') || error?.status === 429 || JSON.stringify(error).includes('429');

    return {
      recommendations: [],
      summary: isQuotaError
        ? "Quota Google Search atteint. Passage en mode analyse technique locale."
        : "Erreur de connexion au moteur d'intelligence.",
      news: [],
      signals: [],
      quotaReached: isQuotaError
    };
  }
}

export async function generateNewsImage(title: string): Promise<string | undefined> {
  // Optimization: The previous model (flash-preview) does not support direct image generation.
  // Returning undefined immediately to save API quota and latency until a proper image model is integrated.
  return undefined;
}
