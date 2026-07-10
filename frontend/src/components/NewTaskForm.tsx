import { useState, type FormEvent } from "react";
import { createTask } from "../api";

interface NewTaskFormProps {
  nextRank: number;
  onCreated: () => void;
}

// Title-case values match the original <select>; the backend upper-cases them.
const CATEGORY_OPTIONS = [
  { value: "Important", label: "💼 Important" },
  { value: "Fun", label: "🙂 Fun" },
  { value: "Small", label: "🤏 Small" },
  { value: "Urgent", label: "🚨 Urgent" },
];

export function NewTaskForm({ nextRank, onCreated }: NewTaskFormProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createTask({ description, category });
      setDescription("");
      setCategory(CATEGORY_OPTIONS[0].value);
      onCreated();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <li draggable={false} id="new-task-form">
      <form onSubmit={handleSubmit}>
        <button className="btn" disabled>
          🗑
        </button>
        <strong>{nextRank}. </strong>
        <input
          name="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input type="submit" value="Save task" />
      </form>
    </li>
  );
}
