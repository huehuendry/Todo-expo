import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Task } from "../types/Task";

export function useTodos() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks dari storage saat pertama kali
  useEffect(() => {
    loadTasks();
  }, []);

  // Simpan setiap kali tasks berubah
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: task,
      done: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const toggleDone = (id: string) => {
    setTasks(tasks.map((t) => 
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {
      console.log("Error saving tasks", e);
    }
  };

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem("tasks");
      if (saved) setTasks(JSON.parse(saved));
    } catch (e) {
      console.log("Error loading tasks", e);
    }
  };

  return { task, setTask, tasks, addTask, toggleDone, deleteTask };
}
