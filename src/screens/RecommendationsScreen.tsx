import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Colors from '../constants/colors';
import RecommendationCard from '../components/RecommendationCard';
import { MOCK_RECOMMENDATIONS } from '../api/mockData';
import { fetchRecommendations } from '../api/finnhub';
import { StockRecommendation } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY ?? '';
const DEFAULT_SYMBOLS = ['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'META', 'TSLA', 'AMZN'];

export default function RecommendationsScreen() {
  const { data, isLoading, refetch, isRefetching } = useQuery<
    StockRecommendation[]
  >({
    queryKey: ['recommendations'],
    queryFn: async () => {
      if (!API_KEY) return MOCK_RECOMMENDATIONS;
      const results = await Promise.all(
        DEFAULT_SYMBOLS.map((s) => fetchRecommendations(s)),
      );
      return results.filter(Boolean) as StockRecommendation[];
    },
    staleTime: 30 * 60 * 1000,
  });

  const sorted = [...(data ?? MOCK_RECOMMENDATIONS)].sort((a, b) => {
    const order = { strongBuy: 0, buy: 1, hold: 2, sell: 3, strongSell: 4 };
    return (order[a.rating] ?? 9) - (order[b.rating] ?? 9);
  });

  return (
    <View style={styles.container}>
      {isLoading && !data ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading recommendations…</Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(r) => r.symbol}
          renderItem={({ item }) => <RecommendationCard rec={item} />}
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
            <View style={styles.headerBlock}>
              <Text style={styles.headerTitle}>Analyst Consensus</Text>
              <Text style={styles.headerSub}>
                Aggregated recommendations from top Wall Street analysts, updated
                monthly.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No recommendations available.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  list: {
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
