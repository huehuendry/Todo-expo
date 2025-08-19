import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Bentuk data task → ada text + status done
type Task = {
  id: string;
  text: string;
  done: boolean;
};

export default function App() {
  const [task, setTask] = useState(""); // input sementara
  const [tasks, setTasks] = useState<Task[]>([]); // daftar task

  // 🔹 Load tasks dari storage saat app dibuka
  useEffect(() => {
    loadTasks();
  }, []);

  // 🔹 Simpan tasks ke storage tiap kali berubah
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  // Tambah task baru
  const addTask = () => {
    if (task.trim() === "") return;

    const newTask: Task = {
      id: Date.now().toString(), // ID unik dari timestamp
      text: task,
      done: false
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  // Toggle status done
  const toggleDone = (id: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  // Hapus task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Simpan ke AsyncStorage
  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {
      console.log("Error saving tasks", e);
    }
  };

  // Load dari AsyncStorage
  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem("tasks");
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch (e) {
      console.log("Error loading tasks", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ My To-Do List</Text>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={task}
        onChangeText={setTask}
      />
      <Button title="Add Task" onPress={addTask} />

      {/* List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            {/* Klik text untuk toggle done */}
            <TouchableOpacity onPress={() => toggleDone(item.id)}>
              <Text
                style={[
                  styles.taskText,
                  item.done && styles.taskDone // kalau done → style dicoret
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>

            {/* Tombol delete */}
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.delete}>❌</Text>
            </TouchableOpacity>
          </View>
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
    borderRadius: 5,
    backgroundColor: "white"
  },
  taskRow: {
    flexDirection: "row", // biar text dan delete sejajar
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2
  },
  taskText: { fontSize: 16 },
  taskDone: { textDecorationLine: "line-through", color: "gray" }, // style jika done
  delete: { fontSize: 18, color: "red", marginLeft: 10 }
});
