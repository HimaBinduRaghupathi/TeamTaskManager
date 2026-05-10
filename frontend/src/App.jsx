import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  LoginPage,
  SignupPage,
  DashboardPage,
  ProjectsPage,
  ProjectDetailsPage,
  TasksPage,
  NotFoundPage
} from './pages/index';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute element={<DashboardPage />} />} />
        <Route path="/projects" element={<ProtectedRoute element={<ProjectsPage />} />} />
        <Route path="/projects/:id" element={<ProtectedRoute element={<ProjectDetailsPage />} />} />
        <Route path="/tasks" element={<ProtectedRoute element={<TasksPage showForm={false} />} />} />
        <Route path="/tasks/new" element={<ProtectedRoute element={<TasksPage showForm={true} />} />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
