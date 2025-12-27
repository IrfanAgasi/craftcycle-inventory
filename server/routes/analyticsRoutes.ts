import express from 'express';
import { getMonthlyTrends, getWeeklyTrends, getTopMaterials, getTopProducts, getCategoryDistribution, getUserPerformance } from '../controllers/analyticsController';

const router = express.Router();

router.get('/trends', getMonthlyTrends);
router.get('/trends/weekly', getWeeklyTrends);
router.get('/top-materials', getTopMaterials);
router.get('/top-products', getTopProducts);
router.get('/categories', getCategoryDistribution);
router.get('/performance', getUserPerformance);

export default router;

