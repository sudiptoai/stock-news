import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Colors from '../constants/colors';
import FilterBar from '../components/FilterBar';
import NewsCard from '../components/NewsCard';
import { fetchMarketNews } from '../api/finnhub';
import { MOCK_NEWS } from '../api/mockData';
import { useAppStore } from '../store/useStore';
import { NewsArticle, NewsCategory } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY ?? '';

export default function NewsScreen() {
  const { newsFilter, setNewsFilter } = useAppStore();

  const { data, isLoading, isError, refetch, isRefetching } = useQuery<
    NewsArticle[]
  >({
    queryKey: ['marketNews', newsFilter.categories[0]],
    queryFn: () =>
      API_KEY
        ? fetchMarketNews(newsFilter.categories[0])
        : Promise.resolve(MOCK_NEWS),
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    let articles = data ?? MOCK_NEWS;

    if (newsFilter.categories.length > 0) {
      articles = articles.filter((a) =>
        newsFilter.categories.includes(a.category),
      );
    }

    if (newsFilter.searchQuery.trim()) {
      const q = newsFilter.searchQuery.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.headline.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          (a.related ?? '').toLowerCase().includes(q),
      );
    }

    return articles;
  }, [data, newsFilter]);

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search news…"
          placeholderTextColor={Colors.textMuted}
          value={newsFilter.searchQuery}
          onChangeText={(t) => setNewsFilter({ searchQuery: t })}
          returnKeyType="search"
        />
      </View>

      {/* Category filter */}
      <FilterBar
        selected={newsFilter.categories as NewsCategory[]}
        onChange={(cats) => setNewsFilter({ categories: cats })}
      />

      {/* Content */}
      {isLoading && !data ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading news…</Text>
        </View>
      ) : isError && !data ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load news.</Text>
          <Text style={styles.errorSub}>Showing cached data.</Text>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NewsCard article={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.center}>
              <Text style={styles.emptyText}>No articles match your filters.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
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
  errorText: {
    color: Colors.negative,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  errorSub: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
