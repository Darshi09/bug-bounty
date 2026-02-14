import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white shadow-lg border-b border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="text-xl sm:text-2xl font-extrabold gradient-text">HackerRate</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <>
                <Link
                  to="/bugs/create"
                  className="text-base text-gray-700 dark:text-gray-300 hover:text-olive-600 dark:hover:text-olive-400 font-medium transition-colors duration-200 px-2 py-1"
                >
                  Create Bug
                </Link>
                <Link
                  to="/profile"
                  className="text-base text-gray-700 dark:text-gray-300 hover:text-olive-600 dark:hover:text-olive-400 font-medium transition-colors duration-200 px-2 py-1"
                >
                  Profile
                </Link>
                <span className="text-base text-gray-600 dark:text-gray-400 font-medium px-2 py-1">
                  {user?.name}
                </span>
              </>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="btn-olive text-white px-4 py-2 rounded-lg font-bold transition-all duration-200"
              >
                Logout
              </motion.button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-base text-gray-700 dark:text-gray-300 hover:text-olive-600 dark:hover:text-olive-400 font-medium transition-colors duration-200 px-2 py-1"
                >
                  Login
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="btn-olive text-white px-4 py-2 rounded-lg font-bold transition-all duration-200"
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col gap-3">
                {isAuthenticated && (
                  <>
                    <Link
                      to="/bugs/create"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base text-gray-700 dark:text-gray-300 hover:text-olive-600 dark:hover:text-olive-400 font-medium transition-colors duration-200 py-2 px-2"
                    >
                      Create Bug
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base text-gray-700 dark:text-gray-300 hover:text-olive-600 dark:hover:text-olive-400 font-medium transition-colors duration-200 py-2 px-2"
                    >
                      Profile
                    </Link>
                    <div className="text-base text-gray-600 dark:text-gray-400 font-medium py-2 px-2">
                      {user?.name}
                    </div>
                  </>
                )}
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-base text-gray-700 dark:text-gray-300 font-medium px-2">Theme</span>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    aria-label="Toggle theme"
                  >
                    {isDark ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                  </button>
                </div>

                {isAuthenticated ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="btn-olive text-white px-4 py-3 rounded-lg font-bold transition-all duration-200 w-full text-center"
                  >
                    Logout
                  </motion.button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base text-gray-700 dark:text-gray-300 hover:text-olive-600 dark:hover:text-olive-400 font-medium transition-colors duration-200 py-2 px-2 text-center"
                    >
                      Login
                    </Link>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="btn-olive text-white px-4 py-3 rounded-lg font-bold transition-all duration-200 w-full text-center block"
                      >
                        Register
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
