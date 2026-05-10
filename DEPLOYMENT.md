# Deployment Guide

This guide covers deploying the Team Task Manager application to production.

## Architecture Overview

- **Backend**: Node.js/Express API with SQLite database
- **Frontend**: React/Vite SPA
- **Database**: SQLite (file-based, suitable for small deployments)

## Recommended Deployment Platforms

### Option 1: Heroku (Easiest)

#### Backend Deployment

1. **Create Heroku Account**
   - Sign up at https://heroku.com

2. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   heroku --version
   ```

3. **Prepare Backend for Deployment**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your_super_secret_jwt_key_here
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

6. **Check Logs**
   ```bash
   heroku logs --tail
   ```

Backend URL: `https://your-app-name-backend.herokuapp.com`

#### Frontend Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Prepare Frontend**
   ```bash
   cd frontend
   # Update .env for production
   echo "VITE_API_URL=https://your-app-name-backend.herokuapp.com/api" > .env
   ```

3. **Deploy**
   ```bash
   vercel
   # Follow prompts, choose "Yes" for all questions
   ```

Frontend URL: Provided by Vercel (e.g., `https://your-app.vercel.app`)

### Option 2: Railway (Modern Alternative)

#### Backend + Frontend Deployment

1. **Create Railway Account**
   - Sign up at https://railway.app

2. **Connect GitHub Repository**
   - Push your code to GitHub
   - Connect repo to Railway

3. **Configure Environment Variables**
   - JWT_SECRET: your_secret_key
   - NODE_ENV: production
   - For frontend: VITE_API_URL=https://your-backend-service.railway.app/api

4. **Deploy**
   - Railway auto-deploys on git push

### Option 3: VPS (DigitalOcean, Linode, etc.)

#### Backend Setup

1. **Provision VPS**
   - Ubuntu 20.04+, 1GB RAM minimum

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Deploy Backend**
   ```bash
   # On your server
   git clone your-repo
   cd backend
   npm install --production
   npm start
   ```

4. **Use PM2 for Process Management**
   ```bash
   sudo npm install -g pm2
   pm2 start src/server.js --name "team-task-manager"
   pm2 startup
   pm2 save
   ```

5. **Configure Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

#### Frontend Deployment

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve Static Files**
   - Use Nginx to serve `dist/` folder
   - Or use a static file host

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRATION=7d
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url/api
```

## Database Considerations

SQLite is file-based and works well for small applications. For larger deployments:

- **Option 1**: Use Railway's PostgreSQL or Heroku Postgres
- **Option 2**: Switch to PostgreSQL and update `database.js`

## Security Checklist

- [ ] Change JWT_SECRET to a strong, random key
- [ ] Use HTTPS in production
- [ ] Set NODE_ENV=production
- [ ] Don't commit .env files
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for your frontend domain

## Monitoring

- **Heroku**: `heroku logs --tail`
- **Railway**: Built-in logs and metrics
- **VPS**: Use PM2 logs or set up monitoring

## Troubleshooting

### Common Issues

1. **Port conflicts**: Check if port 5000 is available
2. **Database errors**: Ensure SQLite file permissions
3. **CORS errors**: Update CORS settings for production domain
4. **Build failures**: Check Node.js version compatibility

### Logs

```bash
# Heroku
heroku logs --tail

# Railway
# Check in dashboard

# VPS with PM2
pm2 logs team-task-manager
```

## Cost Estimates

- **Heroku**: ~$7/month (free tier available)
- **Railway**: ~$5/month
- **Vercel**: Free for frontend
- **VPS**: ~$5/month (DigitalOcean)