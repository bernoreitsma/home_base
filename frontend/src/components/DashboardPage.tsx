import { useCallback, useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { Task, TaskStatus } from "../types";
import { CATEGORIES, getDashboardTasks, updateTask } from "../api";
import { playFireworks } from "../utils";

function categoryMeta(category: Task["category"]) {
  return CATEGORIES.find((c) => c.value === category);
}

function statusLabel(status: TaskStatus): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function DashboardTile({
  task,
  onDone,
}: {
  task: Task;
  onDone: (task: Task) => void;
}) {
  const meta = categoryMeta(task.category);
  return (
    <article
      className={`dashboard-tile dashboard-tile--${(
        task.category ?? "none"
      ).toLowerCase()}`}
    >
      <header className="dashboard-tile__head">
        <span className="dashboard-tile__icon">{meta?.icon ?? "📌"}</span>
        <span className="dashboard-tile__category">{meta?.title ?? "Other"}</span>
      </header>
      <p className="dashboard-tile__description">{task.description}</p>
      {task.notes && <p className="dashboard-tile__notes">{task.notes}</p>}
      <footer className="dashboard-tile__foot">
        <span
          className={`status-badge status-badge--${task.status.toLowerCase()}`}
        >
          {statusLabel(task.status)}
        </span>
        <button
          className="dashboard-tile__done"
          title="Mark done"
          onClick={() => onDone(task)}
        >
          <Check size={18} />
        </button>
      </footer>
    </article>
  );
}

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      setTasks(await getDashboardTasks());
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDone = async (task: Task) => {
    try {
      await updateTask({
        task_id: task.id,
        description: task.description,
        notes: task.notes,
        status: "DONE",
        category: task.category,
        marked: task.marked,
      });
      playFireworks();
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {!loaded ? (
        <p className="dashboard-empty">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="dashboard-empty">No tasks to show.</p>
      ) : (
        <div className="dashboard-grid">
          {tasks.map((task) => (
            <DashboardTile key={task.id} task={task} onDone={handleDone} />
          ))}
        </div>
      )}
    </div>
  );
}
