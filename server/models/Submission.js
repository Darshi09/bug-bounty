import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  bugId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bug',
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  solutionDescription: {
    type: String,
    required: [true, 'Solution description is required'],
    trim: true
  },
  proofType: {
    type: String,
    enum: ['image', 'video', 'file', 'url'],
    default: 'url'
  },
  proofUrl: {
    type: String,
    required: [true, 'Proof URL is required'],
    trim: true
  },
  proofFileName: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
submissionSchema.index({ bugId: 1, status: 1 });
submissionSchema.index({ submittedBy: 1 });

export default mongoose.model('Submission', submissionSchema);
