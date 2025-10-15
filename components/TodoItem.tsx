import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Task } from "../types/Task";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export default function TodoItem({ task, onToggle, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const router = useRouter();

  const save = () => {
    const trimmed = text.trim();
    if (trimmed) onEdit(task.id, trimmed);
    setIsEditing(false);
  };

  return (
    <View style={styles.wrapRow}>
      {/* ✅ Indicator di luar card (kiri) */}
      <TouchableOpacity
        onPress={() => onToggle(task.id)}
        hitSlop={8}
        style={styles.leftIndicator}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
      >
        <Ionicons
          name={
            task.done ? "checkmark-done-circle" : "checkmark-circle-outline"
          }
          size={22}
          color={task.done ? "#22c55e" : "#9ca3af"}
        />
      </TouchableOpacity>

      {/* 🧾 Card konten task */}
      <View style={styles.card}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              autoFocus
              onSubmitEditing={save}
            />
            <TouchableOpacity
              accessibilityLabel="Save"
              onPress={save}
              style={styles.actionBtn}
              hitSlop={6}
            >
              <Ionicons name="checkmark" size={20} color="#1e90ff" />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityLabel="Cancel"
              onPress={() => setIsEditing(false)}
              style={styles.actionBtn}
              hitSlop={6}
            >
              <Ionicons name="close" size={20} color="#ff3b30" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* 📄 Teks = buka modal detail */}
            <Pressable
              style={{ flex: 1 }}
              onPress={() =>
                router.push({
                  pathname: "/(modals)/task/[id]",
                  params: { id: task.id },
                })
              }
            >
              <Text style={styles.text} numberOfLines={2}>
                {task.text}
              </Text>
              
              {!!task.description && (
                <Text style={styles.desc} numberOfLines={2}>
                  {task.description}
                </Text>
              )}
            </Pressable>

            {/* ✏️ Edit */}
            <TouchableOpacity
              accessibilityLabel="Edit"
              onPress={() => setIsEditing(true)}
              style={styles.actionBtn}
              hitSlop={6}
            >
              <Ionicons name="create-outline" size={20} color="#1e90ff" />
            </TouchableOpacity>

            {/* 🗑️ Delete */}
            <TouchableOpacity
              accessibilityLabel="Delete"
              onPress={() => onDelete(task.id)}
              style={styles.actionBtn}
              hitSlop={6}
            >
              <Ionicons name="trash-outline" size={20} color="#ff3b30" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  desc: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },
  descDone: {
    color: "#9ca3af",
    opacity: 0.8,
  },
  // Baris luar: indicator kiri + card kanan
  wrapRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  // Area ikon di kiri (di luar card)
  leftIndicator: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  // Card task
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    // optional: sedikit bayangan biar lebih “card”
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  text: { fontSize: 16, color: "#111" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#fafafa",
  },
  actionBtn: { marginLeft: 8 },
});
