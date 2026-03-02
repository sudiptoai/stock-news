import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Colors from '../constants/colors';
import { StockQuote } from '../types';
import { formatCurrency, formatPercent } from '../utils/helpers';

interface Props {
  stock: StockQuote;
  onPress?: (stock: StockQuote) => void;
  compact?: boolean;
}

export default function StockCard({ stock, onPress, compact = false }: Props) {
  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? Colors.positive : Colors.negative;

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact]}
      onPress={() => onPress?.(stock)}
      activeOpacity={0.85}
    >
      <View style={styles.left}>
        <View style={styles.symbolBadge}>
          <Text style={styles.symbolText} numberOfLines={1}>
            {stock.symbol.slice(0, 4)}
          </Text>
        </View>
        <View>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {stock.name}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.price}>{formatCurrency(stock.currentPrice)}</Text>
        <View style={[styles.changeBadge, { backgroundColor: changeColor + '22' }]}>
          <Text style={[styles.change, { color: changeColor }]}>
            {isPositive ? '▲' : '▼'} {formatPercent(Math.abs(stock.changePercent), false)}
          </Text>
        </View>
      </View>

      {!compact && (
        <View style={styles.extraRow}>
          <DetailItem label="H" value={formatCurrency(stock.high)} />
          <DetailItem label="L" value={formatCurrency(stock.low)} />
          <DetailItem label="Open" value={formatCurrency(stock.open)} />
        </View>
      )}
    </TouchableOpacity>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cardCompact: {
    marginVertical: 4,
    padding: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  symbolBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  symbol: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  name: {
    fontSize: 12,
    color: Colors.textSecondary,
    maxWidth: 140,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  changeBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
  extraRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
