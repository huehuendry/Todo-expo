import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTodos } from "../../hooks/useTodos";

export default function TaskDetail() {
  // Ambil parameter id dari URL/route
  const { id } = useLocalSearchParams<{ id: string }>();

  // Ambil tasks dari hook
  const { tasks, editTask } = useTodos();

  // Cari task yang sesuai id
  const task = tasks.find((t) => t.id === id);

  // Local state untuk deskripsi
  const [desc, setDesc] = useState("");

  // Update state desc saat task ditemukan
  useEffect(() => {
    if (task && task.description) {
      setDesc(task.description);
    }
  }, [task]);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Task not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.text}</Text>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Add some details..."
        value={desc}
        onChangeText={setDesc}
        onBlur={() => editTask(task.id, task.text, desc)} // simpan saat keluar input
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: "top", // biar teks mulai dari atas
  },
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
});
