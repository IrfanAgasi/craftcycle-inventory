import { BahanSisa, KategoriBahan, RiwayatStok, User } from '../types/database';

export interface RiwayatStokExtended extends RiwayatStok {
    nama_bahan: string;
    warna: string;
    user_name: string;
}

export interface DashboardStats {
    totalBahan: number;
    totalKategori: number;
    totalProduk: number;
    stokMasukBulanIni: number;
    stokKeluarBulanIni: number;
    produksiBulanIni: number;
    rusakBulanIni: number;
    lowStockBahan: BahanSisa[];
}

const API_URL = 'http://localhost:3000/api';

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_URL}/dashboard/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
};

// --- User API ---

export const fetchUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
};

export const createUser = async (user: Omit<User, 'user_id' | 'created_at'>): Promise<void> => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
    }
};

export const updateUser = async (id: number, user: Partial<User>): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
    }
};

export const deleteUser = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
    }
};

export const loginUser = async (email: string, password: string): Promise<{ user: User; message: string }> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
};

export const fetchHistory = async (): Promise<RiwayatStokExtended[]> => {
    const response = await fetch(`${API_URL}/history`);
    if (!response.ok) {
        throw new Error('Failed to fetch history');
    }
    return response.json();
};

export const fetchInventory = async (): Promise<BahanSisa[]> => {
    const response = await fetch(`${API_URL}/inventory`);
    if (!response.ok) {
        throw new Error('Failed to fetch inventory');
    }
    return response.json();
};

export const fetchKategori = async (): Promise<KategoriBahan[]> => {
    const response = await fetch(`${API_URL}/kategori`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return response.json();
};

export const createBahan = async (data: Omit<BahanSisa, 'bahan_id' | 'created_at' | 'updated_at'>): Promise<{ message: string; id: number; data: BahanSisa }> => {
    console.log('createBahan called with:', data);
    
    const response = await fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
        let errorData;
        try {
        errorData = JSON.parse(responseText);
        } catch (e) {
        throw new Error(`Server error: ${response.status} - ${responseText}`);
        }
        throw new Error(errorData.message || errorData.error || 'Failed to create item');
    }

    return JSON.parse(responseText);
};

export const updateBahan = async (id: number, data: Partial<BahanSisa>): Promise<void> => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update item');
    }
};

export const deleteBahan = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete item');
    }
};

export const postStokMasuk = async (data: { bahan_id: number; jumlah: number; user_id: number; keterangan?: string }): Promise<void> => {
    const response = await fetch(`${API_URL}/transactions/in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to post stok masuk');
    }
};

export const postStokKeluar = async (data: { bahan_id: number; jumlah: number; user_id: number; keterangan?: string }): Promise<void> => {
    const response = await fetch(`${API_URL}/transactions/out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post stok keluar');
    }
};

export const createKategori = async (data: Omit<KategoriBahan, 'kategori_id'>): Promise<void> => {
    const response = await fetch(`${API_URL}/kategori`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create kategori');
    }
};

export const updateKategori = async (id: number, data: Partial<KategoriBahan>): Promise<void> => {
    const response = await fetch(`${API_URL}/kategori/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update kategori');
    }
};

export const deleteKategori = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/kategori/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete kategori');
    }
};