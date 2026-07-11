import { useCallback, useEffect, useState } from "react";
import type { Task } from "../types";
import { getTasks } from "../api";

// Loads the full task list. Used by pages that need every task
// (the list view and the edit view). The dashboard deliberately does
// NOT use this — it fetches only its own slice via getDashboardTasks.
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      setTasks(await getTasks());
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { tasks, loaded, reload: load };
}
