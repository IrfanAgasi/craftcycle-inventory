import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkConnection } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import inventoryRoutes from './routes/inventoryRoutes';
import kategoriRoutes from './routes/kategoriRoutes';
import transactionRoutes from './routes/transactionRoutes';
import historyRoutes from './routes/historyRoutes';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import userRoutes from './routes/userRoutes';
import rusakRoutes from './routes/rusakRoutes';
import produkRoutes from './routes/produkRoutes';
import uploadRoutes from './routes/uploadRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import path from 'path';

app.use(cors());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api/inventory', inventoryRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api', rusakRoutes);
app.use('/api/produk', produkRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', async (req, res) => {
    const dbStatus = await checkConnection();
    res.json({
        status: 'ok',
        database: dbStatus ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    checkConnection();
});
