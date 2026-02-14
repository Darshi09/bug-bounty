import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { bugService } from '../services/bugService.js';
import { submissionService } from '../services/submissionService.js';
import { useAuth } from '../context/AuthContext.jsx';
import CreateSubmission from '../components/CreateSubmission.jsx';

const BugDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [bug, setBug] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  useEffect(() => {
    fetchBugDetails();
  }, [id]);

  const fetchBugDetails = async () => {
    try {
      setLoading(true);
      const response = await bugService.getBugById(id);
      setBug(response.data.bug);
      setSubmissions(response.data.submissions);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bug details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId) => {
    if (!window.confirm('Are you sure you want to approve this submission?')) {
      return;
    }

    try {
      await submissionService.approveSubmission(submissionId);
      await fetchBugDetails();
      alert('Submission approved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve submission');
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

  const getSubmissionStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'Approved':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'Rejected':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const isBugOwner = bug && user && bug.createdBy._id === user.id;
  const canSubmit = isAuthenticated && bug && bug.status !== 'Closed' && !isBugOwner;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-olive-600 dark:border-olive-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !bug) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8 min-h-screen"
      >
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4">
          {error || 'Bug not found'}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="text-sm sm:text-base text-olive-600 dark:text-olive-400 hover:text-olive-800 dark:hover:text-olive-300 font-medium"
        >
          ← Back to Bug List
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-screen"
    >
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        className="mb-4 sm:mb-6 text-sm sm:text-base text-olive-600 dark:text-olive-400 hover:text-olive-800 dark:hover:text-olive-300 font-medium flex items-center"
      >
        <span className="mr-2">←</span> Back to Bug List
      </motion.button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass bg-white/90 dark:bg-gray-900/90 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-olive-400/20 to-olive-600/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text mb-4 break-words overflow-wrap-anywhere">{bug.title}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${getStatusColor(
                  bug.status
                )}`}
              >
                {bug.status}
              </span>
              <span className="text-3xl font-extrabold gradient-text">
                ₹{bug.bountyAmount}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{bug.description}</p>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <p>Created by: <span className="font-bold text-gray-700 dark:text-gray-300">{bug.createdBy?.name || 'Unknown'}</span></p>
          <p>Created at: {new Date(bug.createdAt).toLocaleDateString()}</p>
          {bug.winner && (
            <p className="text-green-600 dark:text-green-400 font-bold mt-3 text-lg">
              🏆 Winner: {bug.winner.name}
            </p>
          )}
        </div>
        </div>
      </motion.div>

      {canSubmit && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass bg-white/90 dark:bg-gray-900/90 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl"
        >
          {!showSubmissionForm ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSubmissionForm(true)}
              className="w-full btn-olive text-white font-bold py-4 px-6 rounded-xl transition-all duration-200"
            >
              Submit Solution
            </motion.button>
          ) : (
            <CreateSubmission
              bugId={bug._id}
              onSuccess={() => {
                setShowSubmissionForm(false);
                fetchBugDetails();
              }}
              onCancel={() => setShowSubmissionForm(false)}
            />
          )}
        </motion.div>
      )}

      {bug.status === 'Closed' && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg mb-6"
        >
          This bug is closed. No new submissions are allowed.
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass bg-white/90 dark:bg-gray-900/90 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold gradient-text mb-4 sm:mb-6 break-words">
          Submissions ({submissions.length})
        </h2>

        {submissions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission, index) => (
              <motion.div
                key={submission._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl card-hover mb-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      {submission.submittedBy?.name || 'Unknown'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {new Date(submission.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getSubmissionStatusColor(
                      submission.status
                    )}`}
                  >
                    {submission.status}
                  </span>
                </div>

                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Solution:
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {submission.solutionDescription}
                  </p>
                </div>

                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Proof ({submission.proofType || 'url'}):
                  </p>
                  {submission.proofType === 'image' ? (
                    <div className="mt-2">
                      <img
                        src={submission.proofUrl}
                        alt="Proof"
                        className="w-full max-w-full h-auto max-h-64 sm:max-h-96 rounded-md border border-gray-300 dark:border-gray-600 mb-2"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <a
                        href={submission.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-olive-600 dark:text-olive-400 hover:text-olive-800 dark:hover:text-olive-300 break-all text-sm"
                        style={{ display: 'none' }}
                      >
                        {submission.proofUrl}
                      </a>
                    </div>
                  ) : submission.proofType === 'video' ? (
                    <div className="mt-2">
                      <a
                        href={submission.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-olive-600 dark:text-olive-400 hover:text-olive-800 dark:hover:text-olive-300 break-all inline-flex items-center"
                      >
                        {submission.proofUrl}
                      </a>
                    </div>
                  ) : submission.proofType === 'file' ? (
                    <div className="mt-2">
                      <a
                        href={submission.proofUrl}
                        download={submission.proofFileName || 'proof'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 break-all inline-flex items-center bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded border border-gray-300 dark:border-gray-600"
                      >
                        <span className="mr-2">📄</span>
                        {submission.proofFileName || 'Download File'}
                      </a>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-all">
                        {submission.proofUrl.substring(0, 100)}...
                      </p>
                    </div>
                  ) : (
                    <a
                      href={submission.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 break-all"
                    >
                      {submission.proofUrl}
                    </a>
                  )}
                </div>

                {isBugOwner &&
                  bug.status !== 'Closed' &&
                  submission.status === 'Pending' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(submission._id)}
                      className="mt-2 btn-olive text-white font-bold py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm transition-all duration-200 w-full sm:w-auto"
                    >
                      Approve Submission
                    </motion.button>
                  )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BugDetails;
