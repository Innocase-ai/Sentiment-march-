import React, { useMemo, useEffect, useState, useRef } from 'react';
import { MarketAsset, OHLCData, Recommendation } from '../types.ts';
import CandlestickChart from './CandlestickChart.tsx';

interface AssetCardProps {
  asset: MarketAsset;
  recommendation?: Recommendation;
  onClick?: () => void;
}

type TimeFrame = '1J' | '1S' | '1M';

const AssetCard: React.FC<AssetCardProps> = ({ asset, recommendation, onClick }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1J');
  const [history, setHistory] = useState<OHLCData[]>([]);
  const isPositive = asset.change >= 0;
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevPriceRef = useRef(asset.price);

  const isInverseCramerActive = useMemo(() => {
    return recommendation?.justification.toLowerCase().includes('cramer') || (asset.rsi > 75 && asset.change > 2);
  }, [recommendation, asset]);

  const trendStrength = useMemo(() => {
    let score = 50;
    if (asset.change > 1) score += 20;
    if (asset.change < -1) score -= 20;
    if (asset.rsi > 60) score += 15;
    if (asset.rsi < 40) score -= 15;
    if (asset.macd.startsWith('+')) score += 10;
    if (recommendation?.action === 'BUY') score += 20;
    if (recommendation?.action === 'SELL') score -= 20;
    return Math.min(Math.max(score, 5), 95);
  }, [asset, recommendation]);

  const marketPhase = useMemo(() => {
    if (asset.rsi > 70) return "SURACHAT";
    if (asset.rsi < 30) return "SURVENTE";
    if (Math.abs(asset.change) < 0.1) return "CONSOLIDATION";
    return asset.change > 0 ? "EXPANSION" : "CORRECTION";
  }, [asset]);

  const getTechnicalSentiment = () => {
    if (recommendation) {
      return recommendation.action === 'BUY' ? 'bullish' : recommendation.action === 'SELL' ? 'bearish' : 'neutral';
    }
    return trendStrength > 60 ? 'bullish' : trendStrength < 40 ? 'bearish' : 'neutral';
  };

  const sentiment = getTechnicalSentiment();
  const style = {
    bullish: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: recommendation ? 'IA: ACHAT' : 'BULLISH' },
    bearish: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', label: recommendation ? 'IA: VENTE' : 'BEARISH' },
    neutral: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', label: 'NEUTRE' }
  }[sentiment];

  useEffect(() => {
    const generateHistory = (price: number, frame: TimeFrame): OHLCData[] => {
      const points = frame === '1J' ? 24 : frame === '1S' ? 20 : 30;
      const volatility = price * 0.01;
      let current = price;
      const data: OHLCData[] = [];
      for (let i = 0; i < points; i++) {
        const open = current;
        const change = (Math.random() - 0.5) * volatility;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
        const low = Math.min(open, close) - Math.random() * (volatility * 0.5);
        data.unshift({ timestamp: Date.now() - i * 3600000, open, high, low, close });
        current = open - change;
      }
      return data;
    };
    setHistory(generateHistory(asset.price, timeFrame));
  }, [timeFrame, asset.id, asset.price]);

  useEffect(() => {
    if (asset.price > prevPriceRef.current) {
      setFlash('up');
      setTimeout(() => setFlash(null), 800);
    } else if (asset.price < prevPriceRef.current) {
      setFlash('down');
      setTimeout(() => setFlash(null), 800);
    }
    prevPriceRef.current = asset.price;
  }, [asset.price]);

  return (
    <div className="bg-[#1a2332] border border-[#334155] rounded-2xl p-4 transition-all duration-500 hover:border-blue-500/50 hover:bg-[#1e293b] group relative overflow-hidden shadow-xl flex flex-col h-full">
      <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${flash === 'up' ? 'bg-emerald-500/5 opacity-100' : flash === 'down' ? 'bg-rose-500/5 opacity-100' : 'opacity-0'}`} />

      {isInverseCramerActive && (
        <div className="absolute top-0 left-0 right-0 bg-rose-600/20 border-b border-rose-500/30 py-0.5 px-3 flex items-center justify-between z-20">
          <span className="text-[7px] font-black text-rose-400 tracking-[0.2em] uppercase animate-pulse">⚠️ ALERTE INVERSE CRAMER</span>
          <span className="text-[7px] font-bold text-rose-300 opacity-70">SIGNAL CONTRARIEN</span>
        </div>
      )}

      <div className={`flex justify-between items-start ${isInverseCramerActive ? 'mt-4' : 'mb-4'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-xl border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
            {asset.icon}
          </div>
          <div>
            <h4 className="text-sm font-black text-white tracking-tight">{asset.name}</h4>
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{asset.symbol}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
           <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border} tracking-widest transition-all group-hover:scale-105 shadow-sm`}>
              {style.label}
           </span>
           <div className="text-[8px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">{marketPhase}</div>
        </div>
      </div>
      
      <div className="flex justify-between items-end mb-3">
        <div>
          <div className={`text-2xl font-black font-mono tracking-tighter transition-colors duration-300 ${flash === 'up' ? 'text-emerald-400' : flash === 'down' ? 'text-rose-400' : 'text-slate-100'}`}>
            {asset.price.toLocaleString('fr-FR', { minimumFractionDigits: asset.price < 10 ? 4 : 2, maximumFractionDigits: asset.price < 10 ? 4 : 2 })}
          </div>
          <div className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isPositive ? '↗' : '↘'} {Math.abs(asset.change).toFixed(2)}%
          </div>
        </div>
        <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
          {(['1J', '1S', '1M'] as TimeFrame[]).map(f => (
            <button key={f} onClick={(e) => { e.stopPropagation(); setTimeFrame(f); }} className={`text-[9px] font-black px-1.5 py-0.5 rounded transition-all ${timeFrame === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <CandlestickChart data={history} height={90} />
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Signaux de Marché IA</span>
          <span className="text-[8px] font-bold text-blue-500/60 uppercase">Real-time Alpha</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {recommendation?.signals && recommendation.signals.length > 0 ? (
            recommendation.signals.map((sig, idx) => (
              <span key={idx} className="bg-blue-500/5 border border-blue-500/20 text-blue-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter hover:bg-blue-500/10 transition-colors">
                ⚡ {sig}
              </span>
            ))
          ) : (
            <>
              <span className="bg-slate-800 text-slate-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase opacity-50">Trend Check</span>
              <span className="bg-slate-800 text-slate-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase opacity-50">Volume Scan</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3 mt-auto">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">FinTwit Alpha Score</span>
            <span className={`text-[10px] font-black ${trendStrength > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>{trendStrength}%</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${trendStrength > 50 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} style={{ width: `${trendStrength}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">RSI (14)</span>
            <span className={`text-[11px] font-mono font-bold ${asset.rsi > 70 ? 'text-rose-400' : asset.rsi < 30 ? 'text-emerald-400' : 'text-slate-300'}`}>{asset.rsi.toFixed(1)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-right">MACD Trend</span>
            <span className={`text-[11px] font-mono font-bold ${asset.macd.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{asset.macd}</span>
          </div>
        </div>
      </div>
      
      {recommendation && (
        <div className="mt-3 p-2 bg-blue-500/5 rounded-lg border border-blue-500/10 group-hover:bg-blue-500/10 transition-colors">
          <div className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1">
             <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></span> Social Context IA
          </div>
          <p className="text-[9px] text-slate-400 leading-tight italic line-clamp-2">"{recommendation.justification}"</p>
        </div>
      )}
    </div>
  );
};

export default AssetCard;