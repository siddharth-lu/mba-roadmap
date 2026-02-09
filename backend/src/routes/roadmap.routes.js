import { Router } from 'express';
import { createRoadmap, getRoadmapBySlug } from '../controllers/roadmap.controller.js';

const router = Router();

router.post('/create', createRoadmap);
router.get('/:slug', getRoadmapBySlug);

export default router;
