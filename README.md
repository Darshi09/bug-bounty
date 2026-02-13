# Bug Bounty Web Platform

A full-stack web application for managing bug bounties, submissions, and rewards. Built with Node.js/Express backend and React frontend.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Bug Management**: Create and view bug bounties with descriptions and reward amounts
- **Submission System**: Users can submit solutions for bugs (except their own)
- **Review & Approval**: Bug creators can approve submissions and award bounties
- **Earnings Tracking**: Automatic tracking of user earnings from approved submissions
- **Status Management**: Bugs can be Open, In Review, or Closed

## 📋 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router DOM

## 📁 Project Structure

```
bug-bounty-platform/
├── server/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bugController.js
│   │   ├── submissionController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Bug.js
│   │   └── Submission.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bugRoutes.js
│   │   ├── submissionRoutes.js
│   │   ├── approvalRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── CreateSubmission.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── BugList.jsx
│   │   │   ├── BugDetails.jsx
│   │   │   ├── CreateBug.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── bugService.js
│   │   │   └── submissionService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bugbounty
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:5173
```

5. Make sure MongoDB is running on your system.

6. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```bash
cp .env.example .env
```

4. Update `.env` with your API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Bugs
- `POST /api/bugs` - Create a new bug (Protected)
- `GET /api/bugs` - Get all bugs
- `GET /api/bugs/:id` - Get bug by ID with submissions

### Submissions
- `POST /api/bugs/:id/submissions` - Submit a solution (Protected)
- `GET /api/bugs/:id/submissions` - Get all submissions for a bug

### Approval
- `POST /api/submissions/:id/approve` - Approve a submission (Protected, Bug Owner Only)

### User
- `GET /api/users/me` - Get current user profile (Protected)

### Health Check
- `GET /api/health` - Server health check

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

Tokens are automatically stored in localStorage after login/registration and included in all API requests.

## 📝 API Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Bug
```bash
POST /api/bugs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "SQL Injection Vulnerability",
  "description": "Found SQL injection in login form",
  "bountyAmount": 500
}
```

### Submit Solution
```bash
POST /api/bugs/:bugId/submissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "solutionDescription": "Use parameterized queries",
  "proofUrl": "https://example.com/proof"
}
```

## 🎯 Business Rules

1. **Bug Creation**: Only authenticated users can create bugs
2. **Submission Rules**:
   - Bug creators cannot submit solutions to their own bugs
   - Multiple users can submit solutions to the same bug
   - Submissions are not allowed for closed bugs
3. **Approval Process**:
   - Only the bug creator can approve submissions
   - Only one submission can be approved per bug
   - On approval:
     - Submission status changes to "Approved"
     - Bug status changes to "Closed"
     - Winner's totalEarnings increases by bountyAmount
     - All other pending submissions are automatically rejected
4. **Status Flow**:
   - Bugs start as "Open"
   - Can be manually set to "In Review" (if needed)
   - Automatically set to "Closed" when a submission is approved

## 🧪 Testing with Postman

A Postman collection is included in the project. Import `postman_collection.json` into Postman to test all endpoints.

### Postman Setup:
1. Import the collection
2. Set the `base_url` variable to `http://localhost:5000`
3. Register a user first
4. Copy the token from the register/login response
5. Set the `token` variable in Postman
6. Use the token in the Authorization header for protected routes

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes with middleware
- Input validation
- CORS configuration
- Error handling without exposing stack traces

## 📊 Data Models

### User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `totalEarnings` (Number, default: 0)
- `createdAt` (Date)

### Bug
- `title` (String, required)
- `description` (String, required)
- `bountyAmount` (Number, required)
- `status` (Enum: Open, In Review, Closed)
- `createdBy` (User reference)
- `winner` (User reference, nullable)
- `rewarded` (Boolean, default: false)
- `createdAt` (Date)

### Submission
- `bugId` (Bug reference)
- `submittedBy` (User reference)
- `solutionDescription` (String, required)
- `proofUrl` (String, required)
- `status` (Enum: Pending, Approved, Rejected)
- `createdAt` (Date)

## 🐛 Known Limitations

1. No email verification
2. No password reset functionality
3. No file upload - proof URLs must be external links
4. No pagination for bug/submission lists
5. No search/filter functionality
6. No real-time notifications
7. No admin panel
8. Single approval per bug (by design)

## 🚧 Future Enhancements

- Email notifications for submissions and approvals
- File upload for proof documents
- Pagination and search functionality
- Real-time updates using WebSockets
- Admin dashboard
- Bug categories and tags
- Comment system
- Rating/review system for submissions

## 📄 License

ISC

## 👤 Author

Built as a full-stack project demonstration.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and enhance!
