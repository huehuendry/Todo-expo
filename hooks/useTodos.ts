import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Task } from "../types/Task";

export function useTodos() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const addTask = (text: string) => {
    if (!text.trim()) return;
    const newTask: Task = { id: Date.now().toString(), text, done: false };
    setTasks([...tasks, newTask]);
  };

  const toggleDone = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // 🔹 fungsi baru untuk edit
  const editTask = (id: string, newText: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {
      console.log("Error saving", e);
    }
  };

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem("tasks");
      if (saved) setTasks(JSON.parse(saved));
    } catch (e) {
      console.log("Error loading", e);
    }
  };

  return { tasks, addTask, toggleDone, deleteTask, editTask };
}
