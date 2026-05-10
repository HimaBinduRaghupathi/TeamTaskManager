const db = require('../config/database');

const Task = {
  create: async ({ title, description, projectId, assignedTo, status, priority, dueDate }) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO tasks (title, description, project_id, assigned_to, status, priority, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.run(query, [title, description, projectId, assignedTo || null, status, priority, dueDate || null], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            title,
            description,
            project_id: projectId,
            assigned_to: assignedTo || null,
            status,
            priority,
            due_date: dueDate || null,
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      });
    });
  },

  getAllForUser: async (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date,
               t.project_id, t.assigned_to, t.created_at, t.updated_at,
               p.name AS project_name,
               u.name AS assignee_name
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.assigned_to = ? OR p.creator_id = ?
        ORDER BY t.due_date IS NULL, t.due_date ASC, t.created_at DESC
      `;
      db.all(query, [userId, userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  getById: async (id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t.*, p.name AS project_name, u.name AS assignee_name
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.id = ?
      `;
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  update: async (id, fields) => {
    const updates = [];
    const values = [];

    if (fields.title !== undefined) {
      updates.push('title = ?');
      values.push(fields.title);
    }
    if (fields.description !== undefined) {
      updates.push('description = ?');
      values.push(fields.description);
    }
    if (fields.status !== undefined) {
      updates.push('status = ?');
      values.push(fields.status);
    }
    if (fields.priority !== undefined) {
      updates.push('priority = ?');
      values.push(fields.priority);
    }
    if (fields.due_date !== undefined) {
      updates.push('due_date = ?');
      values.push(fields.due_date);
    }
    if (fields.assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      values.push(fields.assigned_to || null);
    }

    return new Promise((resolve, reject) => {
      if (updates.length === 0) {
        resolve(null);
        return;
      }
      const query = `UPDATE tasks SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      values.push(id);
      db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  delete: async (id) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM tasks WHERE id = ?';
      db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }
};

module.exports = Task;
