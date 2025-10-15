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
import { useTodos } from "../../../context/TodosContext";

export default function TaskModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, editTask } = useTodos();
  const task = tasks.find((t) => t.id === id);

  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (task?.description) setDesc(task.description);
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

  const close = () => {
    // auto-save deskripsi saat tutup
    editTask(task.id, task.text, desc);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.backdrop}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Tap di luar card untuk menutup */}
      <Pressable style={StyleSheet.absoluteFill} onPress={close} />

      {/* Popup kecil di tengah */}
      <View style={styles.card}>
        <Text style={styles.title}>{task.text}</Text>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Add some details..."
          value={desc}
          onChangeText={setDesc}
          multiline
        />

        {/* Tombol sederhana */}
        <View style={styles.row}>
          <Pressable
            style={[styles.btn, styles.cancel]}
            onPress={() => router.back()}
          >
            <Text style={styles.btnText}>Close</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.save]} onPress={close}>
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
    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
    elevation: 6,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#111" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#444" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    minHeight: 150,
    textAlignVertical: "top",
    backgroundColor: "#fafafa",
    marginBottom: 14,
  },
  row: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
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
