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

// ... (other imports)

app.use(cors());
app.use(express.json());

app.use('/api/inventory', inventoryRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Health Check Endpoint
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
