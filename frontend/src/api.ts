import type { NewTask, Task, TaskCategory, UpdateTaskPayload } from "./types";

export const CATEGORIES: {
  value: TaskCategory;
  icon: string;
  title: string;
}[] = [
  { value: "IMPORTANT", icon: "💼", title: "Important" },
  { value: "FUN", icon: "🙂", title: "Fun" },
  { value: "SMALL", icon: "🤏", title: "Small" },
  { value: "URGENT", icon: "🚨", title: "Urgent" },
];

function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function request(url: string, options: RequestInit): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCsrfToken(),
      ...(options.headers ?? {}),
    },
  });
  return response;
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch("/tasks/api/tasks");
  if (!response.ok) {
    throw new Error(`Error loading tasks: ${response.statusText}`);
  }
  return response.json();
}

export async function getDashboardTasks(): Promise<Task[]> {
  const response = await fetch("/tasks/api/dashboard");
  if (!response.ok) {
    throw new Error(`Error loading dashboard: ${response.statusText}`);
  }
  return response.json();
}

export async function createTask(payload: NewTask): Promise<Task> {
  const response = await request("/tasks/api/task", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Error creating task: ${response.statusText}`);
  }
  return response.json();
}

export async function updateTask(payload: UpdateTaskPayload): Promise<Task> {
  const response = await request("/tasks/api/task", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Error updating task: ${response.statusText}`);
  }
  return response.json();
}

export async function deleteTask(taskId: number): Promise<void> {
  const response = await request("/tasks/api/task", {
    method: "DELETE",
    body: JSON.stringify({ task_id: taskId }),
  });
  if (!response.ok) {
    throw new Error(`Error deleting task: ${response.statusText}`);
  }
}

export async function updateOrder(taskIds: number[]): Promise<void> {
  const response = await request("/tasks/api/update-order", {
    method: "POST",
    body: JSON.stringify({ task_ids: taskIds }),
  });
  if (!response.ok) {
    throw new Error(`Error updating order: ${response.statusText}`);
  }
}

export function categoryToIcon(category: TaskCategory | null): string {
  return CATEGORIES.find((c) => c.value === category)?.icon ?? "";
}
