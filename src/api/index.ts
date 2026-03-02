/**
 * Central API export – resolves to real Finnhub calls when an API key is
 * present, otherwise falls back to mock data so the app runs offline / in dev.
 */

export * from './finnhub';
export * from './mockData';
