import { Navigate, Route, Routes } from "react-router-dom";
import { TaskListPage } from "./components/TaskListPage";
import { DashboardPage } from "./components/DashboardPage";
import { EditTaskPage } from "./components/EditTaskPage";

export function App() {
  return (
    <Routes>
      <Route path="/tasks" element={<TaskListPage />} />
      <Route path="/tasks/dashboard" element={<DashboardPage />} />
      <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}
