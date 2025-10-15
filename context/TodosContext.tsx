// context/TodosContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Task } from "../types/Task";

const STORAGE_KEY = "tasks";

type TodosCtx = {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleDone: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, newText?: string, description?: string) => void;
  clearCompleted: () => void;
};

const Ctx = createContext<TodosCtx | null>(null);

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // load sekali saat mount
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(JSON.parse(saved));
    })();
  }, []);

  // simpan setiap tasks berubah
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(()=>{});
  }, [tasks]);

  // --- aksi (pakai pattern immutabel) ---
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

  const editTask = useCallback((id: string, newText?: string, description?: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const patch: Partial<Task> = {};
      if (typeof newText === "string") {
        const trimmed = newText.trim();
        if (trimmed) patch.text = trimmed;
      }
      if (description !== undefined) patch.description = description;
      return { ...t, ...patch };
    }));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => !t.done));
  }, []);

  const value = useMemo(() => ({
    tasks, addTask, toggleDone, deleteTask, editTask, clearCompleted
  }), [tasks, addTask, toggleDone, deleteTask, editTask, clearCompleted]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTodos() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTodos must be used within TodosProvider");
  return v;
}
