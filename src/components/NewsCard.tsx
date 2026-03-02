import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import Colors from '../constants/colors';
import { NewsArticle } from '../types';
import { formatRelativeTime, truncate } from '../utils/helpers';

interface Props {
  article: NewsArticle;
  onPress?: () => void;
}

const sentimentDot: Record<string, string> = {
  positive: Colors.positive,
  negative: Colors.negative,
  neutral: Colors.neutral,
};

export default function NewsCard({ article, onPress }: Props) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      Linking.openURL(article.url).catch(() => undefined);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>
      {!!article.image && (
        <Image
          source={{ uri: article.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.source}>{article.source}</Text>
          {article.sentiment && (
            <View
              style={[
                styles.sentimentDot,
                { backgroundColor: sentimentDot[article.sentiment] ?? Colors.neutral },
              ]}
            />
          )}
          <Text style={styles.time}>{formatRelativeTime(article.datetime)}</Text>
        </View>
        <Text style={styles.headline} numberOfLines={3}>
          {article.headline}
        </Text>
        {!!article.summary && (
          <Text style={styles.summary} numberOfLines={2}>
            {truncate(article.summary, 120)}
          </Text>
        )}
        {!!article.related && (
          <Text style={styles.tickers}>{article.related}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.cardAlt,
  },
  content: {
    padding: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  source: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sentimentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  time: {
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 'auto',
  },
  headline: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
  },
  summary: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 6,
  },
  tickers: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: '600',
  },
});
