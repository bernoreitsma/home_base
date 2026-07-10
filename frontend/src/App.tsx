import { useCallback, useEffect, useState } from "react";
import type { Task } from "./types";
import { getTasks } from "./api";
import { TaskList } from "./components/TaskList";

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const load = useCallback(async () => {
    try {
      setTasks(await getTasks());
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <h1>Task List</h1>
      <TaskList tasks={tasks} onChanged={load} />
    </>
  );
}
