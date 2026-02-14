import Bug from '../models/Bug.js';
import Submission from '../models/Submission.js';

/**
 * @route   POST /api/bugs
 * @desc    Create a new bug
 * @access  Private
 */
export const createBug = async (req, res) => {
  try {
    const { title, description, bountyAmount } = req.body;

    if (!title || !description || !bountyAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and bounty amount'
      });
    }

    if (bountyAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Bounty amount must be greater than 0'
      });
    }

    const bug = await Bug.create({
      title,
      description,
      bountyAmount,
      createdBy: req.user.id
    });

    await bug.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: bug
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating bug'
    });
  }
};

/**
 * @route   GET /api/bugs
 * @desc    Get all bugs
 * @access  Public
 */
export const getBugs = async (req, res) => {
  try {
    const bugs = await Bug.find()
      .populate('createdBy', 'name email')
      .populate('winner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching bugs'
    });
  }
};

/**
 * @route   GET /api/bugs/:id
 * @desc    Get single bug by ID
 * @access  Public
 */
export const getBugById = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('winner', 'name email');

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }

    const submissions = await Submission.find({ bugId: bug._id })
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        bug,
        submissions
      }
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
      message: error.message || 'Server error fetching bug'
    });
  }
};
