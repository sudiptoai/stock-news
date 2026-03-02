# StockNews

A React Native (Expo) app for tracking stock market news, analyst recommendations, geopolitical events, and personal investment goals.

## Features

- **Market News** – Real-time financial news categorised by General, Geopolitical, Earnings, Crypto, Forex, and M&A. Full-text search and category filter chips.
- **Stocks** – Live quotes for major symbols. Tap any stock for a detail sheet showing OHLC data, related news and a watchlist toggle.
- **Recommendations** – Aggregated analyst consensus ratings (Strong Buy → Strong Sell) with upside potential, analyst distribution bar, and reasoned summaries.
- **Watchlist** – Save stocks you want to track; price data refreshes on pull-to-refresh.
- **Goals** – Create investment goals (Growth, Income, Preservation, Speculation) with target amounts, timelines, risk levels, and sector focus.

## Tech Stack

| Concern | Library |
|---|---|
| Framework | Expo SDK 51 / React Native 0.74 |
| Navigation | React Navigation 6 (Bottom Tabs) |
| Data fetching | TanStack Query v5 |
| State management | Zustand 4 |
| HTTP client | Axios |
| UI gradients | expo-linear-gradient |
| Storage | @react-native-async-storage/async-storage |

## Free APIs

| API | Usage | Docs |
|---|---|---|
| [Finnhub](https://finnhub.io) | Market news, company news, stock quotes, analyst recommendations | https://finnhub.io/docs/api |

The app ships with **rich mock data** and works fully offline without an API key.

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (macOS) or Android Emulator / Expo Go on a physical device

### Installation

```bash
git clone https://github.com/sudiptoai/stock-news.git
cd stock-news
npm install
```

### API Key (optional)

```bash
cp .env.example .env
# Edit .env and set EXPO_PUBLIC_FINNHUB_API_KEY to your Finnhub free key
```

### Run

```bash
npm start          # Opens Expo dev menu
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser
```

### Tests

```bash
npm test
```

## Project Structure

```
.
├── App.tsx                         # Entry point (providers + navigation)
├── src/
│   ├── api/
│   │   ├── finnhub.ts              # Finnhub REST client
│   │   ├── mockData.ts             # Offline fallback data
│   │   └── index.ts
│   ├── components/
│   │   ├── NewsCard.tsx            # News article card
│   │   ├── StockCard.tsx           # Stock quote row card
│   │   ├── RecommendationCard.tsx  # Analyst recommendation card
│   │   ├── FilterBar.tsx           # Horizontal category chip bar
│   │   └── GoalCard.tsx            # Investment goal progress card
│   ├── constants/
│   │   └── colors.ts               # Dark theme colour palette
│   ├── navigation/
│   │   └── AppNavigator.tsx        # Bottom tab navigator
│   ├── screens/
│   │   ├── NewsScreen.tsx
│   │   ├── StocksScreen.tsx
│   │   ├── RecommendationsScreen.tsx
│   │   ├── WatchlistScreen.tsx
│   │   └── GoalsScreen.tsx
│   ├── store/
│   │   └── useStore.ts             # Zustand global store
│   ├── types/
│   │   └── index.ts                # TypeScript types
│   └── utils/
│       └── helpers.ts              # Formatting utilities
└── __tests__/
    └── helpers.test.ts             # Unit tests for utilities
```

## Environment Variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_FINNHUB_API_KEY` | Finnhub API key (free tier). Leave empty to use mock data. |
