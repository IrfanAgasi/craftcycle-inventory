import { Router } from 'express';
import { upload, uploadProductImage } from '../controllers/uploadController';

const router = Router();

router.post('/product-image', upload.single('image'), uploadProductImage);

export default router;
