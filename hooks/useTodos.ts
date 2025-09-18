// hooks/useTodos.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Task } from "../types/Task";

const STORAGE_KEY = "tasks";

export function useTodos() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => { void loadTasks(); }, []);
  useEffect(() => { void saveTasks(); }, [tasks]);

  const addTask = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), text: trimmed, done: false }]);
  }, []);

  const toggleDone = useCallback((id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const editTask = useCallback((id: string, newText: string) => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, text: trimmed } : t)));
  }, []);

  // ✅ BARU: hapus semua task yang sudah selesai
  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => !t.done));
  }, []);

  const saveTasks = useCallback(async () => {
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
    catch (e) { console.log("Error saving tasks:", e); }
  }, [tasks]);

  const loadTasks = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(JSON.parse(saved));
    } catch (e) {
      console.log("Error loading tasks:", e);
    }
  }, []);

  return { tasks, addTask, toggleDone, deleteTask, editTask, clearCompleted };
}
