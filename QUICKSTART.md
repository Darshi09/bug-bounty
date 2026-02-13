# Quick Start Guide

## Prerequisites Check
- ✅ Node.js installed (v16+)
- ✅ MongoDB running locally or MongoDB Atlas account

## Step-by-Step Setup

### 1. Backend Setup (Terminal 1)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from example)
cp .env.example .env

# Edit .env file with your MongoDB URI
# For local MongoDB: mongodb://localhost:27017/bugbounty
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/bugbounty

# Start the server
npm start
```

Backend should be running on `http://localhost:5000`

### 2. Frontend Setup (Terminal 2)

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file (copy from example)
cp .env.example .env

# .env should already have the correct API URL
# VITE_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

Frontend should be running on `http://localhost:5173`

### 3. Test the Application

1. Open `http://localhost:5173` in your browser
2. Register a new account
3. Create a bug bounty
4. Logout and register another account
5. Submit a solution to the bug
6. Login as the bug creator and approve the submission

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify MONGODB_URI in server/.env is correct
- For MongoDB Atlas, check your IP whitelist

### Port Already in Use
- Change PORT in server/.env (default: 5000)
- Change port in client/vite.config.js (default: 5173)

### CORS Errors
- Ensure CORS_ORIGIN in server/.env matches frontend URL
- Default: `http://localhost:5173`

### Module Not Found Errors
- Run `npm install` in both server and client directories
- Delete node_modules and package-lock.json, then reinstall

## Testing with Postman

1. Import `postman_collection.json` into Postman
2. Set `base_url` variable to `http://localhost:5000`
3. Register a user (copy the token from response)
4. Set `token` variable in Postman
5. Test all endpoints

## Common Commands

```bash
# Backend
cd server
npm start          # Start server
npm run dev        # Start with auto-reload

# Frontend
cd client
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```
