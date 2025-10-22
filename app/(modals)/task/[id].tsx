// app/.../modals/[id].tsx (atau sesuai struktur kamu)
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// gunakan API baru dari context
import { useTodos } from "../../../context/TodosContext";

export default function TaskModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    tasks,
    editTaskDescription, // baru: update deskripsi
    setTaskDueAt,        // baru: set/hapus due date (ISO string | undefined)
    // editTask,         // masih ada kalau butuh kompatibilitas lama
  } = useTodos();

  const task = tasks.find((t) => t.id === id);

  // --- local state (controlled inputs) ---
  const [desc, setDesc] = useState("");
  const [dueAtStr, setDueAtStr] = useState<string | undefined>(undefined); // ISO string
  const [showPicker, setShowPicker] = useState(false);

  // hydrate state saat task berubah
  useEffect(() => {
    if (task) {
      setDesc(task.description ?? "");
      setDueAtStr(task.dueAt); // bisa undefined
    }
  }, [task]);

  if (!task) {
    return (
      <Pressable style={styles.backdrop} onPress={() => router.back()}>
        <View style={styles.card}>
          <Text>Task not found</Text>
        </View>
      </Pressable>
    );
  }

  // --- penyimpanan saat "Save" atau tap backdrop (auto-save) ---
  const persistAndClose = () => {
    editTaskDescription(task.id, desc.trim());
    setTaskDueAt(task.id, dueAtStr); // undefined = hapus due date
    router.back();
  };

  // --- UI ---

  return (
    <KeyboardAvoidingView
      style={styles.backdrop}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Tap di luar card = auto-save (sesuai pola filemu) */}
      <Pressable style={StyleSheet.absoluteFill} onPress={persistAndClose} />

      <View style={styles.card}>
        <Text style={styles.title}>{task.text}</Text>

        {/* Deskripsi */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Add some details..."
          value={desc}
          onChangeText={setDesc}
          multiline
        />

        {/* Due date row */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Due date</Text>

            {/* tombol kecil untuk hapus due date */}
            {dueAtStr ? (
              <Pressable
                onPress={() => setDueAtStr(undefined)}
                style={styles.clearChip}
              >
                <Text style={styles.clearChipText}>Clear</Text>
              </Pressable>
            ) : null}
          </View>

          <Pressable onPress={() => setShowPicker(true)} style={styles.dateRow}>
            <Text style={styles.value}>
              {dueAtStr ? dayjs(dueAtStr).format("DD MMM YYYY") : "—"}
            </Text>
            <Text style={styles.link}>Change</Text>
          </Pressable>

          {/* Native picker (Android/iOS) */}
          {showPicker && Platform.OS !== "web" && (
            <DateTimePicker
              mode="date"
              value={dueAtStr ? new Date(dueAtStr) : new Date()}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  setDueAtStr(selectedDate.toISOString());
                }
              }}
            />
          )}

          {/* Web fallback sederhana pakai input text */}
          {Platform.OS === "web" && showPicker && (
            <View style={{ gap: 8 }}>
              <Text style={styles.helper}>Input date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2025-10-22"
                keyboardType="numbers-and-punctuation"
                value={dueAtStr ? dayjs(dueAtStr).format("YYYY-MM-DD") : ""}
                onChangeText={(txt) => {
                  const ok = /^\d{4}-\d{2}-\d{2}$/.test(txt);
                  if (ok) {
                    const d = new Date(txt + "T00:00:00");
                    if (!isNaN(d.getTime())) setDueAtStr(d.toISOString());
                  }
                }}
                onBlur={() => setShowPicker(false)}
                autoFocus
              />
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {/* Close = keluar tanpa menyimpan */}
          <Pressable
            style={[styles.btn, styles.cancel]}
            onPress={() => router.back()}
          >
            <Text style={styles.btnText}>Close</Text>
          </Pressable>

          {/* Save = simpan deskripsi & due date */}
          <Pressable style={[styles.btn, styles.save]} onPress={persistAndClose}>
            <Text style={[styles.btnText, { color: "white" }]}>Save</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // backdrop gelap transparan, center content
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  // card pop-up
  card: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    // shadow untuk web
    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)" as any,
    // shadow untuk android
    elevation: 6,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#111" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#444" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    minHeight: 120,
    textAlignVertical: "top",
    backgroundColor: "#fafafa",
    marginBottom: 14,
  },
  section: { marginTop: 4, marginBottom: 10 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dateRow: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fafafa",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: { fontSize: 14, fontWeight: "600", color: "#111" },
  link: { fontSize: 13, fontWeight: "700", color: "#1e90ff" },
  helper: { fontSize: 12, opacity: 0.7, marginBottom: 4 },
  clearChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  clearChipText: { fontSize: 12, fontWeight: "700", color: "#444" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 8 },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancel: { backgroundColor: "white" },
  save: { backgroundColor: "#1e90ff", borderColor: "#1e90ff" },
  btnText: { color: "#333", fontWeight: "600" },
});
