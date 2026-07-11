export interface Task {
  id: number;
  rank: number;
  description: string;
  notes: string | null;
  status: TaskStatus;
  marked: boolean;
  category: TaskCategory | null;
}

export type TaskCategory = "IMPORTANT" | "FUN" | "SMALL" | "URGENT";

export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface NewTask {
  description: string;
  category: TaskCategory;
}

export interface UpdateTaskPayload {
  task_id: number;
  description: string;
  notes: string | null;
  status: string;
  category: TaskCategory | null;
  marked: boolean;
}
