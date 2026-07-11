import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Task, TaskCategory } from "../types";
import { CATEGORIES, updateTask } from "../api";

interface EditTaskPageProps {
  tasks: Task[];
  loaded: boolean;
  onSaved: () => void;
}

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE"];

export function EditTaskPage({ tasks, loaded, onSaved }: EditTaskPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const task = tasks.find((t) => t.id === Number(id));

  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("TODO");
  const [category, setCategory] = useState<TaskCategory | "">("");
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    if (task) {
      setDescription(task.description);
      setNotes(task.notes ?? "");
      setStatus(task.status);
      setCategory(task.category ?? "");
      setMarked(task.marked);
    }
  }, [task]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!task) return;
    try {
      await updateTask({
        task_id: task.id,
        description,
        notes: notes.trim() === "" ? null : notes,
        status,
        category: category === "" ? null : category,
        marked,
      });
      onSaved();
      navigate("/tasks");
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  if (!loaded) {
    return (
      <div className="edit-task-page">
        <p>Loading…</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="edit-task-page">
        <h1>Task not found</h1>
        <button type="button" onClick={() => navigate("/tasks")}>
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="edit-task-page">
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Description
          <input
            name="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Notes
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
          />
        </label>

        <label>
          Status
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label>
          Category
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory | "")}
          >
            <option value="">None</option>
            {CATEGORIES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.icon} {opt.title}
              </option>
            ))}
          </select>
        </label>

        <label className="checkbox-label">
          <input
            name="marked"
            type="checkbox"
            checked={marked}
            onChange={(e) => setMarked(e.target.checked)}
          />
          Marked
        </label>

        <div className="edit-task-actions">
          <input type="submit" value="Save" />
          <button type="button" onClick={() => navigate("/tasks")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
