import { useState, type DragEvent } from "react";
import type { Task } from "../types";
import { deleteTask, updateOrder } from "../api";
import { TaskItem } from "./TaskItem";
import { NewTaskForm } from "./NewTaskForm";

interface TaskListProps {
  tasks: Task[];
  onChanged: () => void;
}
function getDragAfterElement(container: HTMLElement, y: number): Element | null {
  const els = [
    ...container.querySelectorAll("li[data-rank]:not(.dragging)"),
  ];
  return els.reduce<{ offset: number; element: Element | null }>(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null },
  ).element;
}

export function TaskList({ tasks, onChanged }: TaskListProps) {
  const [items, setItems] = useState<Task[]>(tasks);
  const [syncedTasks, setSyncedTasks] = useState<Task[]>(tasks);
  const [draggedRank, setDraggedRank] = useState<number | null>(null);

  if (tasks !== syncedTasks) {
    setSyncedTasks(tasks);
    setItems(tasks);
  }

  const handleDragOver = (e: DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    if (draggedRank == null) return;

    const afterElement = getDragAfterElement(e.currentTarget, e.clientY);
    setItems((prev) => {
      const dragged = prev.find((t) => t.rank === draggedRank);
      if (!dragged) return prev;
      const without = prev.filter((t) => t.rank !== draggedRank);

      if (afterElement == null) {
        return [...without, dragged];
      }
      const afterRank = Number(afterElement.getAttribute("data-rank"));
      const idx = without.findIndex((t) => t.rank === afterRank);
      if (idx === -1) return prev;
      return [...without.slice(0, idx), dragged, ...without.slice(idx)];
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      onChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDragEnd = async () => {
    try {
      console.log("dragend");
      setDraggedRank(null);
      await updateOrder(items.map((t) => t.id));
      onChanged();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="task-list">
      <ul id="task-list" onDragOver={handleDragOver}>
        {items.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isDragging={task.rank === draggedRank}
            onDragStart={setDraggedRank}
            onDragEnd={handleDragEnd}
            onDelete={handleDelete}
          />
        ))}
        <NewTaskForm nextRank={items.length} onCreated={onChanged} />
      </ul>
    </div>
  );
}
