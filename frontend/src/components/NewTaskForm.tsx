import { useState, type FormEvent } from "react";
import { CATEGORIES, createTask } from "../api";
import type { TaskCategory } from "../types";
import { Trash2 } from "lucide-react";

interface NewTaskFormProps {
  nextRank: number;
  onCreated: () => void;
}

export function NewTaskForm({ nextRank, onCreated }: NewTaskFormProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>(CATEGORIES[0].value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createTask({ description, category });
      setDescription("");
      setCategory(CATEGORIES[0].value);
      onCreated();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <li draggable={false} id="new-task-form">
      <form onSubmit={handleSubmit}>
        <button className="btn" disabled title="Delete">
          <Trash2 />
        </button>
        <strong style={{ marginRight: "0.4em" }}>{nextRank}. </strong>
        <input
          name="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as TaskCategory)}
        >
          {CATEGORIES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.icon} {opt.title}
            </option>
          ))}
        </select>
        <input type="submit" value="Save task" />
      </form>
    </li>
  );
}
