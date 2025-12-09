import { Router } from 'express';
import { getAllKategori, createKategori, updateKategori, deleteKategori } from '../controllers/kategoriController';

const router = Router();

router.get('/', getAllKategori);
router.post('/', createKategori);
router.put('/:id', updateKategori);
router.delete('/:id', deleteKategori);

export default router;
