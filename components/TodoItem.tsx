import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs"; // NEW
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

    const confirmDelete = () => {
    
    Alert.alert(
      "Delete task?",
      `Are you sure you want to delete:\n“${task.text}”`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive", // iOS: merah; Android: diabaikan (tetap ok)
          onPress: () => onDelete(task.id),
        },
      ],
      { cancelable: true }
    );
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
              <Text
                style={[styles.text, task.done && styles.textDone]} // NEW: coret judul jika done
                numberOfLines={2}
              >
                {task.text}
              </Text>

              {!!task.description && (
                <Text
                  style={[styles.desc, task.done && styles.descDone]} // NEW
                >
                  {task.description}
                </Text>
              )}

              {/* NEW: Due date di bawah deskripsi */}
              {!!task.dueAt && (
                <View
                  style={styles.dueRow}
                  accessible
                  accessibilityRole="text"
                  accessibilityLabel={`Due date ${dayjs(task.dueAt).format(
                    "DD/MM/YYYY"
                  )}`}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    style={[styles.dueIcon, task.done && styles.dueMuted]}
                  />
                  <Text
                    style={[styles.dueText, task.done && styles.dueTextDone]}
                  >
                    {dayjs(task.dueAt).format("DD/MM/YYYY")}
                  </Text>
                </View>
              )}
            </Pressable>

            {/* ✏️ Edit */}
            <TouchableOpacity
              accessibilityLabel="Edit"
              onPress={() => {
                setText(task.text);
                setIsEditing(false);
              }}
              style={styles.actionBtn}
              hitSlop={6}
            >
              <Ionicons name="create-outline" size={20} color="#1e90ff" />
            </TouchableOpacity>

            {/* 🗑️ Delete */}
            <TouchableOpacity
              accessibilityLabel="Delete"
              onPress={confirmDelete}
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
  // NEW: styling judul saat done
  text: { fontSize: 16, color: "#111" },
  textDone: {
    textDecorationLine: "line-through",
    color: "#6b7280",
  },

  desc: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },
  descDone: {
    color: "#9ca3af",
    opacity: 0.8,
    textDecorationLine: "line-through",
  },

  // NEW: due date row
  dueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // jika RN-mu tidak support gap, hapus dan pakai marginRight di dueIcon
    marginTop: 4,
  },
  dueIcon: {
    opacity: 0.85,
    // jika kamu hapus 'gap', aktifkan ini:
    // marginRight: 6,
  },
  dueMuted: { opacity: 0.5 },
  dueText: { fontSize: 12, color: "#555" },
  dueTextDone: {
    textDecorationLine: "line-through",
    opacity: 0.6,
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
    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)" as any, // untuk RN Web
    elevation: 2, // untuk Android
  },

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
