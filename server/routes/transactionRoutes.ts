import { Router } from 'express';
import { stokMasuk, stokKeluar } from '../controllers/transactionController';

const router = Router();

router.post('/in', stokMasuk);
router.post('/out', stokKeluar);

export default router;
