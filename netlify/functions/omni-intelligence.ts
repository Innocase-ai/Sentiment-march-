import { GoogleGenAI } from "@google/genai";

const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
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

export default async (req: Request) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { marketData, targetAsset } = await req.json();

        if (!marketData && !targetAsset) {
            return new Response("Missing marketData or targetAsset", { status: 400 });
        }

        const client = getGenAI();

        // MODE 1: TARGETED DEEP DIVE (Single Asset)
        if (targetAsset) {
            console.log(`Analyzing target: ${targetAsset.name}`);
            const response = await client.models.generateContent({
                model: "gemini-3.0-flash",
                contents: `
                ROLE: Tu es un Comité d'Investissement Algorithmique de pointe. Tu dois simuler une discussion entre 4 experts avant de rendre un verdict unique sur l'actif : ${targetAsset.name} (${targetAsset.symbol}).

                CONTEXTE DU MARCHÉ (DONNÉES TEMPS RÉEL):
                - PRIX: ${targetAsset.price}
                - VARIATION 24H: ${targetAsset.change}%
                - RSI (14): ${targetAsset.rsi}
                - MACD: ${targetAsset.macd}

                --- ÉTAPE 1 : LE SCOUT (DATA HUNTER) ---
                Objectif : Collecte de faits bruts. Pas d'opinion.
                Action : Recherche sur le web (Google Search) les 3 dernières news critiques, les rapports de résultats (Earnings), et le consensus des analystes (Zacks, Seeking Alpha).
                
                --- ÉTAPE 2 : L'ANALYSTE TECHNIQUE (CHARTIST) ---
                Objectif : Analyse froide des graphiques.
                Action : Interprète le RSI (Surachat > 70 / Survente < 30) et le MACD (Croisement haussier/baissier). Valide la tendance du prix.

                --- ÉTAPE 3 : LE RISK MANAGER (CONTRARIAN) ---
                Objectif : Tuer la thèse.
                Action : Trouve pourquoi "l'évidence" pourrait être fausse. Y a-t-il une divergence entre le prix et le RSI ? Une news macro (Fed, Géopolitique) qui invalide l'analyse technique ?

                --- ÉTAPE 4 : LE GÉRANT DE PORTEFEUILLE (DECISION MAKER) ---
                Objectif : Synthèse et Verdict.
                Action : Pèse les arguments des 3 experts précédents.
                - Si Technique Bullish MAIS Macro Bearish => HOLD/NEUTRE.
                - Si Technique Bullish ET Consensus Bullish => BUY/ACHAT (Confiance élevée).
                - Si Technique Bearish ET News Négatives => SELL/VENTE.

                OUTPUT FINAL (JSON STRICT):
                {
                    "recommendation": {
                        "asset": "${targetAsset.symbol}",
                        "action": "BUY/SELL/HOLD",
                        "confidence": 0-100, // Une confiance > 80% nécessite un alignement PARFAIT Technique + Macro.
                        "justification": "Synthèse narrative du processus de décision. Commence par 'Le comité a décidé...' Cite explicitement les facteurs clés (ex: 'Malgré un RSI en surachat, le consensus analystes reste fort...').",
                        "signals": ["Nom du Signal 1", "Nom du Signal 2"] // Ex: "RSI DIVERGENCE", "EARNINGS BEAT", "MACD CROSS"
                    }
                }
                `,
                config: {
                    tools: [{ googleSearch: {} }],
                    responseMimeType: "application/json"
                }
            });

            const rawText = response.text || '{}';
            const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(cleanText);
            return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
        }

        // MODE 2: GLOBAL SCAN (Legacy)
        const dataSummary = marketData.map((m: any) =>
            `${m.name} (${m.symbol}): Prix ${m.price}, Var ${m.change}%, RSI ${m.rsi}`
        ).join('\n');

        const response = await client.models.generateContent({
            model: "gemini-2.0-flash-exp",
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
        IMPORTANT: Pour le champ "asset", utilise EXCLUSIVEMENT le 'symbol' (ex: "DAX", "SPX") fourni dans les DONNÉES TECHNIQUES LOCALES pour garantir le mapping.
      - "news": Liste de 3 à 5 articles pertinents trouvés via Google Search.`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json"
            }
        });

        // Extract grounding before JSON parsing
        const groundingNews: any[] = [];
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

        const rawText = response.text || '{}';
        const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const intelligence = JSON.parse(cleanText);

        // Merge logic
        const combinedNews = [...(intelligence.news || []), ...groundingNews];
        // Simple deduplication
        const uniqueNews = Array.from(new Map(combinedNews.map(item => [item.uri, item])).values());
        // Limit to 5
        const finalNews = uniqueNews.map(n => ({ ...n, time: n.time || "LIVE" })).slice(0, 5);

        return new Response(JSON.stringify({ ...intelligence, news: finalNews }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Function Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};
