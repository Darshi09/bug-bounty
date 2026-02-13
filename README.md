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

