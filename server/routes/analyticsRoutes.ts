import express from 'express';
import { getMonthlyTrends, getTopMaterials, getCategoryDistribution, getUserPerformance } from '../controllers/analyticsController';

const router = express.Router();

router.get('/trends', getMonthlyTrends);
router.get('/top-materials', getTopMaterials);
router.get('/categories', getCategoryDistribution);
router.get('/performance', getUserPerformance);

export default router;
