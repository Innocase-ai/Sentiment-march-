
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MarketAsset, MarketCategory, Recommendation, MarketSentiment, MarketSignal } from './types.ts';
import { INITIAL_MARKETS, INITIAL_RECOMMENDATIONS } from './constants.tsx';
import AssetCard from './components/AssetCard.tsx';
import RecommendationCard from './components/RecommendationCard.tsx';
import NewsCard from './components/NewsCard.tsx';
import { getOmniIntelligence, generateNewsImage, MarketNews } from './geminiService.ts';
import AIAnalysisVisual from './components/AIAnalysisVisual.tsx';
import { AboutModal } from './components/AboutModal';
import DeepDiveModal from './components/DeepDiveModal.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MarketCategory>('indices');
  const [markets, setMarkets] = useState<Record<MarketCategory, MarketAsset[]>>(INITIAL_MARKETS);
  const [liveNews, setLiveNews] = useState<MarketNews[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [marketSignals, setMarketSignals] = useState<MarketSignal[]>([]);
  const [globalSummary, setGlobalSummary] = useState<string>("Prêt pour le scan FinTwit...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isQuotaReached, setIsQuotaReached] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tickInterval = setInterval(() => {
      setMarkets(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(cat => {
          next[cat as MarketCategory] = next[cat as MarketCategory].map(asset => {
            const variationPercent = (Math.random() - 0.5) * 0.0005;
            const newPrice = asset.price * (1 + variationPercent);
            const newChange = asset.change + (variationPercent * 100);
            return { ...asset, price: newPrice, change: newChange };
          });
        });
        return next;
      });
    }, 900000); // 15 mins
    return () => clearInterval(tickInterval);
  }, []);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const flattened = Object.values(markets).flat() as MarketAsset[];
      const intelligence = await getOmniIntelligence(flattened);

      if (intelligence.quotaReached) {
        setIsQuotaReached(true);
      } else {
        setIsQuotaReached(false);
      }

      if (intelligence.recommendations.length > 0) setRecommendations(intelligence.recommendations);
      if (intelligence.summary) setGlobalSummary(intelligence.summary);
      if (intelligence.signals.length > 0) setMarketSignals(intelligence.signals);

      if (intelligence.news && intelligence.news.length > 0) {
        // Optimistic update without images first
        setLiveNews(intelligence.news);

        // Generate images in parallel to avoid multiple re-renders and race conditions
        const newsToImage = intelligence.news.slice(0, 2);
        const imagePromises = newsToImage.map(item => generateNewsImage(item.title));

        const images = await Promise.all(imagePromises);

        setLiveNews(current => {
          const updated = [...current];
          images.forEach((img, index) => {
            if (img && updated[index]) {
              updated[index] = { ...updated[index], imageUrl: img };
            }
          });
          return updated;
        });
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [markets]);



  useEffect(() => {
    // IMPLICIT TRIGGER: 'runAnalysis' depends on 'markets'.
    // 'markets' is updated every 15 mins by the interval above.
    // Therefore, this effect re-runs every 15 mins, triggering the AI analysis.
    runAnalysis();
  }, [runAnalysis]);

  const sentimentData: MarketSentiment = useMemo(() => {
    const allAssets = Object.values(markets).flat() as MarketAsset[];
    const bullAssets = allAssets.filter(a => a.change > 0).length;
    const priceBullish = (bullAssets / allAssets.length) * 100;

    let newsBullish = 50;
    if (liveNews.length > 0) {
      const positiveNews = liveNews.filter(n => n.sentiment === 'positive').length;
      const totalNews = liveNews.length;
      newsBullish = ((positiveNews + totalNews / 2) / (totalNews)) * 100;
    }

    const finalBullish = Math.round((priceBullish * 0.4) + (newsBullish * 0.6));
    const finalBearish = 100 - finalBullish;

    return { bullish: finalBullish, neutral: 0, bearish: finalBearish };
  }, [markets, liveNews]);

  const getAssetRecommendation = (asset: MarketAsset) => {
    return recommendations.find(r => {
      const recAsset = r.asset?.toLowerCase().trim();
      if (!recAsset) return false;
      return recAsset === asset.symbol?.toLowerCase().trim() ||
        recAsset === asset.name?.toLowerCase().trim() ||
        recAsset === asset.id?.toLowerCase().trim();
    });
  };

  return (
    <div className="min-h-screen font-sans bg-[#0f172a] text-slate-100 selection:bg-blue-500/30">
      {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}
      {selectedAsset && (
        <DeepDiveModal
          asset={selectedAsset}
          recommendation={getAssetRecommendation(selectedAsset)}
          isAnalyzing={isAnalyzing}
          onClose={() => setSelectedAsset(null)}
          onUpdateRecommendation={(newRec) => {
            setRecommendations(prev => {
              // Remove old if exists
              const filtered = prev.filter(r => r.asset !== newRec.asset);
              return [...filtered, newRec];
            });
          }}
        />
      )}
      {isAnalyzing && <AIAnalysisVisual />}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 rotate-3">
            <span className="text-xl">🌌</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent uppercase">OmniTrade Pulse</h1>
            <div className="text-[10px] text-blue-400 font-bold tracking-widest uppercase flex items-center gap-2">
              <span className={`w-1 h-1 rounded-full ${isQuotaReached ? 'bg-orange-500' : 'bg-blue-500 animate-ping'}`}></span>
              {isQuotaReached ? 'Mode Économie de Quota' : 'Moteur Alpha Actif'} • Gemini 3 Pro
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isQuotaReached && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[8px] font-black text-orange-400 uppercase tracking-widest">Quota Search Épuisé</span>
              <span className="text-[7px] text-slate-500 uppercase">Récupération demain</span>
            </div>
          )}
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 font-mono text-[10px] flex items-center gap-2">
            <span className="text-slate-500">LIVE:</span>
            {currentTime.toLocaleTimeString('fr-FR')}
          </div>
          <button
            onClick={() => setShowAboutModal(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors hover:bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-700 uppercase tracking-wide"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Architecture IA
          </button>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className={`relative px-5 py-2 rounded-xl font-black transition-all text-[10px] overflow-hidden shadow-lg uppercase tracking-widest ${isAnalyzing ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'}`}
          >
            {isAnalyzing && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
            {isAnalyzing ? 'Analyse...' : 'Mettre à jour'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-10">
        {isQuotaReached && (
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">⚡</span>
              <p className="text-[10px] font-bold text-orange-200 uppercase tracking-tight">Le quota de recherche en direct a été atteint. Les données affichées sont basées sur le dernier scan réussi.</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-[9px] font-black text-slate-500 uppercase px-2 py-1 bg-slate-900/50 rounded border border-slate-800">Experts: @NCheron_bourse</span>
          <span className="text-[9px] font-black text-slate-500 uppercase px-2 py-1 bg-slate-900/50 rounded border border-slate-800">Macro: @alifarhat79</span>
          <span className="text-[9px] font-black text-slate-500 uppercase px-2 py-1 bg-slate-900/50 rounded border border-slate-800">Data: @JonahLupton</span>
          <span className="text-[9px] font-black text-slate-500 uppercase px-2 py-1 bg-slate-900/50 rounded border border-slate-800">Inverse Cramer: Enabled</span>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketSignals.length > 0 ? marketSignals.map((signal, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border bg-slate-900/60 backdrop-blur-sm relative overflow-hidden group hover:bg-slate-800/60 transition-all ${signal.impact === 'high' ? 'border-rose-500/30' : 'border-blue-500/30'}`}>
              <div className={`absolute top-0 right-0 p-2 text-[8px] font-black uppercase tracking-widest ${signal.impact === 'high' ? 'text-rose-400' : 'text-blue-400'}`}>{signal.type}</div>
              <h5 className="text-sm font-black mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{signal.title}</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">"{signal.description}"</p>
            </div>
          )) : (
            Array(3).fill(0).map((_, i) => <div key={i} className="h-28 bg-slate-800/20 rounded-2xl animate-pulse border border-slate-800"></div>)
          )}
        </section>

        <nav className="flex gap-1 overflow-x-auto no-scrollbar bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50 shadow-inner">
          {(['indices', 'forex', 'crypto', 'sectors', 'commodities', 'bonds'] as MarketCategory[]).map(cat => {
            const labels: Record<string, string> = {
              indices: 'INDICES',
              forex: 'FOREX',
              crypto: 'CRYPTO',
              sectors: 'SECTEURS',
              commodities: 'MATIÈRES PREMIÈRES',
              bonds: 'OBLIGATIONS'
            };
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm font-black transition-all tracking-tight ${activeTab === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                {labels[cat]}
              </button>
            );
          })}
        </nav>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {markets[activeTab].map(asset => (
            <AssetCard
              key={asset.id}
              asset={asset}
              recommendation={getAssetRecommendation(asset)}
              onClick={() => setSelectedAsset(asset)}
            />
          ))}
        </div>

        <section className="bg-gradient-to-br from-[#1e293b]/50 to-[#0f172a] rounded-[2.5rem] border border-slate-800 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
          <div className="relative z-10 flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3 space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-400 tracking-[0.2em] uppercase">
                  Intelligence Collective FinTwit
                </div>
                <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">Social Alpha & Macro Strategist</h2>
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-inner relative group">
                  <span className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-[10px] font-black rounded-lg shadow-lg">CONSENSUS IA</span>
                  <p className="text-blue-50 text-xl leading-relaxed italic font-medium opacity-90">"{globalSummary}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {recommendations.slice(0, 4).map((rec, idx) => (
                  <RecommendationCard key={idx} rec={rec} featured={idx === 0} />
                ))}
              </div>
            </div>

            <div className="lg:w-1/3 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black flex items-center gap-2 text-white uppercase tracking-wider"><span className="text-blue-500 text-2xl font-black">/</span> LIVE LINKS</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[800px] overflow-y-auto no-scrollbar pr-1">
                {liveNews.length > 0 ? liveNews.map((news, i) => (
                  <NewsCard key={i} news={news} isFeatured={i === 0} />
                )) : <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 border-dashed animate-pulse"><div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div><div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">En attente de données...</div></div>}
              </div>
            </div>
          </div>
        </section>

        <footer className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-10 border-t border-slate-800 pt-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Social Sentiment Index</h4>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{sentimentData.bullish}% BULLISH</span>
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{sentimentData.bearish}% BEARISH</span>
              </div>
            </div>

            <div className="relative h-14 w-full bg-slate-900/50 rounded-2xl border border-slate-800 p-2 flex gap-1 group shadow-inner overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-xl transition-all duration-[1500ms] ease-out relative" style={{ width: `${sentimentData.bullish}%` }}></div>
              <div className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-xl transition-all duration-[1500ms] ease-out relative" style={{ width: `${sentimentData.bearish}%` }}></div>
            </div>
          </div>

          <div className="text-right flex flex-col justify-end space-y-4">
            <div className="flex justify-end items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut d'Intelligence Globale</span>
                <span className={`text-[10px] font-bold underline uppercase ${isQuotaReached ? 'text-orange-400' : 'text-blue-400'}`}>
                  {isQuotaReached ? 'Quota Limité (Search Désactivé)' : 'Optimisé (1 call/15min)'}
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-2xl">⚡</div>
            </div>
            <div className="text-[9px] text-slate-600 max-w-sm ml-auto leading-relaxed uppercase tracking-tighter italic">OMNITRADE PULSE : Analyse probabiliste basée sur le sentiment social et macro-économique.</div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
