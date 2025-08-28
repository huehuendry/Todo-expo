import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Task } from "../types/Task";

const STORAGE_KEY = "tasks"; // ✔️ satukan key agar mudah diubah/diuji

export function useTodos() {
// State utama untuk daftar tugas
const [tasks, setTasks] = useState<Task[]>([]);
// (Opsional) bisa kepake kalau butuh loading indicator
// const [loading, setLoading] = useState(true);

// Saat pertama kali mount: load dari storage
useEffect(() => {
void loadTasks();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// Setiap tasks berubah → simpan ke storage
useEffect(() => {
// `void` mengindikasikan kita sengaja mengabaikan Promise
void saveTasks();
}, [tasks]);

// Tambah task baru, abaikan teks kosong/whitespace
const addTask = useCallback((text: string) => {
const trimmed = text.trim();
if (!trimmed) return;

const newTask: Task = {
  id: Date.now().toString(), // ID sederhana berbasis timestamp
  text: trimmed,
  done: false,
};

// Gunakan setter berbasis prev agar aman terhadap update bersamaan
setTasks((prev) => [...prev, newTask]);
}, []);

// Toggle selesai/belum selesai
const toggleDone = useCallback((id: string) => {
setTasks((prev) =>
  prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
);
}, []);

// Hapus task by id
const deleteTask = useCallback((id: string) => {
setTasks((prev) => prev.filter((t) => t.id !== id));
}, []);

// Edit teks task; kosongkan → abaikan (bisa diubah ke auto-delete kalau mau)
const editTask = useCallback((id: string, newText: string) => {
const trimmed = newText.trim();
if (!trimmed) return;
setTasks((prev) =>
  prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
);
}, []);

// Simpan state tasks → AsyncStorage (string)
const saveTasks = useCallback(async () => {
try {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
} catch (e) {
  console.log("Error saving tasks:", e);
}
}, [tasks]);

// Muat dari AsyncStorage → state
const loadTasks = useCallback(async () => {
try {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved) {
    // Validasi ringan agar aman dari data korup
    const parsed: unknown = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      // (Opsional) bisa tambah pengecekan properti tiap item
      setTasks(parsed as Task[]);
    }
  }
} catch (e) {
  console.log("Error loading tasks:", e);
} finally {
  // setLoading(false);
}
}, []);

return { tasks, addTask, toggleDone, deleteTask, editTask /*, loading */ };
}
