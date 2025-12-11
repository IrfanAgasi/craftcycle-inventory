import { Router } from 'express';
import {
    getAllProduk,
    getProdukById,
    createProduk,
    updateProduk,
    deleteProduk,
    produksiProduk,
    getAllResep
} from '../controllers/produkController';

const router = Router();

router.get('/', getAllProduk);
router.get('/resep', getAllResep);
router.get('/:id', getProdukById);
router.post('/', createProduk);
router.put('/:id', updateProduk);
router.delete('/:id', deleteProduk);
router.post('/:id/produksi', produksiProduk);

export default router;
