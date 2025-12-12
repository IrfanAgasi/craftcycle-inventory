import { useState } from 'react';
import { Package, Plus, Search, Filter, Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Y2KBadge } from '@/components/ui/y2k-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useInventory } from '@/hooks/useInventory';
import type { BahanSisa } from '@/types/database';

const API_URL = 'http://localhost:3000/api';

export default function BahanSisaPage() {
  const { hasRole, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { inventory: bahanList, kategori: kategoriList, isLoading, createBahan, updateBahan, deleteBahan } = useInventory();

  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBahan, setEditingBahan] = useState<BahanSisa | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'nama_bahan', direction: 'asc' });

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const [formData, setFormData] = useState({
    nama_bahan: '',
    kategori_id: '',
    berat_ukuran: '',
    warna: '',
    stok_total: 0,
  });

  // Filter data
  const filteredBahan = bahanList.filter(b => {
    const matchSearch = b.nama_bahan.toLowerCase().includes(search.toLowerCase()) ||
      b.warna.toLowerCase().includes(search.toLowerCase());
    const matchKategori = filterKategori === 'all' || b.kategori_id.toString() === filterKategori;
    return matchSearch && matchKategori;
  }).sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    let aValue: any = (a as any)[key];
    let bValue: any = (b as any)[key];

    if (key === 'kategori') {
      // Find category name for sorting
      const catA = kategoriList.find(k => k.kategori_id === a.kategori_id);
      const catB = kategoriList.find(k => k.kategori_id === b.kategori_id);
      aValue = catA ? catA.nama_kategori : '';
      bValue = catB ? catB.nama_kategori : '';
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const openAddDialog = () => {
    setEditingBahan(null);
    setFormData({
      nama_bahan: '',
      kategori_id: '',
      berat_ukuran: '',
      warna: '',
      stok_total: 0,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (bahan: BahanSisa) => {
    setEditingBahan(bahan);
    setFormData({
      nama_bahan: bahan.nama_bahan,
      kategori_id: bahan.kategori_id.toString(),
      berat_ukuran: bahan.berat_ukuran,
      warna: bahan.warna,
      stok_total: bahan.stok_total,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nama_bahan.trim() || !formData.kategori_id || !formData.berat_ukuran.trim() || !formData.warna.trim()) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        nama_bahan: formData.nama_bahan.trim(),
        kategori_id: parseInt(formData.kategori_id),
        berat_ukuran: formData.berat_ukuran.trim(),
        warna: formData.warna.trim(),
        stok_total: editingBahan ? formData.stok_total : (formData.stok_total || 0)
      };

      if (editingBahan) {
        await updateBahan({
          id: editingBahan.bahan_id,
          data: payload
        });
        toast({ title: "Berhasil", description: "Bahan berhasil diperbarui" });
      } else {
        const result: any = await createBahan(payload);
        console.log('Create result:', result);

        const newBahanId = result?.bahan_id || result?.data?.bahan_id || result?.id;
        console.log('New Bahan ID:', newBahanId);

        // Jika ada stok awal, catat sebagai transaksi stok masuk
        if (formData.stok_total > 0 && newBahanId) {
          try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const userId = user?.user_id || 1;

            const stokMasukPayload = {
              bahan_id: newBahanId,
              jumlah: formData.stok_total,
              keterangan: 'Stok awal saat menambah bahan baru',
              user_id: userId
            };

            console.log('Payload stok masuk:', stokMasukPayload);

            // Panggil API untuk create stok masuk
            const stokResponse = await fetch(`${API_URL}/transactions/in`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
              body: JSON.stringify(stokMasukPayload)
            });

            const responseData = await stokResponse.json();

            if (stokResponse.ok) {
              console.log('Riwayat stok masuk berhasil tercatat');
              toast({
                title: "Berhasil",
                description: "Bahan dan stok awal berhasil ditambahkan"
              });
            } else {
              console.error('Gagal mencatat riwayat stok:', responseData);
              toast({
                title: "Peringatan",
                description: "Bahan berhasil ditambah, tetapi gagal mencatat riwayat stok",
                variant: "destructive",
              });
            }
          } catch (stokError) {
            console.error('Exception saat mencatat riwayat stok:', stokError);
            toast({
              title: "Peringatan",
              description: "Bahan berhasil ditambah, tetapi gagal mencatat riwayat stok",
              variant: "destructive",
            });
          }
        } else {
          toast({ title: "Berhasil", description: "Bahan baru berhasil ditambahkan" });
        }
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal menyimpan data. Cek console untuk detail",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (bahan: BahanSisa) => {
    if (confirm(`Hapus bahan "${bahan.nama_bahan}"?${bahan.stok_total > 0 ? `\n\nStok yang akan dihapus: ${bahan.stok_total}` : ''}`)) {
      try {
        if (!user) {
          toast({ title: "Error", description: "User tidak ditemukan", variant: "destructive" });
          return;
        }
        const result = await deleteBahan({ id: bahan.bahan_id, user_id: user.user_id });
        toast({
          title: "Berhasil",
          description: `${result.bahanName} berhasil dihapus. Tercatat di riwayat stok.`
        });
      } catch (error) {
        console.error('Error deleting bahan:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Gagal menghapus bahan",
          variant: "destructive"
        });
      }
    }
  };

  const getKategoriName = (id: number) => {
    const kat = kategoriList.find(k => k.kategori_id === id);
    return kat ? kat.nama_kategori : 'Unknown';
  };

  const getKategoriColor = (id: number): 'pink' | 'lavender' | 'teal' | 'mint' | 'orange' => {
    const colors: Array<'pink' | 'lavender' | 'teal' | 'mint' | 'orange'> = ['pink', 'lavender', 'teal', 'mint', 'orange'];
    return colors[id % colors.length];
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpCircle className="w-4 h-4 text-muted-foreground/30" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUpCircle className="w-4 h-4 text-primary" />
      : <ArrowDownCircle className="w-4 h-4 text-primary" />;
  };

  const renderHeader = (label: string, key: string) => (
    <div
      className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors select-none"
      onClick={() => handleSort(key)}
    >
      {label}
      <SortIcon columnKey={key} />
    </div>
  );

  const columns = [
    {
      key: 'nama_bahan',
      header: renderHeader('Nama Bahan', 'nama_bahan'),
      render: (item: BahanSisa) => (
        <span className="font-medium">{item.nama_bahan}</span>
      )
    },
    {
      key: 'kategori',
      header: renderHeader('Kategori', 'kategori'),
      render: (item: BahanSisa) => (
        <Y2KBadge variant={getKategoriColor(item.kategori_id)}>
          {getKategoriName(item.kategori_id)}
        </Y2KBadge>
      )
    },
    { key: 'berat_ukuran', header: renderHeader('Ukuran', 'berat_ukuran') },
    { key: 'warna', header: renderHeader('Warna', 'warna') },
    {
      key: 'stok_total',
      header: renderHeader('Stok', 'stok_total'),
      render: (item: BahanSisa) => (
        <span className={item.stok_total < 10 ? 'text-destructive font-bold' : 'font-medium'}>
          {item.stok_total}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: BahanSisa) => (
        <div className="flex gap-2">
          {hasRole(['admin', 'staff']) && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 rounded-lg border-y2k-teal/50 text-y2k-teal hover:bg-y2k-teal/10"
                onClick={() => navigate(`/stok-masuk?bahan=${item.bahan_id}`)}
              >
                +
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 rounded-lg border-y2k-pink/50 text-y2k-pink hover:bg-y2k-pink/10"
                onClick={() => navigate(`/stok-keluar?bahan=${item.bahan_id}`)}
              >
                –
              </Button>
            </>
          )}
          {hasRole(['admin', 'manager']) && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 rounded-lg"
              onClick={() => openEditDialog(item)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {hasRole(['admin']) && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 rounded-lg border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={() => handleDelete(item)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bahan Sisa"
        description="Kelola inventaris bahan sisa"
        icon={Package}
      >
        {hasRole(['admin']) && (
          <Button
            onClick={openAddDialog}
            className="bg-gradient-to-r from-y2k-pink to-y2k-purple hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Bahan
          </Button>
        )}
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari bahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-2"
          />
        </div>
        <Select value={filterKategori} onValueChange={setFilterKategori}>
          <SelectTrigger className="w-full sm:w-48 rounded-xl border-2">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {kategoriList.map(k => (
              <SelectItem key={k.kategori_id} value={k.kategori_id.toString()}>
                {k.nama_kategori}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filteredBahan} columns={columns} />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-space">
              {editingBahan ? 'Edit Bahan' : 'Tambah Bahan Baru'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Bahan</Label>
              <Input
                value={formData.nama_bahan}
                onChange={(e) => setFormData(prev => ({ ...prev, nama_bahan: e.target.value }))}
                className="rounded-xl border-2"
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                value={formData.kategori_id}
                onValueChange={(v) => setFormData(prev => ({ ...prev, kategori_id: v }))}
              >
                <SelectTrigger className="rounded-xl border-2">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {kategoriList.map(k => (
                    <SelectItem key={k.kategori_id} value={k.kategori_id.toString()}>
                      {k.nama_kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ukuran</Label>
                <Input
                  value={formData.berat_ukuran}
                  onChange={(e) => setFormData(prev => ({ ...prev, berat_ukuran: e.target.value }))}
                  className="rounded-xl border-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Warna</Label>
                <Input
                  value={formData.warna}
                  onChange={(e) => setFormData(prev => ({ ...prev, warna: e.target.value }))}
                  className="rounded-xl border-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{editingBahan ? 'Stok Total' : 'Stok Awal'}</Label>
              <Input
                type="number"
                value={formData.stok_total}
                onChange={(e) => setFormData(prev => ({ ...prev, stok_total: parseInt(e.target.value) || 0 }))}
                disabled={!!editingBahan}
                className={`rounded-xl border-2 ${editingBahan ? 'bg-muted cursor-not-allowed' : ''}`}
                min={0}
                placeholder={editingBahan ? "Stok total tidak dapat diubah" : "Masukkan stok awal"}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-y2k-pink to-y2k-purple hover:opacity-90 rounded-xl"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
