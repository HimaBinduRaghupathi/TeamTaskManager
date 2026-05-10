const db = require('../config/database');

const Project = {
  create: async (name, description, creatorId) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO projects (name, description, creator_id)
        VALUES (?, ?, ?)
      `;
      db.run(query, [name, description, creatorId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            name,
            description,
            creator_id: creatorId,
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      });
    });
  },

  getAllByUser: async (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id, name, description, creator_id, created_at, updated_at
        FROM projects
        WHERE creator_id = ?
        ORDER BY created_at DESC
      `;
      db.all(query, [userId], (err, rows) => {
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
        SELECT id, name, description, creator_id, created_at, updated_at
        FROM projects
        WHERE id = ?
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

  findById: async (id) => {
    return Project.getById(id);
  }
};

module.exports = Project;
