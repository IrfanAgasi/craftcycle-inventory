import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchInventory,
    fetchKategori,
    createBahan,
    updateBahan,
    deleteBahan,
    postStokMasuk,
    postStokKeluar,
    fetchHistory,
    fetchDashboardStats,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
} from '../services/api';
import { BahanSisa, User } from '../types/database';

export const useHistory = () => {
    return useQuery({
        queryKey: ['history'],
        queryFn: fetchHistory,
    });
};

export const useDashboard = () => {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: fetchDashboardStats,
    });
};

export const useUsers = () => {
    const queryClient = useQueryClient();

    const usersQuery = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    const createUserMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, user }: { id: number; user: Partial<User> }) => updateUser(id, user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    return {
        users: usersQuery.data || [],
        isLoading: usersQuery.isLoading,
        error: usersQuery.error,
        createUser: createUserMutation.mutateAsync,
        updateUser: updateUserMutation.mutateAsync,
        deleteUser: deleteUserMutation.mutateAsync,
    };
};

export const useInventory = () => {
    const queryClient = useQueryClient();

    const inventoryQuery = useQuery({
        queryKey: ['inventory'],
        queryFn: fetchInventory,
    });

    const kategoriQuery = useQuery({
        queryKey: ['kategori'],
        queryFn: fetchKategori,
    });

    const createMutation = useMutation({
        mutationFn: createBahan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<BahanSisa> }) => updateBahan(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBahan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
    });

    const stokMasukMutation = useMutation({
        mutationFn: postStokMasuk,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
    });

    const stokKeluarMutation = useMutation({
        mutationFn: postStokKeluar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
    });

    return {
        inventory: inventoryQuery.data || [],
        isLoading: inventoryQuery.isLoading,
        error: inventoryQuery.error,
        kategori: kategoriQuery.data || [],
        createBahan: createMutation.mutateAsync,
        updateBahan: updateMutation.mutateAsync,
        deleteBahan: deleteMutation.mutateAsync,
        stokMasuk: stokMasukMutation.mutateAsync,
        stokKeluar: stokKeluarMutation.mutateAsync,
    };
};
