import { useEffect, useState } from 'react';
import { projectService } from '../services';
import '../styles/Projects.css';

const Projects = () => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAll();
      setProjects(response.data.projects || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
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

    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      setLoading(true);
      await projectService.create({
        name: formData.name.trim(),
        description: formData.description.trim()
      });
      setSuccess('Project created successfully');
      setFormData({ name: '', description: '' });
      loadProjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p>Manage your team projects and track progress.</p>
        </div>
      </div>

      <div className="projects-grid">
        <section className="project-form-card">
          <h2>Create Project</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit} className="project-form">
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              disabled={loading}
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a short project description"
              rows="4"
              disabled={loading}
            />

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Saving...' : 'Create Project'}
            </button>
          </form>
        </section>

        <section className="project-list-card">
          <h2>Your Projects</h2>
          {loading && <div className="loading">Loading projects...</div>}
          {!loading && projects.length === 0 && <p>No projects yet. Create one above.</p>}
          <div className="project-list">
            {projects.map((project) => (
              <div key={project.id} className="project-item">
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description || 'No description provided.'}</p>
                </div>
                <span className="project-meta">Created</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Projects;
