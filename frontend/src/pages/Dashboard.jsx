import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, taskService } from '../services';
import { getUser } from '../utils/helpers';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    tasksInProgress: 0,
    completedTasks: 0,
    overdueTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);

    const fetchStats = async () => {
      try {
        const response = await taskService.getAll();
        const tasks = response.data || [];
        const overdueTasks = tasks.filter((task) => task.due_date && new Date(task.due_date) < new Date()).length;
        const inProgress = tasks.filter((task) => task.status === 'In Progress').length;
        const completed = tasks.filter((task) => task.status === 'Completed').length;

        setStats({
          totalTasks: tasks.length,
          tasksInProgress: inProgress,
          completedTasks: completed,
          overdueTasks
        });
      } catch (err) {
        setStats({
          totalTasks: 0,
          tasksInProgress: 0,
          completedTasks: 0,
          overdueTasks: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleNewProject = () => {
    navigate('/projects');
  };

  const handleNewTask = () => {
    navigate('/tasks/new');
  };

  const handleViewProjects = () => {
    navigate('/projects');
  };

  const handleViewTasks = () => {
    navigate('/tasks');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}!</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.tasksInProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card stat-card-warning">
            <div className="stat-number">{stats.overdueTasks}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleNewProject}>New Project</button>
            <button className="btn btn-primary" onClick={handleNewTask}>New Task</button>
            <button className="btn btn-secondary" onClick={handleViewProjects}>View All Projects</button>
            <button className="btn btn-secondary" onClick={handleViewTasks}>View All Tasks</button>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Recent Tasks</h2>
          <p style={{color: '#9ca3af'}}>Tasks will appear here once you create some.</p>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
