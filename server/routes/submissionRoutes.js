import express from 'express';
import { createSubmission, getSubmissions } from '../controllers/submissionController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:id/submissions', protect, createSubmission);
router.get('/:id/submissions', getSubmissions);

export default router;
