import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTodos } from "../../../hooks/useTodos";

export default function TaskModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks } = useTodos();

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Task not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.text}</Text>
      <Text style={styles.desc}>
        {task.description || "No description yet"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  desc: { fontSize: 16, color: "#444" },
});
