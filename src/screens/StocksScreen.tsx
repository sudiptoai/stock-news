import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Colors from '../constants/colors';
import StockCard from '../components/StockCard';
import NewsCard from '../components/NewsCard';
import { fetchStockQuote, fetchCompanyNews } from '../api/finnhub';
import { MOCK_STOCKS, MOCK_NEWS } from '../api/mockData';
import { useAppStore } from '../store/useStore';
import { StockQuote, NewsArticle } from '../types';
import { formatCurrency, formatPercent, formatRelativeTime } from '../utils/helpers';

const API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY ?? '';

const DEFAULT_SYMBOLS = ['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META'];

// ─── Stock Detail Modal ───────────────────────────────────────────────────────

function StockDetailModal({
  stock,
  onClose,
}: {
  stock: StockQuote;
  onClose: () => void;
}) {
  const { addToWatchlist, removeFromWatchlist, isWatched } = useAppStore();
  const watched = isWatched(stock.symbol);

  const today = new Date();
  const from = new Date(today.getTime() - 7 * 86400000)
    .toISOString()
    .slice(0, 10);
  const to = today.toISOString().slice(0, 10);

  const { data: news } = useQuery<NewsArticle[]>({
    queryKey: ['companyNews', stock.symbol],
    queryFn: () =>
      API_KEY
        ? fetchCompanyNews(stock.symbol, from, to)
        : Promise.resolve(
            MOCK_NEWS.filter((n) => n.related?.includes(stock.symbol)).slice(0, 5),
          ),
    staleTime: 5 * 60 * 1000,
  });

  const isPositive = stock.change >= 0;

  return (
    <Modal visible animationType="slide" transparent>
      <View style={detailStyles.overlay}>
        <View style={detailStyles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Handle */}
            <View style={detailStyles.handle} />

            {/* Symbol header */}
            <View style={detailStyles.header}>
              <View>
                <Text style={detailStyles.symbol}>{stock.symbol}</Text>
                <Text style={detailStyles.name}>{stock.name}</Text>
              </View>
              <TouchableOpacity
                style={detailStyles.closeBtn}
                onPress={onClose}
              >
                <Text style={detailStyles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Price */}
            <View style={detailStyles.priceRow}>
              <Text style={detailStyles.price}>
                {formatCurrency(stock.currentPrice)}
              </Text>
              <Text
                style={[
                  detailStyles.change,
                  {
                    color: isPositive ? Colors.positive : Colors.negative,
                  },
                ]}
              >
                {isPositive ? '▲' : '▼'} {formatCurrency(Math.abs(stock.change))} (
                {formatPercent(Math.abs(stock.changePercent), false)})
              </Text>
            </View>

            {/* Stats grid */}
            <View style={detailStyles.statsGrid}>
              {[
                { label: 'Open', value: formatCurrency(stock.open) },
                { label: 'Prev Close', value: formatCurrency(stock.previousClose) },
                { label: "Day High", value: formatCurrency(stock.high) },
                { label: 'Day Low', value: formatCurrency(stock.low) },
                ...(stock.marketCap
                  // Finnhub marketCapitalization is in millions USD → convert to full dollars
                  ? [{ label: 'Market Cap', value: formatCurrency(stock.marketCap * 1_000_000) }]
                  : []),
              ].map(({ label, value }) => (
                <View key={label} style={detailStyles.statItem}>
                  <Text style={detailStyles.statLabel}>{label}</Text>
                  <Text style={detailStyles.statValue}>{value}</Text>
                </View>
              ))}
            </View>

            {/* Watchlist action */}
            <TouchableOpacity
              style={[
                detailStyles.watchBtn,
                watched && detailStyles.watchBtnActive,
              ]}
              onPress={() => {
                if (watched) {
                  removeFromWatchlist(stock.symbol);
                } else {
                  addToWatchlist({ symbol: stock.symbol, name: stock.name });
                }
              }}
            >
              <Text style={[detailStyles.watchBtnText, watched && detailStyles.watchBtnTextActive]}>
                {watched ? '★ In Watchlist' : '☆ Add to Watchlist'}
              </Text>
            </TouchableOpacity>

            {/* Related news */}
            {news && news.length > 0 && (
              <>
                <Text style={detailStyles.newsHeading}>Related News</Text>
                {news.slice(0, 5).map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function StocksScreen() {
  const { stockFilter, setStockFilter } = useAppStore();
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null);

  const { data, isLoading, refetch, isRefetching } = useQuery<StockQuote[]>({
    queryKey: ['stocks'],
    queryFn: () =>
      API_KEY
        ? Promise.all(DEFAULT_SYMBOLS.map(fetchStockQuote))
        : Promise.resolve(MOCK_STOCKS),
    staleTime: 60 * 1000,
  });

  const filtered = useMemo(() => {
    let stocks = data ?? MOCK_STOCKS;
    if (stockFilter.searchQuery.trim()) {
      const q = stockFilter.searchQuery.toLowerCase();
      stocks = stocks.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q),
      );
    }
    return stocks;
  }, [data, stockFilter.searchQuery]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)),
    [filtered],
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search symbol or name…"
          placeholderTextColor={Colors.textMuted}
          value={stockFilter.searchQuery}
          onChangeText={(t) => setStockFilter({ searchQuery: t })}
          autoCapitalize="characters"
          returnKeyType="search"
        />
      </View>

      {isLoading && !data ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(s) => s.symbol}
          renderItem={({ item }) => (
            <StockCard stock={item} onPress={setSelectedStock} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
          ListHeaderComponent={
            <Text style={styles.sectionLabel}>Market Overview</Text>
          }
        />
      )}

      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  list: { paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

const detailStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  symbol: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  name: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  priceRow: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  change: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  statItem: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 10,
    minWidth: '45%',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  watchBtn: {
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginBottom: 20,
  },
  watchBtnActive: {
    backgroundColor: Colors.primary + '22',
  },
  watchBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  watchBtnTextActive: {
    color: Colors.primaryLight,
  },
  newsHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
});
