import { useState } from "react";
import type { DragEvent, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { TASK_STATUSES, TaskStatus, type Task } from "../types";
import { categoryToIcon, updateTask } from "../api";
import { playFireworks } from "../utils";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";

interface TaskItemProps {
  task: Task;
  isDragging: boolean;
  onDragStart: (rank: number) => void;
  onDragEnd: () => void;
  onDelete: (id: number) => void;
}

function statusLabel(status: TaskStatus): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const [status, setStatus] = useState<TaskStatus>(task.status);

  const handleDragStart = (e: DragEvent<HTMLLIElement>) => {
    // Required in Firefox for the drag to initiate.
    e.dataTransfer.effectAllowed = "move";
    onDragStart(task.rank);
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/tasks/${task.id}/edit`);
  };

  const updateFrontendStatus = (status: TaskStatus) => {
    setStatus(status);
    if (status === "DONE") {
      playFireworks();
    }
  };

  return (
    <li
      draggable
      data-rank={task.rank}
      className={isDragging ? "dragging" : undefined}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="task-row">
        <button
          className="btn"
          onClick={() => setExpanded((prev) => !prev)}
          title="Expand"
        >
          <ChevronDown />
        </button>
        <button className="btn" onClick={handleDelete} title="Delete">
          <Trash2 />
        </button>
        <button className="btn" onClick={handleEdit} title="Edit">
          <Pencil />
        </button>
        <strong style={{ marginRight: "0.4em" }}>{task.rank}.</strong>
        {task.description}
        {task.category && (
          <span
            className="task-icon"
            title={categoryTitle}
            style={{ marginLeft: "auto", fontSize: "1.2rem" }}
          >
            {categoryToIcon(task.category)}
          </span>
        )}
        {/* <span style={{ color: "gray" }}>({task.status})</span> */}
        <div className={`status-select status-select--${status.toLowerCase()}`}>
          <select
            name="status"
            value={status}
            onChange={(e) => {
              updateTask({
                task_id: task.id,
                description: task.description,
                notes: task.notes,
                status: e.target.value,
                category: task.category,
                marked: task.marked,
              });
              updateFrontendStatus(e.target.value as TaskStatus);
            }}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>
          <ChevronDown className="status-select__chevron" size={14} />
        </div>
      </div>
      {expanded && (
        <div className="task-notes">
          {task.notes ? task.notes : <span style={{ color: "gray" }}>N/A</span>}
        </div>
      )}
    </li>
  );
}
