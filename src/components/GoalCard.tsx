import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/colors';
import { InvestmentGoal } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';

interface Props {
  goal: InvestmentGoal;
  onPress?: (goal: InvestmentGoal) => void;
  onDelete?: (id: string) => void;
}

const goalGradients: Record<InvestmentGoal['type'], [string, string]> = {
  growth: ['#4f7cff', '#7a4fff'],
  income: ['#00c076', '#00d4aa'],
  preservation: ['#ffaa00', '#ff8c4d'],
  speculation: ['#ff4d6a', '#c44dff'],
};

const riskColors: Record<InvestmentGoal['riskLevel'], string> = {
  low: Colors.positive,
  medium: Colors.warning,
  high: Colors.negative,
};

export default function GoalCard({ goal, onPress, onDelete }: Props) {
  const progress = Math.min(goal.currentAmount / goal.targetAmount, 1);
  const progressPct = (progress * 100).toFixed(1);
  const daysLeft = Math.max(
    0,
    Math.ceil((goal.deadline - Date.now() / 1000) / 86400),
  );
  const gradientColors = goalGradients[goal.type];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(goal)}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={[gradientColors[0] + '33', gradientColors[1] + '11']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text style={styles.type}>{goal.type.toUpperCase()}</Text>
            <Text style={styles.title}>{goal.title}</Text>
          </View>
          <View style={styles.riskBadge}>
            <View
              style={[
                styles.riskDot,
                { backgroundColor: riskColors[goal.riskLevel] },
              ]}
            />
            <Text style={styles.riskText}>{goal.riskLevel} risk</Text>
          </View>
        </View>

        {/* Amounts */}
        <View style={styles.amountRow}>
          <View>
            <Text style={styles.amountLabel}>Current</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(goal.currentAmount, 0)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={styles.amountLabel}>Target</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(goal.targetAmount, 0)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={styles.amountLabel}>Deadline</Text>
            <Text style={styles.amountValue}>{daysLeft}d left</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={gradientColors}
            style={[styles.progressFill, { flex: progress }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <View style={{ flex: 1 - progress }} />
        </View>
        <Text style={styles.progressLabel}>{progressPct}% complete</Text>

        {/* Sectors */}
        {goal.sectors.length > 0 && (
          <View style={styles.sectorRow}>
            {goal.sectors.map((s) => (
              <View key={s} style={styles.sectorChip}>
                <Text style={styles.sectorText}>{s}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Delete button */}
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(goal.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleBlock: {},
  type: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  riskText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  amountLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  progressTrack: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  sectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sectorChip: {
    borderRadius: 10,
    backgroundColor: Colors.card,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sectorText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  deleteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  deleteText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
