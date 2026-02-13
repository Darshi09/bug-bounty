import express from 'express';
import { approveSubmission } from '../controllers/submissionController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:id/approve', protect, approveSubmission);

export default router;
