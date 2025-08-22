import React, { useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import TodoItem from "../components/TodoItem";
import { useTodos } from "../hooks/useTodos";

export default function App() {
  const { tasks, addTask, toggleDone, deleteTask, editTask } = useTodos();
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ My To-Do List</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={text}
        onChangeText={setText}
      />
      <Button title="Add Task" onPress={() => { addTask(text); setText(""); }} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            task={item}
            onToggle={toggleDone}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "white"
  }
});
