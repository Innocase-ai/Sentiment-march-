import React from 'react';
import { OHLCData } from '../types.ts';

interface CandlestickChartProps {
  data: OHLCData[];
  height?: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, height = 120 }) => {
  if (!data || data.length === 0) return null;

  const width = 300;
  const padding = 10;
  
  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const priceRange = maxPrice - minPrice;

  const getY = (price: number) => {
    return height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding);
  };

  const candleWidth = (width - 2 * padding) / data.length;

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-slate-900/40 p-1 border border-white/5">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <line x1="0" y1={getY(minPrice)} x2={width} y2={getY(minPrice)} stroke="currentColor" className="text-white/5" strokeDasharray="2,2" />
        <line x1="0" y1={getY(maxPrice)} x2={width} y2={getY(maxPrice)} stroke="currentColor" className="text-white/5" strokeDasharray="2,2" />
        
        {data.map((d, i) => {
          const isBullish = d.close >= d.open;
          const color = isBullish ? '#10b981' : '#ef4444';
          const x = padding + i * candleWidth + candleWidth / 2;
          
          const highY = getY(d.high);
          const lowY = getY(d.low);
          const openY = getY(d.open);
          const closeY = getY(d.close);
          
          const rectHeight = Math.max(Math.abs(openY - closeY), 1);
          const rectY = Math.min(openY, closeY);

          return (
            <g key={i}>
              <line 
                x1={x} y1={highY} x2={x} y2={lowY} 
                stroke={color} strokeWidth="1" 
                className="opacity-60"
              />
              <rect 
                x={x - candleWidth * 0.3} 
                y={rectY} 
                width={candleWidth * 0.6} 
                height={rectHeight} 
                fill={color}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CandlestickChart;