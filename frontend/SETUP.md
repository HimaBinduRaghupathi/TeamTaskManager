# Frontend Setup Guide

## Prerequisites
- Node.js (v16+)
- npm

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

The `.env` file is already configured for local development:
```env
VITE_API_URL=http://localhost:5000/api
```

For production, update to your deployed backend URL:
```env
VITE_API_URL=https://your-backend-url/api
```

### 3. Run the Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

## Project Structure

```
src/
├── pages/              # Page components (Login, Dashboard, etc)
├── components/         # Reusable components (ProtectedRoute, etc)
├── services/           # API service layer
├── utils/              # Helper functions
├── styles/             # CSS files
├── App.jsx             # Main app component with routing
└── main.jsx            # Entry point
```

## Available Routes

### Public Routes
- `/login` - User login page
- `/signup` - User registration page

### Protected Routes (require login)
- `/` - Dashboard
- `/projects` - Projects page
- `/projects/:id` - Project details
- `/tasks` - Tasks page

## Authentication Flow

1. User enters credentials on Login/Signup page
2. Frontend sends request to backend API
3. Backend returns JWT token
4. Token is stored in localStorage
5. Token is automatically sent in Authorization header for all API requests
6. ProtectedRoute component checks for token before showing pages

## API Service

All API calls go through `src/services/api.js` which handles:
- Base URL configuration
- Token attachment to requests
- Error handling

Available services:
- `authService.signup(userData)`
- `authService.login(credentials)`
- `authService.logout()`
- `projectService.getAll()`
- `taskService.getAll()`
- More to be implemented...

## Environment Variables

- `VITE_API_URL` - Backend API base URL (used in src/services/api.js)

## Troubleshooting

### Port Already in Use
Add a custom port:
```bash
npm run dev -- --port 3000
```

### API Connection Errors
- Check if backend is running on http://localhost:5000
- Verify VITE_API_URL in .env file
- Check browser console for CORS errors

### Login Not Working
- Ensure backend is running
- Verify database is set up and running
- Check browser localStorage to see if token is being stored

## Production Deployment

For Railway deployment:
1. Build the project: `npm run build`
2. Set environment variables in Railway dashboard
3. Set build command: `npm run build`
4. Set start command: `npm run preview` or use Railway's static site hosting

See root README.md for full deployment instructions.
