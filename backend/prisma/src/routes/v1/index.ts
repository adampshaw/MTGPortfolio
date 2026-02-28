import { Router } from 'express';
import cardRoutes from './card.routes';

const router = Router();

router.use('/cards', cardRoutes);
router.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

export default router;