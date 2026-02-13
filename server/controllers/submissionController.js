import Submission from '../models/Submission.js';
import Bug from '../models/Bug.js';
import User from '../models/User.js';

/**
 * @route   POST /api/bugs/:id/submissions
 * @desc    Submit a solution for a bug
 * @access  Private
 */
export const createSubmission = async (req, res) => {
  try {
    const { solutionDescription, proofUrl, proofType, proofFileName } = req.body;
    const bugId = req.params.id;

    // Validation
    if (!solutionDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide solution description'
      });
    }

    if (!proofUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide proof (image link, video link, file, or URL)'
      });
    }

    // Check if bug exists
    const bug = await Bug.findById(bugId);
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }

    // Check if bug is closed
    if (bug.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot submit solution to a closed bug'
      });
    }

    // Check if user is the bug creator
    if (bug.createdBy.toString() === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bug creator cannot submit solution to their own bug'
      });
    }

    // Create submission
    const submission = await Submission.create({
      bugId,
      submittedBy: req.user.id,
      solutionDescription,
      proofUrl,
      proofType: proofType || 'url',
      proofFileName: proofFileName || null
    });

    // Populate user info
    await submission.populate('submittedBy', 'name email');
    await submission.populate('bugId', 'title bountyAmount');

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating submission'
    });
  }
};

/**
 * @route   GET /api/bugs/:id/submissions
 * @desc    Get all submissions for a bug
 * @access  Public
 */
export const getSubmissions = async (req, res) => {
  try {
    const bugId = req.params.id;

    // Check if bug exists
    const bug = await Bug.findById(bugId);
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }

    const submissions = await Submission.find({ bugId })
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching submissions'
    });
  }
};

/**
 * @route   POST /api/submissions/:id/approve
 * @desc    Approve a submission (only bug creator can approve)
 * @access  Private
 */
export const approveSubmission = async (req, res) => {
  try {
    const submissionId = req.params.id;

    // Find submission with bug details
    const submission = await Submission.findById(submissionId).populate('bugId');
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    const bug = await Bug.findById(submission.bugId._id);
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }

    // Check if user is the bug creator
    if (bug.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only bug creator can approve submissions'
      });
    }

    // Check if bug is already closed
    if (bug.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'Bug is already closed'
      });
    }

    // Check if submission is already approved
    if (submission.status === 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Submission is already approved'
      });
    }

    // Start transaction-like operations
    // Update submission status
    submission.status = 'Approved';
    await submission.save();

    // Update bug status and winner
    bug.status = 'Closed';
    bug.winner = submission.submittedBy;
    bug.rewarded = true;
    await bug.save();

    // Update winner's total earnings
    const winner = await User.findById(submission.submittedBy);
    if (winner) {
      winner.totalEarnings += bug.bountyAmount;
      await winner.save();
    }

    // Reject all other pending submissions for this bug
    await Submission.updateMany(
      { 
        bugId: bug._id, 
        _id: { $ne: submissionId },
        status: 'Pending'
      },
      { status: 'Rejected' }
    );

    // Populate submission data for response
    await submission.populate('submittedBy', 'name email totalEarnings');
    await submission.populate('bugId', 'title bountyAmount');

    res.status(200).json({
      success: true,
      message: 'Submission approved successfully',
      data: {
        submission,
        bug,
        winner: {
          id: winner._id,
          name: winner.name,
          email: winner.email,
          totalEarnings: winner.totalEarnings
        }
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error approving submission'
    });
  }
};
