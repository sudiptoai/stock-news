import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Colors from '../constants/colors';
import { StockRecommendation } from '../types';
import { formatCurrency, formatPercent, ratingLabel, ratingColor } from '../utils/helpers';

interface Props {
  rec: StockRecommendation;
  onPress?: (rec: StockRecommendation) => void;
}

export default function RecommendationCard({ rec, onPress }: Props) {
  const color = ratingColor(rec.rating);
  const totalAnalysts =
    rec.strongBuy + rec.buy + rec.hold + rec.sell + rec.strongSell;
  const bullishPct =
    totalAnalysts > 0
      ? ((rec.strongBuy + rec.buy) / totalAnalysts) * 100
      : 0;
  const potentialReturn = rec.targetPrice
    ? ((rec.targetPrice - rec.currentPrice) / rec.currentPrice) * 100
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(rec)}
      activeOpacity={0.85}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.symbolRow}>
          <View style={[styles.ratingBadge, { backgroundColor: color + '22', borderColor: color + '55' }]}>
            <Text style={[styles.ratingText, { color }]}>{ratingLabel(rec.rating)}</Text>
          </View>
          <Text style={styles.symbol}>{rec.symbol}</Text>
          <Text style={styles.name}>{rec.name}</Text>
        </View>
        <View style={styles.priceBlock}>
          <Text style={styles.price}>{formatCurrency(rec.currentPrice)}</Text>
          {potentialReturn !== null && (
            <Text
              style={[
                styles.potential,
                { color: potentialReturn >= 0 ? Colors.positive : Colors.negative },
              ]}
            >
              {potentialReturn >= 0 ? '▲' : '▼'}{' '}
              {formatPercent(Math.abs(potentialReturn), false)} upside
            </Text>
          )}
        </View>
      </View>

      {/* Analyst bar */}
      <View style={styles.barRow}>
        {[
          { label: 'Strong Buy', count: rec.strongBuy, color: '#00c076' },
          { label: 'Buy', count: rec.buy, color: '#4f7cff' },
          { label: 'Hold', count: rec.hold, color: '#ffaa00' },
          { label: 'Sell', count: rec.sell, color: '#ff8c4d' },
          { label: 'Strong Sell', count: rec.strongSell, color: '#ff4d6a' },
        ].map((seg) =>
          seg.count > 0 && totalAnalysts > 0 ? (
            <View
              key={seg.label}
              style={[
                styles.barSegment,
                {
                  flex: seg.count / totalAnalysts,
                  backgroundColor: seg.color,
                },
              ]}
            />
          ) : null,
        )}
      </View>
      <View style={styles.barLegend}>
        <Text style={styles.legendText}>{bullishPct.toFixed(0)}% Bullish</Text>
        <Text style={styles.legendText}>{totalAnalysts} analysts</Text>
      </View>

      {/* Reason */}
      <Text style={styles.reason}>{rec.reason}</Text>

      {/* Target */}
      {rec.targetPrice && (
        <View style={styles.targetRow}>
          <Text style={styles.targetLabel}>Target Price</Text>
          <Text style={[styles.targetValue, { color }]}>
            {formatCurrency(rec.targetPrice)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  symbolRow: {
    flex: 1,
    gap: 4,
  },
  ratingBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  symbol: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  name: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  potential: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  barRow: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
    gap: 2,
  },
  barSegment: {
    borderRadius: 3,
  },
  barLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  reason: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 10,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  targetLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  targetValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});
