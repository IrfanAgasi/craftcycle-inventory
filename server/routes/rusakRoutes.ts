import express from 'express';
import { getBahanRusak, getBahanRusakById } from '../controllers/rusakController';

const router = express.Router();

router.get('/bahan-rusak', getBahanRusak);
router.get('/bahan-rusak/:id', getBahanRusakById);

export default router;