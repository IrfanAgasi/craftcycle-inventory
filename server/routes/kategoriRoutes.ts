import { Router } from 'express';
import { getAllKategori } from '../controllers/kategoriController';

const router = Router();

router.get('/', getAllKategori);

export default router;
