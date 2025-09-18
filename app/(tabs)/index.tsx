import { Link, Stack } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Button,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import TodoItem from "../../components/TodoItem";
import { useTodos } from "../../hooks/useTodos";

type Filter = "all" | "notdone" | "done";

export default function App() {
  const { tasks, addTask, toggleDone, deleteTask, editTask, clearCompleted } =
    useTodos();
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  // 🔎 Terapkan filter untuk list
  const filteredTasks = useMemo(() => {
    if (filter === "done") return tasks.filter((t) => t.done);
    if (filter === "notdone") return tasks.filter((t) => !t.done);
    return tasks;
  }, [tasks, filter]);

  const hasCompleted = useMemo(() => tasks.some((t) => t.done), [tasks]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.title}> My To-Do List</Text>

      <Link href="/about" style={{ alignSelf: "flex-end", marginBottom: 8 }}>
        About
      </Link>
      {/* Input tambah task */}
      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={text}
        onChangeText={setText}
        onSubmitEditing={() => {
          addTask(text);
          setText("");
        }}
        returnKeyType="done"
      />
      <Button
        title="Add Task"
        onPress={() => {
          addTask(text);
          setText("");
        }}
      />

      {/* 🔽 Row Filter + Clear Completed */}
      <View style={styles.toolbar}>
        <View style={styles.filters}>
          <FilterChip
            label="All"
            value="all"
            current={filter}
            onChange={setFilter}
          />
          <FilterChip
            label="Not Done"
            value="notdone"
            current={filter}
            onChange={setFilter}
          />
          <FilterChip
            label="Done"
            value="done"
            current={filter}
            onChange={setFilter}
          />
        </View>

        {hasCompleted && (
          <Pressable style={styles.clearBtn} onPress={clearCompleted}>
            <Text style={styles.clearText}>Clear Completed</Text>
          </Pressable>
        )}
      </View>

      {/* List terfilter */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TodoItem
            task={item}
            onToggle={toggleDone}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 24, color: "#777" }}>
            {filter === "all"
              ? "No tasks yet. Add one!"
              : filter === "done"
              ? "No completed tasks."
              : "No pending tasks."}
          </Text>
        }
      />
    </View>
  );
}

// Komponen kecil untuk chip filter
function FilterChip({
  label,
  value,
  current,
  onChange,
}: {
  label: string;
  value: "all" | "notdone" | "done";
  current: string;
  onChange: (v: any) => void;
}) {
  const selected = current === value;
  return (
    <Pressable
      onPress={() => onChange(value)}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom: 10,
  },

  // toolbar di atas list (filter + clear)
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 8,
  },
  filters: { flexDirection: "row", gap: 8 },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  chipSelected: { backgroundColor: "#007AFF22", borderColor: "#007AFF" },
  chipText: { color: "#333", fontSize: 13 },
  chipTextSelected: { color: "#007AFF", fontWeight: "600" },

  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#ffefef",
    borderWidth: 1,
    borderColor: "#ffcdcd",
  },
  clearText: { color: "#c51616", fontWeight: "600", fontSize: 13 },
});
