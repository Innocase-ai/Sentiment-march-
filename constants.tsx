import { MarketAsset, MarketCategory, NewsItem, Recommendation } from './types.ts';

export const INITIAL_MARKETS: Record<MarketCategory, MarketAsset[]> = {
  indices: [
    { id: 'dax', name: 'DAX 40', symbol: 'DAX', icon: '🇩🇪', price: 18520.45, change: 0.68, rsi: 65, macd: '+42.3', category: 'indices' },
    { id: 'cac', name: 'CAC 40', symbol: 'CAC', icon: '🇫🇷', price: 7854.12, change: 0.45, rsi: 62, macd: '+38.1', category: 'indices' },
    { id: 'ftse', name: 'FTSE 100', symbol: 'FTSE', icon: '🇬🇧', price: 8124.88, change: 0.52, rsi: 58, macd: '+25.4', category: 'indices' },
    { id: 'sp500', name: 'S&P 500', symbol: 'SPX', icon: '🇺🇸', price: 5928.15, change: 1.12, rsi: 68, macd: '+58.2', category: 'indices' },
    { id: 'ndx', name: 'Nasdaq 100', symbol: 'NDX', icon: '🇺🇸', price: 20854.30, change: 1.35, rsi: 71, macd: '+72.1', category: 'indices' },
    { id: 'nikkei', name: 'Nikkei 225', symbol: 'NI225', icon: '🇯🇵', price: 33255.00, change: 0.28, rsi: 55, macd: '+18.5', category: 'indices' }
  ],
  forex: [
    { id: 'eurusd', name: 'EUR / USD', symbol: 'EURUSD', icon: '🇪🇺🇺🇸', price: 1.0522, change: -0.15, rsi: 48, macd: '-12.3', category: 'forex' },
    { id: 'gbpusd', name: 'GBP / USD', symbol: 'GBPUSD', icon: '🇬🇧🇺🇸', price: 1.2754, change: 0.25, rsi: 52, macd: '+8.7', category: 'forex' },
    { id: 'usdjpy', name: 'USD / JPY', symbol: 'USDJPY', icon: '🇺🇸🇯🇵', price: 149.52, change: 0.45, rsi: 61, macd: '+22.1', category: 'forex' },
    { id: 'eurgbp', name: 'EUR / GBP', symbol: 'EURGBP', icon: '🇪🇺🇬🇧', price: 0.8256, change: -0.32, rsi: 45, macd: '-15.8', category: 'forex' },
    { id: 'audusd', name: 'AUD / USD', symbol: 'AUDUSD', icon: '🇦🇺🇺🇸', price: 0.6582, change: 0.18, rsi: 54, macd: '+5.2', category: 'forex' },
    { id: 'usdcad', name: 'USD / CAD', symbol: 'USDCAD', icon: '🇺🇸🇨🇦', price: 1.3424, change: 0.28, rsi: 57, macd: '+14.6', category: 'forex' }
  ],
  crypto: [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿', price: 96854.20, change: 2.45, rsi: 72, macd: '+125.3', category: 'crypto' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', price: 3582.45, change: 1.85, rsi: 68, macd: '+84.2', category: 'crypto' },
    { id: 'sol', name: 'Solana', symbol: 'SOL', icon: '◎', price: 205.12, change: 3.12, rsi: 75, macd: '+62.1', category: 'crypto' },
    { id: 'ada', name: 'Cardano', symbol: 'ADA', icon: '₳', price: 0.9824, change: 1.45, rsi: 64, macd: '+38.5', category: 'crypto' },
    { id: 'xrp', name: 'XRP', symbol: 'XRP', icon: '✕', price: 2.1855, change: 0.95, rsi: 60, macd: '+28.3', category: 'crypto' },
    { id: 'dot', name: 'Polkadot', symbol: 'DOT', icon: '●', price: 8.2452, change: 2.15, rsi: 69, macd: '+52.7', category: 'crypto' }
  ],
  sectors: [
    { id: 'xlk', name: 'Tech (XLK)', symbol: 'XLK', icon: '💻', price: 214.52, change: 1.28, rsi: 72, macd: '+68.2', category: 'sectors' },
    { id: 'xlf', name: 'Finance (XLF)', symbol: 'XLF', icon: '💰', price: 42.36, change: 0.58, rsi: 59, macd: '+12.4', category: 'sectors' },
    { id: 'xle', name: 'Énergie (XLE)', symbol: 'XLE', icon: '⚡', price: 84.22, change: 0.72, rsi: 62, macd: '+18.9', category: 'sectors' },
    { id: 'xlv', name: 'Santé (XLV)', symbol: 'XLV', icon: '⚕️', price: 147.85, change: 0.32, rsi: 54, macd: '+8.5', category: 'sectors' },
    { id: 'xlc', name: 'Comms (XLC)', symbol: 'XLC', icon: '📡', price: 76.18, change: 0.45, rsi: 57, macd: '+14.2', category: 'sectors' },
    { id: 'xlre', name: 'Immobilier (XLRE)', symbol: 'XLRE', icon: '🏠', price: 58.94, change: -0.28, rsi: 47, macd: '-6.3', category: 'sectors' }
  ],
  commodities: [
    { id: 'gold', name: 'Or', symbol: 'GC', icon: '🟡', price: 2765.40, change: 0.85, rsi: 61, macd: '+35.2', category: 'commodities' },
    { id: 'oil', name: 'Pétrole WTI', symbol: 'CL', icon: '🛢️', price: 72.48, change: 1.15, rsi: 64, macd: '+22.8', category: 'commodities' },
    { id: 'brent', name: 'Pétrole Brent', symbol: 'BZ', icon: '🛢️', price: 76.84, change: 1.08, rsi: 63, macd: '+21.5', category: 'commodities' },
    { id: 'natgas', name: 'Gaz Naturel', symbol: 'NG', icon: '💨', price: 2.954, change: -2.15, rsi: 38, macd: '-48.3', category: 'commodities' },
    { id: 'copper', name: 'Cuivre', symbol: 'HG', icon: '🔴', price: 4.282, change: 0.95, rsi: 66, macd: '+42.1', category: 'commodities' },
    { id: 'silver', name: 'Argent', symbol: 'SI', icon: '⚪', price: 31.52, change: 0.42, rsi: 58, macd: '+16.7', category: 'commodities' }
  ],
  bonds: [
    { id: 'us10y', name: 'Taux US 10 ans', symbol: 'US10Y', icon: '📊', price: 4.252, change: 0.05, rsi: 52, macd: '+3.2', category: 'bonds' },
    { id: 'us2y', name: 'Taux US 2 ans', symbol: 'US2Y', icon: '📊', price: 4.384, change: 0.02, rsi: 51, macd: '+1.8', category: 'bonds' },
    { id: 'bund10y', name: 'Bund Allemand 10 ans', symbol: 'BUND10Y', icon: '📊', price: 2.185, change: -0.08, rsi: 48, macd: '-4.5', category: 'bonds' },
    { id: 'oat10y', name: 'OAT France 10 ans', symbol: 'OAT10Y', icon: '📊', price: 2.954, change: -0.06, rsi: 49, macd: '-3.2', category: 'bonds' },
    { id: 'gilt10y', name: 'Gilt UK 10 ans', symbol: 'GILT10Y', icon: '📊', price: 3.852, change: 0.01, rsi: 50, macd: '+0.5', category: 'bonds' },
    { id: 'eur_ig', name: 'Oblig. EUR IG', symbol: 'EU_IG', icon: '📊', price: 3.421, change: -0.04, rsi: 47, macd: '-2.1', category: 'bonds' }
  ]
};

export const INITIAL_NEWS: NewsItem[] = [
  { id: '1', time: '14:32', title: 'BCE : Les taux resteront stables au-delà de janvier 2025 avec le ralentissement de l\'inflation', source: 'Reuters', sentiment: 'neutral' },
  { id: '2', time: '13:15', title: 'Tarifs douaniers majeurs attendus début janvier de la part de la nouvelle administration', source: 'Bloomberg', sentiment: 'negative' },
  { id: '3', time: '11:42', title: 'Résultats de Nvidia : La demande massive pour les infrastructures IA se poursuit', source: 'CNBC', sentiment: 'positive' },
  { id: '4', time: '10:20', title: 'La Fed signale 2 à 3 baisses en 2025, moins que prévu initialement', source: 'WSJ', sentiment: 'neutral' },
  { id: '5', time: '09:15', title: 'Apple maintient ses prévisions malgré les risques sur la chaîne d\'approvisionnement régionale', source: 'Apple Inc', sentiment: 'positive' }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  { asset: 'S&P 500', action: 'BUY', confidence: 78, justification: 'RSI à 68 combiné à une divergence MACD positive. Support tenu fermement à 5880.' },
  { asset: 'Bitcoin', action: 'BUY', confidence: 75, justification: 'Accumulation institutionnelle visible sous 95k. Les indicateurs de momentum deviennent haussiers.' },
  { asset: 'EUR / USD', action: 'SELL', confidence: 72, justification: 'Divergence baissière sur l\'unité de temps H4. Persistance des vents contraires pour la zone euro.' },
  { asset: 'Or', action: 'HOLD', confidence: 65, justification: 'Évolution en range entre 2745-2785. En attente d\'une cassure du triangle descendant.' }
];