import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Colors from '../constants/colors';
import StockCard from '../components/StockCard';
import { fetchStockQuote } from '../api/finnhub';
import { MOCK_STOCKS } from '../api/mockData';
import { useAppStore } from '../store/useStore';
import { StockQuote } from '../types';
import { formatDate } from '../utils/helpers';

const API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY ?? '';

export default function WatchlistScreen() {
  const { watchlist, removeFromWatchlist } = useAppStore();
  const symbols = watchlist.map((w) => w.symbol);

  const { data, isLoading, refetch, isRefetching } = useQuery<StockQuote[]>({
    queryKey: ['watchlistQuotes', symbols],
    queryFn: () => {
      if (symbols.length === 0) return Promise.resolve([]);
      if (!API_KEY) {
        return Promise.resolve(
          MOCK_STOCKS.filter((s) => symbols.includes(s.symbol)),
        );
      }
      return Promise.all(symbols.map(fetchStockQuote));
    },
    enabled: symbols.length > 0,
    staleTime: 60 * 1000,
  });

  const quotes = useMemo(() => data ?? [], [data]);

  if (watchlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>☆</Text>
        <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
        <Text style={styles.emptyBody}>
          Go to the Stocks tab and tap a stock to add it to your watchlist.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && symbols.length > 0 && quotes.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={quotes}
          keyExtractor={(s) => s.symbol}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <StockCard stock={item} />
              <View style={styles.watchlistMeta}>
                {watchlist.find((w) => w.symbol === item.symbol)?.alertPrice ? (
                  <Text style={styles.alert}>
                    Alert: ${watchlist.find((w) => w.symbol === item.symbol)?.alertPrice}
                  </Text>
                ) : null}
                <Text style={styles.addedAt}>
                  Added {formatDate(
                    (watchlist.find((w) => w.symbol === item.symbol)?.addedAt ?? 0) * 1000,
                  )}
                </Text>
                <TouchableOpacity
                  onPress={() => removeFromWatchlist(item.symbol)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
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
            <Text style={styles.sectionLabel}>
              {watchlist.length} stock{watchlist.length !== 1 ? 's' : ''} tracked
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  itemWrapper: {
    marginBottom: 2,
  },
  watchlistMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 12,
  },
  alert: {
    fontSize: 11,
    color: Colors.warning,
    fontWeight: '600',
  },
  addedAt: {
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
  },
  removeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.negative,
  },
  list: { paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    color: Colors.textMuted,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  emptyBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
});
