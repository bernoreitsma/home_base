// Mirrors the DRF TaskSerializer (fields = '__all__') in
// home_base/tasks/apis/task.py.
export interface Task {
  id: number;
  rank: number;
  description: string;
  notes: string | null;
  status: string;
  marked: boolean;
  category: TaskCategory | null;
}

// The model stores upper-case categories; the create form submits title-case
// values, which the backend's pydantic model upper-cases before validation.
export type TaskCategory = "IMPORTANT" | "FUN" | "SMALL" | "URGENT";

export interface NewTask {
  description: string;
  // Title-case as sent by the <select> (e.g. "Fun"); normalized server-side.
  category: string;
}
