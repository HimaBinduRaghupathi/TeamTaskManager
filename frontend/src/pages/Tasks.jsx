import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService, projectService, userService } from '../services';
import { formatDate, isOverdue } from '../utils/helpers';
import '../styles/Tasks.css';

const statusOptions = ['To Do', 'In Progress', 'Review', 'Completed'];
const priorityOptions = ['Low', 'Medium', 'High'];

const Tasks = ({ showForm = true }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [editedTasks, setEditedTasks] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    dueDate: '',
    priority: 'Medium'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProjects = async () => {
    try {
      const response = await projectService.getAll();
      setProjects(response.data.projects || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load projects.');
    }
  };

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load users.');
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAll();
      setTasks(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    loadUsers();
    loadTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (!formData.projectId) {
      setError('Please choose a project.');
      return;
    }

    try {
      setSaving(true);
      await taskService.create({
        title: formData.title.trim(),
        description: formData.description.trim(),
        projectId: Number(formData.projectId),
        assignedTo: formData.assignedTo || null,
        priority: formData.priority,
        dueDate: formData.dueDate || null
      });
      setSuccess('Task created successfully.');
      setFormData({
        title: '',
        description: '',
        projectId: '',
        assignedTo: '',
        dueDate: '',
        priority: 'Medium'
      });
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task.');
    } finally {
      setSaving(false);
    }
  };

  const handleTaskFieldChange = (taskId, field, value) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, [field]: value } : task))
    );
    setEditedTasks((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value
      }
    }));
  };

  const handleSaveTask = async (taskId) => {
    const changes = editedTasks[taskId];
    if (!changes) {
      return;
    }

    const payload = {};
    if (changes.title !== undefined) payload.title = changes.title;
    if (changes.description !== undefined) payload.description = changes.description;
    if (changes.status !== undefined) payload.status = changes.status;
    if (changes.priority !== undefined) payload.priority = changes.priority;
    if (changes.assigned_to !== undefined) payload.assignedTo = changes.assigned_to;
    if (changes.assignedTo !== undefined) payload.assignedTo = changes.assignedTo;
    if (changes.due_date !== undefined) payload.dueDate = changes.due_date;
    if (changes.dueDate !== undefined) payload.dueDate = changes.dueDate;

    try {
      setSaving(true);
      await taskService.update(taskId, payload);
      setSuccess('Task updated successfully.');
      setEditedTasks((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) {
      return;
    }

    try {
      setSaving(true);
      await taskService.delete(taskId);
      setSuccess('Task deleted successfully.');
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task.');
    } finally {
      setSaving(false);
    }
  };

  const pageTitle = showForm ? 'Create Task' : 'All Tasks';
  const pageDescription = showForm
    ? 'Create a new task for your project and assign it to a teammate.'
    : 'View and manage all project tasks in one place.';

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <div className="page-path">
            <span className="page-link" onClick={() => navigate('/')}>Dashboard</span>
            {' / '}
            <span className="page-link" onClick={() => navigate('/tasks')}>Tasks</span>
            {' / '}
            <span>{pageTitle}</span>
          </div>
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => navigate('/tasks/new')}>
            Create New Task
          </button>
        )}
      </div>

      <div className="tasks-grid">
        {showForm && (
          <section className="task-form-card">
            <h2>Create New Task</h2>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit} className="task-form">
            <label htmlFor="title">Task Title</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              disabled={saving}
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add task details"
              rows="4"
              disabled={saving}
            />

            <label htmlFor="projectId">Project</label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>

            <label htmlFor="assignedTo">Assign To</label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>

            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={saving}
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>

            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              disabled={saving}
            />

            <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
              {saving ? 'Saving...' : 'Create Task'}
            </button>
          </form>
        </section>
        )}

        <section className="task-list-card">
          <div className="task-list-header">
            <h2>My Tasks</h2>
            {loading && <span className="loading">Loading tasks...</span>}
          </div>

          {!loading && tasks.length === 0 && (
            <p>No tasks found. Create a task from the form.</p>
          )}

          <div className="task-list">
            {tasks.map((task) => {
              const projectName = task.project_name || 'Project';
              const assigneeName = task.assignee_name || 'Unassigned';
              const dueDateLabel = task.due_date ? formatDate(task.due_date) : 'No due date';
              const isTaskOverdue = task.due_date ? isOverdue(task.due_date) : false;
              const edited = editedTasks[task.id];

              return (
                <div key={task.id} className={`task-item ${isTaskOverdue ? 'task-overdue' : ''}`}>
                  <div className="task-info">
                    <div className="task-title-row">
                      <h3>{task.title}</h3>
                      <span className="task-badge">{task.status}</span>
                    </div>
                    <p>{task.description || 'No description provided.'}</p>
                    <div className="task-meta-row">
                      <span>{projectName}</span>
                      <span>{assigneeName}</span>
                      <span>{dueDateLabel}</span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <label>Status</label>
                    <select
                      value={task.status}
                      onChange={(e) => handleTaskFieldChange(task.id, 'status', e.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>

                    <label>Priority</label>
                    <select
                      value={task.priority}
                      onChange={(e) => handleTaskFieldChange(task.id, 'priority', e.target.value)}
                    >
                      {priorityOptions.map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>

                    <label>Assignee</label>
                    <select
                      value={task.assigned_to || ''}
                      onChange={(e) => handleTaskFieldChange(task.id, 'assigned_to', e.target.value || null)}
                    >
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>

                    <label>Due Date</label>
                    <input
                      type="date"
                      value={task.due_date ? task.due_date.split('T')[0] : ''}
                      onChange={(e) => handleTaskFieldChange(task.id, 'due_date', e.target.value || null)}
                    />

                    <div className="task-item-buttons">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleSaveTask(task.id)}
                        disabled={saving || !edited}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tasks;
