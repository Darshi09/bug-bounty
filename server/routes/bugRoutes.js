import express from 'express';
import { createBug, getBugs, getBugById } from '../controllers/bugController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, createBug);
router.get('/', getBugs);
router.get('/:id', getBugById);

export default router;
