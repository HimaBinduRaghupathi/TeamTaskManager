const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  // Create a new user
  create: async (name, email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
          INSERT INTO users (name, email, password, role)
          VALUES (?, ?, ?, 'member')
        `;

        db.run(query, [name, email, hashedPassword], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              name,
              email,
              role: 'member',
              created_at: new Date()
            });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  // Find user by email
  findByEmail: async (email) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      db.get(query, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Find user by ID
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Get all users
  getAll: async () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, name, email, role FROM users ORDER BY name ASC';
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Verify password
  verifyPassword: async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  }
};

module.exports = User;
