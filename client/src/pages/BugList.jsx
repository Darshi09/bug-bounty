import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { bugService } from '../services/bugService.js';

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const response = await bugService.getBugs();
      setBugs(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bugs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'In Review':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'Closed':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-olive-600 dark:border-olive-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading bugs...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-screen"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text mb-2 break-words">
            Bug Bounties
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Discover and solve security vulnerabilities
          </p>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      {bugs.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No bugs available yet.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {bugs.map((bug, index) => (
            <motion.div
              key={bug._id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link
                to={`/bugs/${bug._id}`}
                className="block glass bg-white/90 dark:bg-gray-800/90 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl card-hover p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden group"
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="shimmer absolute inset-0"></div>
                </div>
                <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1 break-words">
                    {bug.title}
                  </h2>
                  <span
                    className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-md ${getStatusColor(
                      bug.status
                    )}`}
                  >
                    {bug.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {bug.description}
                </p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <span className="text-2xl sm:text-3xl font-extrabold gradient-text">
                    ₹{bug.bountyAmount}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                    by {bug.createdBy?.name || 'Unknown'}
                  </span>
                </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default BugList;
