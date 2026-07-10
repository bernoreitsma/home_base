import type { NewTask, Task, TaskCategory } from "./types";

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

export async function deleteTask(taskRank: number): Promise<void> {
  const response = await request("/tasks/api/task", {
    method: "DELETE",
    body: JSON.stringify({ task_rank: taskRank }),
  });
  if (!response.ok) {
    throw new Error(`Error deleting task: ${response.statusText}`);
  }
}

export async function updateOrder(newOrder: number[]): Promise<void> {
  const response = await request("/tasks/api/update-order", {
    method: "POST",
    body: JSON.stringify({ new_order: newOrder }),
  });
  if (!response.ok) {
    throw new Error(`Error updating order: ${response.statusText}`);
  }
}

export function categoryToIcon(category: TaskCategory | null): string {
  switch (category) {
    case "IMPORTANT":
      return "💼";
    case "FUN":
      return "🙂";
    case "SMALL":
      return "🤏";
    case "URGENT":
      return "🚨";
    default:
      return "";
  }
}
