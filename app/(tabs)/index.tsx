import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';

type Priority = 'High' | 'Medium' | 'Low';
type Category = 'Personal' | 'School' | 'Work' | 'Other';

type Todo = {
  id: string;
  text: string;
  done: boolean;
  priority: Priority;
  category: Category;
  dueDate: string;
};

const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];
const CATEGORIES: Category[] = ['Personal', 'School', 'Work', 'Other'];

const PRIORITY_COLORS: Record<Priority, string> = {
  High: '#ef4444',
  Medium: '#f97316',
  Low: '#22c55e',
};

const CATEGORY_COLORS: Record<Category, string> = {
  Personal: '#8b5cf6',
  School: '#3b82f6',
  Work: '#f59e0b',
  Other: '#6b7280',
};

const CATEGORY_ICONS: Record<Category, string> = {
  Personal: '🙋',
  School: '🎓',
  Work: '💼',
  Other: '📌',
};

const QUOTES = [
  "Small steps lead to big achievements! 🚀",
  "You got this! One task at a time 💪",
  "Stay focused and get things done! ✨",
  "Progress, not perfection 🌟",
  "Every task completed is a win! 🏆",
];

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [category, setCategory] = useState<Category>('Personal');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<'All' | Category>('All');
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const addTodo = () => {
    if (text.trim() === '') return;
    setTodos([{
      id: Date.now().toString(),
      text: text.trim(),
      done: false,
      priority,
      category,
      dueDate,
    }, ...todos]);
    setText('');
    setPriority('Medium');
    setCategory('Personal');
    setDueDate('');
    setModalVisible(false);
  };

  const toggleDone = (id: string) =>
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const deleteTodo = (id: string) =>
    setTodos(todos.filter(t => t.id !== id));

  const filtered = filter === 'All' ? todos : todos.filter(t => t.category === filter);
  const totalDone = todos.filter(t => t.done).length;
  const progress = todos.length > 0 ? totalDone / todos.length : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📝 To-Do List</Text>
        <Text style={styles.quote}>{quote}</Text>

        {/* Progress Bar */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{totalDone}/{todos.length} completed</Text>
            <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
        </View>

        {/* Category Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
          {CATEGORIES.map(c => {
            const total = todos.filter(t => t.category === c).length;
            const done = todos.filter(t => t.category === c && t.done).length;
            return (
              <View key={c} style={[styles.statCard, { borderTopColor: CATEGORY_COLORS[c] }]}>
                <Text style={styles.statIcon}>{CATEGORY_ICONS[c]}</Text>
                <Text style={styles.statName}>{c}</Text>
                <Text style={[styles.statCount, { color: CATEGORY_COLORS[c] }]}>{done}/{total}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {(['All', ...CATEGORIES] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'All' ? '📋 All' : `${CATEGORY_ICONS[f as Category]} ${f}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Todo List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIllustration}>🗒️</Text>
            <Text style={styles.emptyTitle}>No tasks here!</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'All'
                ? "Tap the + button to add your first task"
                : `No ${filter} tasks yet. Add one!`}
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.emptyBtnText}>+ Add a Task</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, item.done && styles.cardDone]}>
            <TouchableOpacity onPress={() => toggleDone(item.id)} style={styles.checkbox}>
              <Text style={styles.checkboxText}>{item.done ? '✅' : '⬜'}</Text>
            </TouchableOpacity>
            <View style={styles.cardContent}>
              <Text style={[styles.taskText, item.done && styles.taskDone]}>{item.text}</Text>
              <View style={styles.tagRow}>
                <View style={[styles.tag, { backgroundColor: PRIORITY_COLORS[item.priority] }]}>
                  <Text style={styles.tagText}>{item.priority}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: CATEGORY_COLORS[item.category] }]}>
                  <Text style={styles.tagText}>{CATEGORY_ICONS[item.category]} {item.category}</Text>
                </View>
                {item.dueDate ? (
                  <View style={[styles.tag, { backgroundColor: '#64748b' }]}>
                    <Text style={styles.tagText}>📅 {item.dueDate}</Text>
                  </View>
                ) : null}
              </View>
            </View>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteBtn}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>✏️ New Task</Text>

            <TextInput
              style={styles.input}
              placeholder="What needs to be done?"
              value={text}
              onChangeText={setText}
            />

            <Text style={styles.label}>Priority</Text>
            <View style={styles.optionRow}>
              {PRIORITIES.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.optionBtn, priority === p && { backgroundColor: PRIORITY_COLORS[p], borderColor: PRIORITY_COLORS[p] }]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.optionText, priority === p && { color: '#fff' }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Category</Text>
            <View style={styles.optionRow}>
              {CATEGORIES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.optionBtn, category === c && { backgroundColor: CATEGORY_COLORS[c], borderColor: CATEGORY_COLORS[c] }]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.optionText, category === c && { color: '#fff' }]}>{CATEGORY_ICONS[c]} {c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Due Date (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Apr 30, 2026"
              value={dueDate}
              onChangeText={setDueDate}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
                <Text style={styles.addBtnText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  // Header
  header: { backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  title: { fontSize: 26, fontWeight: '800', color: '#0f172a' },
  quote: { fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 16, fontStyle: 'italic' },

  // Progress
  progressWrapper: { marginBottom: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 13, color: '#64748b' },
  progressPercent: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  progressBg: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 8 },
  progressFill: { height: 8, backgroundColor: '#0f172a', borderRadius: 8 },

  // Stats
  statsRow: { flexDirection: 'row' },
  statCard: { alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 10, borderTopWidth: 3, padding: 10, marginRight: 10, minWidth: 75 },
  statIcon: { fontSize: 18 },
  statName: { fontSize: 11, color: '#64748b', marginTop: 2 },
  statCount: { fontSize: 14, fontWeight: '700', marginTop: 2 },

  // Filter
  filterRow: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8, backgroundColor: '#fff' },
  filterBtnActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  filterText: { fontSize: 13, color: '#64748b' },
  filterTextActive: { color: '#fff', fontWeight: '600' },

  // Cards
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 10, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardDone: { opacity: 0.5 },
  checkbox: { marginRight: 12 },
  checkboxText: { fontSize: 22 },
  cardContent: { flex: 1 },
  taskText: { fontSize: 15, color: '#0f172a', fontWeight: '600', marginBottom: 6 },
  taskDone: { textDecorationLine: 'line-through', color: '#94a3b8' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  tagText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  deleteBtn: { fontSize: 18, marginLeft: 8 },

  // Empty state
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyIllustration: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 24 },
  emptyBtn: { backgroundColor: '#0f172a', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  emptyBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  // FAB
  fab: { position: 'absolute', bottom: 30, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', elevation: 6 },
  fabText: { fontSize: 30, color: '#fff', lineHeight: 34 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 12, backgroundColor: '#f8fafc' },
  label: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 8 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  optionBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  optionText: { fontSize: 13, color: '#64748b' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  cancelText: { color: '#64748b', fontWeight: '600' },
  addBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#0f172a', alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: '600' },
});