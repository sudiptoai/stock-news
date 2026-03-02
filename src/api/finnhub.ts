/**
 * Finnhub API client
 * Free tier: 60 API calls/minute
 * Docs: https://finnhub.io/docs/api
 *
 * Set EXPO_PUBLIC_FINNHUB_API_KEY in your .env file.
 * A sandbox demo key "sandbox_..." also works for testing.
 */

import axios from 'axios';
import {
  NewsArticle,
  NewsCategory,
  StockQuote,
  StockRecommendation,
  StockSearchResult,
} from '../types';

const BASE_URL = 'https://finnhub.io/api/v1';

// Read the key from Expo's public env variables (prefix: EXPO_PUBLIC_)
const API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY ?? '';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  params: { token: API_KEY },
});

// ─── Market News ─────────────────────────────────────────────────────────────

type FinnhubNewsCategory = 'general' | 'forex' | 'crypto' | 'merger';

interface FinnhubNewsItem {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  category: string;
  related: string;
}

const categoryMap: Record<NewsCategory, FinnhubNewsCategory> = {
  general: 'general',
  forex: 'forex',
  crypto: 'crypto',
  merger: 'merger',
  geopolitical: 'general', // Finnhub doesn't have a dedicated geopolitical category
  earnings: 'general',
};

export async function fetchMarketNews(
  category: NewsCategory = 'general',
  minId = 0,
): Promise<NewsArticle[]> {
  const { data } = await client.get<FinnhubNewsItem[]>('/news', {
    params: { category: categoryMap[category], minId },
  });

  return data.map((item) => ({
    id: item.id.toString(),
    headline: item.headline,
    summary: item.summary,
    source: item.source,
    url: item.url,
    image: item.image,
    datetime: item.datetime,
    category: category,
    related: item.related,
  }));
}

// ─── Company News ─────────────────────────────────────────────────────────────

export async function fetchCompanyNews(
  symbol: string,
  from: string, // YYYY-MM-DD
  to: string,   // YYYY-MM-DD
): Promise<NewsArticle[]> {
  const { data } = await client.get<FinnhubNewsItem[]>('/company-news', {
    params: { symbol, from, to },
  });

  return data.map((item) => ({
    id: item.id.toString(),
    headline: item.headline,
    summary: item.summary,
    source: item.source,
    url: item.url,
    image: item.image,
    datetime: item.datetime,
    category: 'general' as NewsCategory,
    related: symbol,
  }));
}

// ─── Stock Quote ─────────────────────────────────────────────────────────────

interface FinnhubQuote {
  c: number;  // current price
  d: number;  // change
  dp: number; // percent change
  h: number;  // high
  l: number;  // low
  o: number;  // open
  pc: number; // previous close
}

export async function fetchStockQuote(symbol: string): Promise<StockQuote> {
  const [quoteRes, profileRes] = await Promise.all([
    client.get<FinnhubQuote>('/quote', { params: { symbol } }),
    client.get<{ name: string; marketCapitalization: number }>(
      '/stock/profile2',
      { params: { symbol } },
    ),
  ]);

  const q = quoteRes.data;
  const p = profileRes.data;

  return {
    symbol,
    name: p.name ?? symbol,
    currentPrice: q.c,
    change: q.d,
    changePercent: q.dp,
    high: q.h,
    low: q.l,
    open: q.o,
    previousClose: q.pc,
    marketCap: p.marketCapitalization,
  };
}

// ─── Symbol Search ────────────────────────────────────────────────────────────

interface FinnhubSearchResult {
  result: Array<{ symbol: string; description: string; type: string }>;
}

export async function searchSymbols(
  query: string,
): Promise<StockSearchResult[]> {
  const { data } = await client.get<FinnhubSearchResult>('/search', {
    params: { q: query },
  });

  return (data.result ?? []).slice(0, 20).map((r) => ({
    symbol: r.symbol,
    description: r.description,
    type: r.type,
  }));
}

// ─── Analyst Recommendations ─────────────────────────────────────────────────

interface FinnhubRecommendation {
  symbol: string;
  period: string;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
}

export async function fetchRecommendations(
  symbol: string,
): Promise<StockRecommendation | null> {
  const [recRes, quoteRes, profileRes] = await Promise.all([
    client.get<FinnhubRecommendation[]>('/stock/recommendation', {
      params: { symbol },
    }),
    client.get<FinnhubQuote>('/quote', { params: { symbol } }),
    client.get<{ name: string }>('/stock/profile2', { params: { symbol } }),
  ]);

  const recs = recRes.data;
  if (!recs || recs.length === 0) return null;

  const latest = recs[0];
  const q = quoteRes.data;
  const total =
    latest.strongBuy +
    latest.buy +
    latest.hold +
    latest.sell +
    latest.strongSell;

  const score =
    total > 0
      ? (latest.strongBuy * 2 +
          latest.buy * 1 +
          latest.hold * 0 +
          latest.sell * -1 +
          latest.strongSell * -2) /
        total
      : 0;

  let rating: StockRecommendation['rating'];
  if (score >= 1.5) rating = 'strongBuy';
  else if (score >= 0.5) rating = 'buy';
  else if (score >= -0.5) rating = 'hold';
  else if (score >= -1.5) rating = 'sell';
  else rating = 'strongSell';

  return {
    symbol,
    name: profileRes.data.name ?? symbol,
    rating,
    currentPrice: q.c,
    analyst: 'Consensus',
    reason: buildReasonText(rating, latest),
    updatedAt: Date.now() / 1000,
    strongBuy: latest.strongBuy,
    buy: latest.buy,
    hold: latest.hold,
    sell: latest.sell,
    strongSell: latest.strongSell,
  };
}

function buildReasonText(
  rating: StockRecommendation['rating'],
  rec: FinnhubRecommendation,
): string {
  const total =
    rec.strongBuy + rec.buy + rec.hold + rec.sell + rec.strongSell;
  const bullish = ((rec.strongBuy + rec.buy) / total) * 100;
  return `${bullish.toFixed(0)}% of ${total} analysts rate this ${rating === 'strongBuy' || rating === 'buy' ? 'bullish' : rating === 'hold' ? 'neutral' : 'bearish'}.`;
}
