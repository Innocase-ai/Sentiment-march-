/// <reference types="vite/client" />

import { GoogleGenAI, Type } from "@google/genai";
import { MarketAsset, Recommendation, MarketSignal } from "./types.ts";

const getGenAI = () => {
  const apiKey = localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }
  return new GoogleGenAI({ apiKey });
};

const FINTWIT_HANDLES = [
  // FR
  "@NCheron_bourse", "@fuckthedip", "@investirpoursoi", "@tommydouziech",
  "@Loris_Dalleau", "@MHoubben", "@Baradez", "@BoursicoteSmall", "@DuconGoretti",
  // EN
  "@CramerTracker", "@litcapital", "@JonahLupton", "@alifarhat79",
  "@Schuldensuehner", "@KobeissiLetter", "@Investingcom", "@bespokeinvest",
  "@saxena_puru", "@LizAnnSonders", "@michaelbatnick",
  // CRYPTO
  "@rektcapital", "@cz_binance", "@CryptoJack"
];

const TRUSTED_SOURCES = [
  "seekingalpha.com", "zacks.com", "morningstar.com",
  "zonebourse.com", "boursorama.com", "investing.com"
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
 * Consolidates all intelligence gathering into a single call to save Google Search grounding quota.
 * 1 call every 15 mins = 96 calls/day (Under the 100/day limit).
 */
export async function getOmniIntelligence(marketData: MarketAsset[]): Promise<UnifiedIntelligence> {
  const dataSummary = marketData.map(m =>
    `${m.name} (${m.symbol}): Prix ${m.price}, Var ${m.change}%, RSI ${m.rsi}`
  ).join('\n');

  try {
    const response = await getGenAI().models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
      ROLE: Tu es le Lead Quantitative Strategist d'un Hedge Fund Tier-1. Ton expertise réside dans l'analyse cross-asset et la détection d'alpha par convergence/divergence entre "HARD DATA" (Consensus/Quant) et "SOFT DATA" (Sentiment Social).
      
      OBJECTIF: Scanner le flux FinTwit (Sentiment) ET les sources de données fiables (Consensus/Quant) pour produire une note d'intelligence de marché exploitable.

      DONNÉES TECHNIQUES LOCALES (HARD DATA 1):
      ${dataSummary}

      SOURCES À SCANNER VIA GOOGLE SEARCH (Utilise ces sites pour le Consensus/Quant):
      ${TRUSTED_SOURCES.join(', ')}. Cherche spécifiquement "Quant Rating", "Zacks Rank", "Fair Value", "Consensus Analystes" pour les actifs majeurs.

      SOURCES SENTIMENT SOCIAL (SOFT DATA):
      Recherche les dernières analyses pertinentes et récentes (moins de 24h) des comptes suivants pour capturer le "Narratif de Marché": ${FINTWIT_HANDLES.join(', ')}.

      LOGIQUE DE DÉCISION (RÈGLES D'ENGAGEMENT):
      - **BUY SIGNAL** = Sentiment X Haussier (Soft) ET (Quant Rating "Buy/Strong Buy" OU Consensus Analystes Positif) (Hard).
      - **SELL SIGNAL** = Sentiment X Baissier (Soft) OU (Quant Rating "Strong Sell" OU Zacks Rank 4/5).
      - **CAUTION/HOLD** = Divergence entre Sentiment (ex: Bullish) et Hard Data (ex: Bearish/Neutre). "Ne pas suivre le troupeau si les chiffres ne suivent pas".

      PROCESSUS DE PENSÉE (Chain of Thought - Interne):
      1.  **Macro & Sentiment Scan**: Quelle est la narration dominante sur FinTwit? (Risk-on/off).
      2.  **Hard Data Check**: Que disent Seeking Alpha, Zacks ou Zonebourse sur les actifs clés? Le consensus est-il aligné avec FinTwit?
      3.  **Alpha Hunting**: Applique les RÈGLES D'ENGAGEMENT ci-dessus. Identifie les convergences (High Confidence) et les divergences (Risk).

      OUTPUT ATTENDU (JSON STRICT):
      Produis un JSON valide respectant strictement le schéma fourni.
      - "summary": Synthèse percutante (style Bloomberg). Mentionne explicitement si "Hard Data" valide "Soft Data". Max 40 mots.
      - "signals": 3 Signaux Critiques. Types: 'MACRO' (Tendance), 'CORRELATION' (Convergence Hard/Soft), 'VOLATILITY' (Divergence/Choc).
      - "recommendations": Recommandations basées sur la LOGIQUE DE DÉCISION. Justification DOIT citer une source Hard (ex: "Quant Rating", "Zacks") ET le sentiment.
      - "news": Liste de 3 à 5 articles pertinents trouvés via Google Search.`,
      config: {
        tools: [{ googleSearch: {} }],
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
            },
            news: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  uri: { type: Type.STRING },
                  source: { type: Type.STRING },
                  sentiment: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] }
                },
                required: ['title', 'uri', 'source', 'sentiment']
              }
            }
          },
          required: ['summary', 'signals', 'recommendations', 'news']
        }
      }
    });

    // Sanitization: Remove Markdown code blocks if present to avoid JSON.parse errors
    const rawText = response.text || '{}';
    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    let intelligence: UnifiedIntelligence;
    try {
      intelligence = JSON.parse(cleanText) as UnifiedIntelligence;
    } catch (parseError) {
      console.error("CRITICAL: Failed to parse Gemini response. Raw text:", cleanText);
      throw new Error("JSON_PARSE_FAILED");
    }

    // Extract news links from grounding metadata
    const groundingNews: MarketNews[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    chunks.forEach((chunk: any) => {
      if (chunk.web) {
        groundingNews.push({
          title: chunk.web.title || "Flash Marché",
          uri: chunk.web.uri,
          source: new URL(chunk.web.uri).hostname.replace('www.', ''),
          time: "LIVE",
          sentiment: 'neutral'
        });
      }
    });

    // Merge LLM JSON news with Grounding news (deduplicate by URI)
    const combinedNews = [...(intelligence.news || []), ...groundingNews];
    // Simple deduplication based on URI or Title
    const uniqueNews = Array.from(new Map(combinedNews.map(item => [item.uri, item])).values());

    // Add default time 'LIVE' if missing
    const finalNews = uniqueNews.map(n => ({ ...n, time: n.time || "LIVE" }));

    return { ...intelligence, news: finalNews.slice(0, 5) };

  } catch (error: any) {
    console.error("OmniIntelligence Error:", error);

    // Check for 429 specifically
    const isQuotaError = error?.message?.includes('429') || error?.status === 429 || JSON.stringify(error).includes('429');

    // Explicitly re-throw if it's our own missing key error
    if (error.message === 'API_KEY_MISSING') {
      throw error;
    }

    // Check for invalid API Key (400 with specific message or 403) from Google
    const isKeyError = error?.message?.includes('API key not valid') || error?.status === 400 && error?.message?.includes('key');

    if (isKeyError) {
      throw new Error('API_KEY_MISSING');
    }

    return {
      recommendations: [],
      summary: isQuotaError
        ? "Quota Google Search atteint pour aujourd'hui. Passage en mode analyse technique locale."
        : "Erreur de connexion au moteur d'intelligence.",
      news: [],
      signals: [],
      quotaReached: isQuotaError
    };
  }
}

export async function generateNewsImage(title: string): Promise<string | undefined> {
  try {
    const response = await getGenAI().models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Professional financial news visual: ${title}` }] },
    });
    const part = response.candidates[0].content.parts.find(p => p.inlineData);
    return part ? `data:image/png;base64,${part.inlineData.data}` : undefined;
  } catch (error: any) {
    if (error.message === 'API_KEY_MISSING') throw error;
    if (error?.message?.includes('API key not valid')) throw new Error('API_KEY_MISSING');
    return undefined;
  }
}
