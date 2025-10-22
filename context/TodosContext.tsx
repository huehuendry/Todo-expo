// context/TodosContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Task } from "../types/Task";

/**
 * Pastikan tipe Task-mu mendukung field berikut:
 * export type Task = {
 *   id: string;
 *   text: string;            // judul task
 *   done: boolean;
 *   description?: string;    // deskripsi opsional
 *   dueAt?: string;          // ISO string (contoh: "2025-10-22T00:00:00.000Z")
 * }
 */

const STORAGE_KEY = "tasks";

/** Tambahan: versi data agar mudah migrasi jika struktur berubah di masa depan */
const STORAGE_VERSION_KEY = "tasks_version";
const CURRENT_VERSION = 1;

type TodosCtx = {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleDone: (id: string) => void;
  deleteTask: (id: string) => void;

  /** API lama (dipertahankan untuk kompatibilitas):
   *  - newText: jika string valid (trim != ""), update judul
   *  - description: jika !== undefined, set deskripsi (bisa kosong "")
   */
  editTask: (id: string, newText?: string, description?: string) => void;

  /** API baru yang lebih eksplisit dan aman dipakai di UI */
  editTaskTitle: (id: string, title: string) => void;
  editTaskDescription: (id: string, description: string) => void;
  setTaskDueAt: (id: string, dueAt?: string) => void; // undefined = hapus due date

  clearCompleted: () => void;
};

const Ctx = createContext<TodosCtx | null>(null);

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
const [hydrated, setHydrated] = useState(false);

  /** Util: simpan ke storage */
  const persist = useCallback(async (data: Task[]) => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEY, JSON.stringify(data)],
        [STORAGE_VERSION_KEY, String(CURRENT_VERSION)],
      ]);
    } catch {
      // diamkan saja; tidak mengganggu UX
    }
  }, []);

  /** Util: migrasi data lama → struktur terbaru */
  const migrate = useCallback((raw: unknown): Task[] => {
    // Defensive parse
    let arr: any[] = [];
    try {
      arr = Array.isArray(raw) ? raw : JSON.parse(String(raw));
    } catch {
      return [];
    }

    const normalized: Task[] = arr
      .map((t) => {
        if (!t || typeof t !== "object") return null;

        // Beberapa proyek lama memakai 'title' alih-alih 'text' → normalisasi
        const text = typeof t.text === "string" ? t.text
                  : typeof t.title === "string" ? t.title
                  : "";

        const id = typeof t.id === "string" ? t.id : String(Date.now() + Math.random());
        const done = Boolean(t.done);
        const description =
          typeof t.description === "string" ? t.description : undefined;

        // dueAt disimpan sebagai string ISO (jika valid Date, convert ke ISO)
        let dueAt: string | undefined = undefined;
        if (typeof t.dueAt === "string") {
          const d = new Date(t.dueAt);
          if (!Number.isNaN(d.getTime())) dueAt = d.toISOString();
        } else if (t.dueAt && typeof t.dueAt === "object") {
          // kalau ada yang pernah menyimpan Date object mentah (jarang, tapi antisipasi)
          const d = new Date(t.dueAt);
          if (!Number.isNaN(d.getTime())) dueAt = d.toISOString();
        }

        if (!text.trim()) return null;

        const normalizedTask: Task = {
          id,
          text: text.trim(),
          done,
          ...(description !== undefined ? { description } : {}),
          ...(dueAt ? { dueAt } : {}),
        };

        return normalizedTask;
      })
      .filter(Boolean) as Task[];

    return normalized;
  }, []);

  // --- Load sekali saat mount ---
useEffect(() => {
  (async () => {
    try {
      const [[, saved], [, verStr]] = await AsyncStorage.multiGet([
        STORAGE_KEY,
        STORAGE_VERSION_KEY,
      ]);
      const version = verStr ? Number(verStr) : 0;

      if (!saved) {
        setTasks([]);
        setHydrated(true); // <-- NEW
        return;
      }

      if (version !== CURRENT_VERSION) {
        const migrated = migrate(saved);
        setTasks(migrated);
        await persist(migrated);
      } else {
        const parsed = JSON.parse(saved) as Task[];
        setTasks(migrate(parsed));
      }
    } catch {
      setTasks([]);
    } finally {
      setHydrated(true); // <-- NEW (pastikan dipanggil)
    }
  })();
}, [migrate, persist]);


  // --- Simpan setiap tasks berubah (simple, cepat, aman) ---
  useEffect(() => {
    if (!hydrated) return;
    // Hindari tulis saat initial (opsional), tapi simple: tulis saja.
    persist(tasks);
}, [tasks, hydrated, persist]);

  // --- Helper: update satu task dengan patch parsial (DRY) ---
  const patchTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
      );
    },
    [setTasks]
  );

  // --- Aksi (immutable pattern) ---
  const addTask = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: trimmed,
        done: false,
        // description/dueAt opsional → biarkan undefined
      },
    ]);
  }, []);

  const toggleDone = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /** API lama: tetap hidup.
   * - newText: jika string valid & tidak kosong → update judul (text)
   * - description: jika !== undefined → set langsung (bisa kosong "")
   */
  const editTask = useCallback(
    (id: string, newText?: string, description?: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const patch: Partial<Task> = {};

          if (typeof newText === "string") {
            const trimmed = newText.trim();
            if (trimmed) patch.text = trimmed;
          }
          if (description !== undefined) {
            patch.description = description; // boleh "" untuk mengosongkan
          }
          return { ...t, ...patch };
        })
      );
    },
    []
  );

  /** API baru & jelas: title, description, dueAt */
  const editTaskTitle = useCallback(
    (id: string, title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      patchTask(id, { text: trimmed });
    },
    [patchTask]
  );

  const editTaskDescription = useCallback(
    (id: string, description: string) => {
      // Boleh kosong "" untuk menghapus deskripsi.
      patchTask(id, { description });
    },
    [patchTask]
  );

  const setTaskDueAt = useCallback(
    (id: string, dueAt?: string) => {
      // Validasi ringan: jika ada dueAt, pastikan valid date
      if (dueAt !== undefined) {
        const d = new Date(dueAt);
        if (Number.isNaN(d.getTime())) return; // invalid → abaikan
        patchTask(id, { dueAt: d.toISOString() });
      } else {
        // undefined → hapus due date
        patchTask(id, { dueAt: undefined });
      }
    },
    [patchTask]
  );

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.done));
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      toggleDone,
      deleteTask,
      editTask,
      editTaskTitle,
      editTaskDescription,
      setTaskDueAt,
      clearCompleted,
    }),
    [
      tasks,
      addTask,
      toggleDone,
      deleteTask,
      editTask,
      editTaskTitle,
      editTaskDescription,
      setTaskDueAt,
      clearCompleted,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTodos() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTodos must be used within TodosProvider");
  return v;
}
