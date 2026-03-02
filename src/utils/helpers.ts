import { NewsCategory, RecommendationRating } from '../types';

// ─── Date / Time ─────────────────────────────────────────────────────────────

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ─── Numbers ─────────────────────────────────────────────────────────────────

export function formatCurrency(value: number, decimals = 2): string {
  if (value >= 1_000_000_000_000)
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000)
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000)
    return `$${(value / 1_000_000).toFixed(1)}M`;
  return `$${value.toFixed(decimals)}`;
}

export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// ─── Category helpers ────────────────────────────────────────────────────────

export function categoryLabel(cat: NewsCategory): string {
  const labels: Record<NewsCategory, string> = {
    general: 'General',
    forex: 'Forex',
    crypto: 'Crypto',
    merger: 'M&A',
    geopolitical: 'Geopolitical',
    earnings: 'Earnings',
  };
  return labels[cat] ?? cat;
}

// ─── Recommendation helpers ──────────────────────────────────────────────────

export function ratingLabel(rating: RecommendationRating): string {
  const labels: Record<RecommendationRating, string> = {
    strongBuy: 'Strong Buy',
    buy: 'Buy',
    hold: 'Hold',
    sell: 'Sell',
    strongSell: 'Strong Sell',
  };
  return labels[rating];
}

export function ratingColor(rating: RecommendationRating): string {
  switch (rating) {
    case 'strongBuy':
      return '#00c076';
    case 'buy':
      return '#4f7cff';
    case 'hold':
      return '#ffaa00';
    case 'sell':
      return '#ff8c4d';
    case 'strongSell':
      return '#ff4d6a';
    default:
      return '#8e8ea8';
  }
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}
