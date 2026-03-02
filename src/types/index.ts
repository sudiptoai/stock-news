// ─── News ────────────────────────────────────────────────────────────────────

export type NewsCategory =
  | 'general'
  | 'forex'
  | 'crypto'
  | 'merger'
  | 'geopolitical'
  | 'earnings';

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number; // unix timestamp
  category: NewsCategory;
  related?: string; // comma-separated ticker symbols
  sentiment?: 'positive' | 'negative' | 'neutral';
}

// ─── Stock ───────────────────────────────────────────────────────────────────

export interface StockQuote {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap?: number;
  volume?: number;
}

export interface StockSearchResult {
  symbol: string;
  description: string;
  type: string;
}

// ─── Recommendation ──────────────────────────────────────────────────────────

export type RecommendationRating =
  | 'strongBuy'
  | 'buy'
  | 'hold'
  | 'sell'
  | 'strongSell';

export interface StockRecommendation {
  symbol: string;
  name: string;
  rating: RecommendationRating;
  targetPrice?: number;
  currentPrice: number;
  analyst: string;
  reason: string;
  updatedAt: number;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
}

// ─── Watchlist ───────────────────────────────────────────────────────────────

export interface WatchlistItem {
  symbol: string;
  name: string;
  addedAt: number;
  alertPrice?: number;
  notes?: string;
}

// ─── Goals ───────────────────────────────────────────────────────────────────

export type GoalType = 'growth' | 'income' | 'preservation' | 'speculation';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface InvestmentGoal {
  id: string;
  title: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  deadline: number; // unix timestamp
  riskLevel: RiskLevel;
  sectors: string[];
  notes?: string;
  createdAt: number;
}

// ─── Filter ──────────────────────────────────────────────────────────────────

export interface NewsFilter {
  categories: NewsCategory[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  searchQuery: string;
}

export interface StockFilter {
  sector?: string;
  minChangePercent?: number;
  maxChangePercent?: number;
  searchQuery: string;
}
