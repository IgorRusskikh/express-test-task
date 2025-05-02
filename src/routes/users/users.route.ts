import { Router } from 'express';
import { asyncHandler } from '@src/middleware/error.middleware';
import { profile } from '@src/controllers/users/users.controller';

const router = Router();

router.get('/info', asyncHandler(profile));

export default router;
