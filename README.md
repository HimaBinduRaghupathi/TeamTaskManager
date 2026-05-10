# Team Task Manager

A full-stack web application for managing projects and tasks with role-based access control (Admin/Member).

## 🚀 Live Demo

**[View Live Application](https://your-railway-app-url.vercel.app)** *(Replace with your actual Railway URL after deployment)*

## 🎯 Features

- ✅ User Authentication (Signup/Login)
- ✅ Project Management
- ✅ Task Creation & Assignment
- ✅ Role-Based Access Control (Admin/Member)
- ✅ Dashboard with task tracking
- ✅ Status Management (To Do, In Progress, Review, Completed)
- ✅ Overdue Task Tracking
- ✅ Priority Levels (Low/Medium/High)

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- SQLite (file-based database)
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React + Vite
- React Router for navigation
- Axios for API calls
- CSS for styling

## 🌐 Railway Deployment

### Step 1: Push to GitHub
```bash
# Create a new repository on GitHub
# Then push your code:
git remote add origin https://github.com/yourusername/team-task-manager.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Railway

1. **Create Railway Account**
   - Go to [Railway.app](https://railway.app) and sign up/login

2. **Connect Repository**
   - Click "New Project" → "Deploy from GitHub repo"
   - Connect your GitHub account and select the repository

3. **Configure Environment Variables**
   - Go to your project settings → Variables
   - Add these variables:
     ```
     NODE_ENV=production
     JWT_SECRET=your_super_secure_jwt_secret_key_here
     DATABASE_PATH=./database.db
     ```

4. **Deploy**
   - Railway will automatically detect and deploy your app
   - The build process will install dependencies and build the frontend
   - Your app will be live at the generated Railway URL

### Step 3: Update Live Demo URL
- After deployment, update the "Live Demo" link above with your Railway URL

## 📁 Project Structure

```
TeamTaskManager/
├── backend/
│   ├── src/
│   │   ├── server.js           # Main server file
│   │   ├── config/
│   │   │   └── database.js     # SQLite connection & schema
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Auth & validation
│   │   └── models/             # DB queries
│   ├── package.json
│   ├── .env                    # Environment variables
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── pages/              # Page components
    │   ├── components/         # Reusable components
    │   ├── services/           # API calls
    │   ├── utils/              # Utilities
    │   ├── styles/             # CSS files
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update `.env` with your JWT secret:
   ```
   JWT_SECRET=your_secret_key_here_change_in_production
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm run dev    # Development with auto-reload
   npm start      # Production
   ```

Server runs on `http://localhost:5000`. SQLite database is created automatically.

### Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API endpoint in `.env` if needed:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all projects for user
- `POST /api/projects` - Create project

### Tasks
- `GET /api/tasks` - Get tasks for user
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users` - Get all users (for assignment)

## 🗄️ Database Schema

SQLite tables are created automatically:
- **users**: id, name, email, password (hashed), role, created_at
- **projects**: id, name, description, creator_id, created_at, updated_at
- **project_members**: id, project_id, user_id, role, joined_at
- **tasks**: id, title, description, project_id, assigned_to, status, priority, due_date, created_at, updated_at

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

- **Heroku + Vercel**: Backend on Heroku, frontend on Vercel
- **Railway**: Full-stack deployment with auto-scaling
- **VPS**: Manual setup for full control

## 📧 Support

For issues or questions, please create an issue in the GitHub repository.

**Happy Coding! 🎉**
