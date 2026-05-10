# Backend Setup Guide

## Prerequisites
- Node.js (v16+)
- npm

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Update `.env` file with your settings:
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRATION=7d
```

The database is SQLite and will be created automatically in the `database.db` file.

### 3. Run the Server

Development (with auto-reload):
```bash
npm run dev
```

Production:
```bash
npm start
```

Server will run on `http://localhost:5000`

## Testing the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Database

SQLite database file (`database.db`) is created automatically when the server starts. No manual setup required.

## Troubleshooting

### Port Already in Use
Change the port in `.env`:
```
PORT=5001
```

### Database Issues
Delete `database.db` file and restart the server to recreate the schema.

### Port Already in Use
Change PORT in .env file

## Database Schema

- **users** - User accounts
- **projects** - Projects created by users
- **project_members** - Users assigned to projects
- **tasks** - Tasks within projects

See `src/config/schema.sql` for full schema.
