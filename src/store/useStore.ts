import { create } from 'zustand';
import { InvestmentGoal, NewsFilter, StockFilter, WatchlistItem } from '../types';
import { generateId } from '../utils/helpers';
import { MOCK_GOALS } from '../api/mockData';

// ─── State shape ──────────────────────────────────────────────────────────────

interface AppState {
  // Watchlist
  watchlist: WatchlistItem[];
  addToWatchlist: (item: Omit<WatchlistItem, 'addedAt'>) => void;
  removeFromWatchlist: (symbol: string) => void;
  updateWatchlistItem: (symbol: string, updates: Partial<WatchlistItem>) => void;
  isWatched: (symbol: string) => boolean;

  // Goals
  goals: InvestmentGoal[];
  addGoal: (goal: Omit<InvestmentGoal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<InvestmentGoal>) => void;
  deleteGoal: (id: string) => void;

  // News filter
  newsFilter: NewsFilter;
  setNewsFilter: (filter: Partial<NewsFilter>) => void;
  resetNewsFilter: () => void;

  // Stock filter
  stockFilter: StockFilter;
  setStockFilter: (filter: Partial<StockFilter>) => void;
  resetStockFilter: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultNewsFilter: NewsFilter = {
  categories: ['general', 'geopolitical', 'earnings'],
  searchQuery: '',
};

const defaultStockFilter: StockFilter = {
  searchQuery: '',
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  // ── Watchlist ──────────────────────────────────────────────────────────────
  watchlist: [],

  addToWatchlist: (item) =>
    set((state) => ({
      watchlist: [
        ...state.watchlist.filter((w) => w.symbol !== item.symbol),
        { ...item, addedAt: Math.floor(Date.now() / 1000) },
      ],
    })),

  removeFromWatchlist: (symbol) =>
    set((state) => ({
      watchlist: state.watchlist.filter((w) => w.symbol !== symbol),
    })),

  updateWatchlistItem: (symbol, updates) =>
    set((state) => ({
      watchlist: state.watchlist.map((w) =>
        w.symbol === symbol ? { ...w, ...updates } : w,
      ),
    })),

  isWatched: (symbol) => get().watchlist.some((w) => w.symbol === symbol),

  // ── Goals ──────────────────────────────────────────────────────────────────
  goals: MOCK_GOALS,

  addGoal: (goal) =>
    set((state) => ({
      goals: [
        ...state.goals,
        {
          ...goal,
          id: generateId(),
          createdAt: Math.floor(Date.now() / 1000),
        },
      ],
    })),

  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),

  deleteGoal: (id) =>
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

  // ── News filter ────────────────────────────────────────────────────────────
  newsFilter: defaultNewsFilter,

  setNewsFilter: (filter) =>
    set((state) => ({ newsFilter: { ...state.newsFilter, ...filter } })),

  resetNewsFilter: () => set({ newsFilter: defaultNewsFilter }),

  // ── Stock filter ───────────────────────────────────────────────────────────
  stockFilter: defaultStockFilter,

  setStockFilter: (filter) =>
    set((state) => ({ stockFilter: { ...state.stockFilter, ...filter } })),

  resetStockFilter: () => set({ stockFilter: defaultStockFilter }),
}));
