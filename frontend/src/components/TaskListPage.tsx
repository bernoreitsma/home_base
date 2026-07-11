import { useTasks } from "../hooks/useTasks";
import { TaskList } from "./TaskList";

export function TaskListPage() {
  const { tasks, reload } = useTasks();
  return (
    <>
      <h1>Task List</h1>
      <TaskList tasks={tasks} onChanged={reload} />
    </>
  );
}
