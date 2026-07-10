import type { DragEvent } from "react";
import type { Task } from "../types";
import { categoryToIcon } from "../api";

interface TaskItemProps {
  task: Task;
  isDragging: boolean;
  onDragStart: (rank: number) => void;
  onDragEnd: () => void;
  onDelete: (rank: number) => void;
}

export function TaskItem({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
  onDelete,
}: TaskItemProps) {
  const categoryTitle = task.category
    ? task.category.charAt(0) + task.category.slice(1).toLowerCase()
    : "";

  const handleDragStart = (e: DragEvent<HTMLLIElement>) => {
    // Required in Firefox for the drag to initiate.
    e.dataTransfer.effectAllowed = "move";
    onDragStart(task.rank);
  };

  return (
    <li
      draggable
      data-rank={task.rank}
      className={isDragging ? "dragging" : undefined}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <button className="btn" onClick={() => onDelete(task.rank)} title="Delete">
        🗑
      </button>
      <strong>{task.rank}.</strong> {task.description}
      {task.category && (
        <span
          className="task-icon"
          title={categoryTitle}
          style={{ float: "right", fontSize: "1.2rem" }}
        >
          {categoryToIcon(task.category)}
        </span>
      )}
      <span style={{ color: "gray" }}>({task.status})</span>
    </li>
  );
}
