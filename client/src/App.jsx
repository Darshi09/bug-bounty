import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import BugList from './pages/BugList.jsx';
import BugDetails from './pages/BugDetails.jsx';
import CreateBug from './pages/CreateBug.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-olive-50 to-olive-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300 relative">
            <div className="relative flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<BugList />} />
                  <Route path="/bugs/:id" element={<BugDetails />} />
                  <Route
                    path="/bugs/create"
                    element={
                      <PrivateRoute>
                        <CreateBug />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
