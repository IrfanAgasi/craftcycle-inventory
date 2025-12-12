import { BahanSisa, KategoriBahan, RiwayatStok, User, BahanRusak } from '../types/database';

export interface RiwayatStokExtended extends RiwayatStok {
    nama_bahan: string;
    warna: string;
    berat_ukuran?: string;
    user_name: string;
    user_role: string;
}

export interface DashboardStats {
    totalBahan: number;
    totalKategori: number;
    totalProduk: number;
    stokMasukBulanIni: number;
    stokKeluarBulanIni: number;
    totalStokProduk: number;
    rusakBulanIni: number;
    lowStockBahan: BahanSisa[];
}

export interface BahanRusakExtended {
    rusak_id: number;
    bahan_id: number;
    jumlah: number;
    alasan: string;
    user_id: number;
    tanggal_rusak: string;
    nama_bahan: string;
    warna: string;
    berat_ukuran: string;
    user_name: string;
    user_role: string;
}

const API_URL = 'http://localhost:3000/api';

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_URL}/dashboard/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
};

export const uploadProductImage = async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload/product-image`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    return response.json();
};


// --- User API ---

export const fetchUsers = async (status?: 'active' | 'deleted'): Promise<User[]> => {
    const url = status ? `${API_URL}/users?status=${status}` : `${API_URL}/users`;
    const response = await fetch(url);
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

export const restoreUser = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}/restore`, {
        method: 'PUT',
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to restore user');
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

export const deleteBahan = async (id: number, user_id: number): Promise<{ deletedStock: number; bahanName: string }> => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to delete item');
    }
    return response.json();
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

export const fetchBahanRusak = async (): Promise<BahanRusakExtended[]> => {
    const response = await fetch(`${API_URL}/bahan-rusak`);
    if (!response.ok) {
        throw new Error('Failed to fetch bahan rusak');
    }
    return response.json();
};

// --- Produk Jadi API ---

export const fetchProduk = async () => {
    const response = await fetch(`${API_URL}/produk`);
    if (!response.ok) {
        throw new Error('Failed to fetch produk');
    }
    return response.json();
};

export const fetchProdukById = async (id: number) => {
    const response = await fetch(`${API_URL}/produk/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch produk');
    }
    return response.json();
};

export const createProduk = async (data: {
    nama_produk: string;
    harga_jual: number;
    gambar_url?: string;
    resep: { bahan_id: number; jumlah_bahan: number }[];
}) => {
    try {
        const response = await fetch(`${API_URL}/produk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create produk');
            } else {
                const text = await response.text();
                console.error('Server response:', text);
                throw new Error(`Server error: ${response.status}`);
            }
        }
        return response.json();
    } catch (error) {
        console.error('Error creating produk:', error);
        throw error;
    }
};

export const updateProduk = async (id: number, data: any) => {
    const response = await fetch(`${API_URL}/produk/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update produk');
    }
};

export const deleteProduk = async (id: number) => {
    const response = await fetch(`${API_URL}/produk/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete produk');
    }
};

export const produksiProduk = async (id: number, user_id: number, jumlah: number = 1) => {
    const response = await fetch(`${API_URL}/produk/${id}/produksi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, jumlah }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to produksi');
    }
    return response.json();
};

export const fetchResep = async () => {
    const response = await fetch(`${API_URL}/produk/resep`);
    if (!response.ok) {
        throw new Error('Failed to fetch resep');
    }
    return response.json();
};

// --- Analytics API ---

export const fetchMonthlyTrends = async () => {
    const response = await fetch(`${API_URL}/analytics/trends`);
    if (!response.ok) throw new Error('Failed to fetch trends');
    return response.json();
};

export const fetchTopMaterials = async () => {
    const response = await fetch(`${API_URL}/analytics/top-materials`);
    if (!response.ok) throw new Error('Failed to fetch top materials');
    return response.json();
};

export const fetchCategoryDistribution = async () => {
    const response = await fetch(`${API_URL}/analytics/categories`);
    if (!response.ok) throw new Error('Failed to fetch category distribution');
    return response.json();
};

export const fetchUserPerformance = async () => {
    const response = await fetch(`${API_URL}/analytics/performance`);
    if (!response.ok) throw new Error('Failed to fetch user performance');
    return response.json();
};