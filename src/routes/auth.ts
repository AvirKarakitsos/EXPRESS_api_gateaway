import express from 'express';
import { login, signup, index } from '../controllers/auth';

const router = express.Router();

router.get('/test', index);

router.post('/signup', signup);
router.post('/login', login);

export default router;