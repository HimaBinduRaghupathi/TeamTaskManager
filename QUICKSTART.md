# Quick Start & Testing Guide

## Prerequisites
- Node.js v16+
- npm

## Step 1: Set Up Database

SQLite database is created automatically when the backend starts. No manual setup required.

## Step 2: Run Backend

```bash
cd backend
npm run dev
```

Expected output:
```
Connected to SQLite database
Database schema initialized
Server is running on port 5000
```

### Test with curl:
```bash
curl http://localhost:5000/api/health
```

## Step 3: Run Frontend

Open a new terminal:
```bash
cd frontend
npm run dev
```

Expected output:
```
Local: http://localhost:5173/
```

## Step 4: Test the Application

### Option A: Via Browser
1. Open http://localhost:5173
2. Should redirect to login page
3. Click "Sign up" to create an account
4. Fill in form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm: password123
5. Click "Sign Up"
6. Should redirect to Dashboard

### Option B: Via API (curl)

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "password":"password123"
  }'
```

Response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"password123"
  }'
```

**Create Project:**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name":"My First Project",
    "description":"A sample project"
  }'
```

**Create Task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title":"Sample Task",
    "description":"Task description",
    "projectId":1,
    "priority":"Medium",
    "dueDate":"2024-12-31"
  }'
```

## Troubleshooting

### Backend Issues
- Check if port 5000 is available
- Delete `database.db` file and restart to recreate schema

### Frontend Issues
- Ensure backend is running on port 5000
- Check browser console for errors

### Database Issues
- SQLite file is `backend/database.db`
- Schema is created automatically on startup
    "email": "john@example.com",
    "role": "member"
  }
}
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"password123"
  }'
```

## Step 5: Verify Everything Works

✅ **Backend checks:**
- [ ] Server runs on port 5000
- [ ] Database has users table with data
- [ ] Login returns JWT token

✅ **Frontend checks:**
- [ ] Login page loads
- [ ] Signup creates account
- [ ] Dashboard displays after login
- [ ] Logout button works
- [ ] Protected routes redirect to login

## Database Inspection

Check inserted users:
```bash
psql -U postgres -d team_task_manager
SELECT * FROM users;
```

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
- PostgreSQL not running
- Wrong DATABASE_URL in .env

### Error: "Email already registered"
- User already exists in database
- Use different email or reset database:
  ```sql
  DELETE FROM users;
  ```

### Error: "Invalid email or password"
- Check email/password are correct
- Verify user exists in database

### Port 5000/5173 already in use
- Kill process or change PORT in .env files

## Next: Build Projects & Tasks

Once authentication is working, build:
1. Project management (create, list, add members)
2. Task management (CRUD operations)
3. Dashboard data connection
4. Deployment to Railway

See project README.md for next steps!
