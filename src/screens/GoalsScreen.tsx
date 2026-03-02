import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Colors from '../constants/colors';
import GoalCard from '../components/GoalCard';
import { useAppStore } from '../store/useStore';
import { InvestmentGoal } from '../types';
import { generateId } from '../utils/helpers';

// ─── Add Goal Modal ───────────────────────────────────────────────────────────

function AddGoalModal({ onClose }: { onClose: () => void }) {
  const { addGoal } = useAppStore();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<InvestmentGoal['type']>('growth');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [riskLevel, setRiskLevel] = useState<InvestmentGoal['riskLevel']>('medium');
  const [years, setYears] = useState('5');
  const [sectorInput, setSectorInput] = useState('');
  const [sectors, setSectors] = useState<string[]>([]);

  const addSector = () => {
    const s = sectorInput.trim();
    if (s && !sectors.includes(s)) {
      setSectors([...sectors, s]);
      setSectorInput('');
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing field', 'Please enter a goal title.');
      return;
    }
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount);
    if (isNaN(target) || target <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid target amount.');
      return;
    }

    addGoal({
      title: title.trim(),
      type,
      targetAmount: target,
      currentAmount: isNaN(current) ? 0 : current,
      deadline: Math.floor(Date.now() / 1000) + parseInt(years, 10) * 365 * 86400,
      riskLevel,
      sectors,
    });
    onClose();
  };

  return (
    <Modal visible animationType="slide" transparent>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={modalStyles.handle} />
            <Text style={modalStyles.title}>New Investment Goal</Text>

            {/* Title */}
            <Text style={modalStyles.label}>Title</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="e.g. Retirement Fund"
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Goal type */}
            <Text style={modalStyles.label}>Goal Type</Text>
            <View style={modalStyles.segmentRow}>
              {(['growth', 'income', 'preservation', 'speculation'] as const).map(
                (t) => (
                  <TouchableOpacity
                    key={t}
                    style={[modalStyles.segment, type === t && modalStyles.segmentActive]}
                    onPress={() => setType(t)}
                  >
                    <Text
                      style={[
                        modalStyles.segmentText,
                        type === t && modalStyles.segmentTextActive,
                      ]}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            {/* Amounts */}
            <Text style={modalStyles.label}>Target Amount ($)</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="e.g. 100000"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              value={targetAmount}
              onChangeText={setTargetAmount}
            />

            <Text style={modalStyles.label}>Current Amount ($)</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              value={currentAmount}
              onChangeText={setCurrentAmount}
            />

            {/* Timeline */}
            <Text style={modalStyles.label}>Timeline (years)</Text>
            <View style={modalStyles.segmentRow}>
              {['1', '3', '5', '10', '20'].map((y) => (
                <TouchableOpacity
                  key={y}
                  style={[modalStyles.segment, years === y && modalStyles.segmentActive]}
                  onPress={() => setYears(y)}
                >
                  <Text
                    style={[
                      modalStyles.segmentText,
                      years === y && modalStyles.segmentTextActive,
                    ]}
                  >
                    {y}y
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Risk level */}
            <Text style={modalStyles.label}>Risk Level</Text>
            <View style={modalStyles.segmentRow}>
              {(['low', 'medium', 'high'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[modalStyles.segment, riskLevel === r && modalStyles.segmentActive]}
                  onPress={() => setRiskLevel(r)}
                >
                  <Text
                    style={[
                      modalStyles.segmentText,
                      riskLevel === r && modalStyles.segmentTextActive,
                    ]}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sectors */}
            <Text style={modalStyles.label}>Target Sectors</Text>
            <View style={modalStyles.sectorInputRow}>
              <TextInput
                style={[modalStyles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="e.g. Technology"
                placeholderTextColor={Colors.textMuted}
                value={sectorInput}
                onChangeText={setSectorInput}
                onSubmitEditing={addSector}
                returnKeyType="done"
              />
              <TouchableOpacity style={modalStyles.addBtn} onPress={addSector}>
                <Text style={modalStyles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={modalStyles.sectorRow}>
              {sectors.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={modalStyles.sectorChip}
                  onPress={() => setSectors(sectors.filter((x) => x !== s))}
                >
                  <Text style={modalStyles.sectorText}>{s} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Actions */}
            <View style={modalStyles.actionRow}>
              <TouchableOpacity
                style={modalStyles.cancelBtn}
                onPress={onClose}
              >
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.saveBtn}
                onPress={handleSave}
              >
                <Text style={modalStyles.saveText}>Save Goal</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Goals Screen ─────────────────────────────────────────────────────────────

export default function GoalsScreen() {
  const { goals, deleteGoal } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        keyExtractor={(g) => g.id}
        renderItem={({ item }) => (
          <GoalCard
            goal={item}
            onDelete={deleteGoal}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.headerTitle}>Investment Goals</Text>
            <Text style={styles.headerSub}>
              Define your financial goals and track relevant sectors and stocks.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>No goals yet</Text>
            <Text style={styles.emptyBody}>
              Tap the button below to create your first investment goal.
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAdd(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>＋ New Goal</Text>
      </TouchableOpacity>

      {showAdd && <AddGoalModal onClose={() => setShowAdd(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  list: { paddingBottom: 120 },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
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
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

const modalStyles = StyleSheet.create({
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
    padding: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 4,
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  segment: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.card,
  },
  segmentActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  segmentTextActive: {
    color: '#fff',
  },
  sectorInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  sectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  sectorChip: {
    borderRadius: 10,
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectorText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
