import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import type { Task } from "./types";
import { getTasks } from "./api";
import { TaskList } from "./components/TaskList";
import { EditTaskPage } from "./components/EditTaskPage";

export function App() {
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
    load();
  }, [load]);

  return (
    <Routes>
      <Route
        path="/tasks"
        element={
          <>
            <h1>Task List</h1>
            <TaskList tasks={tasks} onChanged={load} />
          </>
        }
      />
      <Route
        path="/tasks/:id/edit"
        element={<EditTaskPage tasks={tasks} loaded={loaded} onSaved={load} />}
      />
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}
