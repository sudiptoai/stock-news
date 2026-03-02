import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Colors from '../constants/colors';
import { NewsCategory } from '../types';
import { categoryLabel } from '../utils/helpers';

const ALL_CATEGORIES: NewsCategory[] = [
  'general',
  'geopolitical',
  'earnings',
  'crypto',
  'forex',
  'merger',
];

interface Props {
  selected: NewsCategory[];
  onChange: (categories: NewsCategory[]) => void;
}

export default function FilterBar({ selected, onChange }: Props) {
  const toggle = (cat: NewsCategory) => {
    if (selected.includes(cat)) {
      const next = selected.filter((c) => c !== cat);
      onChange(next.length > 0 ? next : [cat]);
    } else {
      onChange([...selected, cat]);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {ALL_CATEGORIES.map((cat) => {
        const isActive = selected.includes(cat);
        return (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => toggle(cat)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {categoryLabel(cat)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: '#fff',
  },
});
