import { useState } from 'react';
import { Package, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
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
import { 
  bahanSisa as initialBahan, 
  kategoriBahan,
  getKategoriById 
} from '@/data/mockData';
import type { BahanSisa, KondisiBahan } from '@/types/database';

export default function BahanSisaPage() {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bahanList, setBahanList] = useState(initialBahan);
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('all');
  const [filterKondisi, setFilterKondisi] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBahan, setEditingBahan] = useState<BahanSisa | null>(null);
  
  const [formData, setFormData] = useState({
    nama_bahan: '',
    kategori_id: '',
    berat_ukuran: '',
    warna: '',
    kondisi: 'mentah' as KondisiBahan,
    stok_total: 0,
  });

  // Filter data
  const filteredBahan = bahanList.filter(b => {
    const matchSearch = b.nama_bahan.toLowerCase().includes(search.toLowerCase()) ||
                       b.warna.toLowerCase().includes(search.toLowerCase());
    const matchKategori = filterKategori === 'all' || b.kategori_id.toString() === filterKategori;
    const matchKondisi = filterKondisi === 'all' || b.kondisi === filterKondisi;
    return matchSearch && matchKategori && matchKondisi;
  });

  const openAddDialog = () => {
    setEditingBahan(null);
    setFormData({
      nama_bahan: '',
      kategori_id: '',
      berat_ukuran: '',
      warna: '',
      kondisi: 'mentah',
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
      kondisi: bahan.kondisi,
      stok_total: bahan.stok_total,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nama_bahan || !formData.kategori_id) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field",
        variant: "destructive",
      });
      return;
    }

    if (editingBahan) {
      setBahanList(prev => prev.map(b => 
        b.bahan_id === editingBahan.bahan_id 
          ? { ...b, ...formData, kategori_id: parseInt(formData.kategori_id), updated_at: new Date().toISOString() }
          : b
      ));
      toast({ title: "Berhasil", description: "Bahan berhasil diperbarui" });
    } else {
      const newBahan: BahanSisa = {
        bahan_id: Math.max(...bahanList.map(b => b.bahan_id)) + 1,
        nama_bahan: formData.nama_bahan,
        kategori_id: parseInt(formData.kategori_id),
        berat_ukuran: formData.berat_ukuran,
        warna: formData.warna,
        kondisi: formData.kondisi,
        stok_total: formData.stok_total,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setBahanList(prev => [...prev, newBahan]);
      toast({ title: "Berhasil", description: "Bahan baru berhasil ditambahkan" });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (bahan: BahanSisa) => {
    if (confirm(`Hapus bahan "${bahan.nama_bahan}"?`)) {
      setBahanList(prev => prev.filter(b => b.bahan_id !== bahan.bahan_id));
      toast({ title: "Berhasil", description: "Bahan berhasil dihapus" });
    }
  };

  const columns = [
    { 
      key: 'nama_bahan', 
      header: 'Nama Bahan',
      render: (item: BahanSisa) => (
        <span className="font-medium">{item.nama_bahan}</span>
      )
    },
    { 
      key: 'kategori', 
      header: 'Kategori',
      render: (item: BahanSisa) => (
        <Y2KBadge variant="lavender">
          {getKategoriById(item.kategori_id)?.nama_kategori}
        </Y2KBadge>
      )
    },
    { key: 'berat_ukuran', header: 'Ukuran' },
    { key: 'warna', header: 'Warna' },
    { 
      key: 'kondisi', 
      header: 'Kondisi',
      render: (item: BahanSisa) => {
        const variant = item.kondisi === 'siap-olah' ? 'success' : 
                       item.kondisi === 'mentah' ? 'warning' : 'danger';
        return <Y2KBadge variant={variant}>{item.kondisi}</Y2KBadge>;
      }
    },
    { 
      key: 'stok_total', 
      header: 'Stok',
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
          {hasRole(['admin', 'staff']) && (
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
        {hasRole(['admin', 'staff']) && (
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
            {kategoriBahan.map(k => (
              <SelectItem key={k.kategori_id} value={k.kategori_id.toString()}>
                {k.nama_kategori}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterKondisi} onValueChange={setFilterKondisi}>
          <SelectTrigger className="w-full sm:w-40 rounded-xl border-2">
            <SelectValue placeholder="Kondisi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kondisi</SelectItem>
            <SelectItem value="mentah">Mentah</SelectItem>
            <SelectItem value="siap-olah">Siap Olah</SelectItem>
            <SelectItem value="rusak">Rusak</SelectItem>
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
                  {kategoriBahan.map(k => (
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kondisi</Label>
                <Select 
                  value={formData.kondisi} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, kondisi: v as KondisiBahan }))}
                >
                  <SelectTrigger className="rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mentah">Mentah</SelectItem>
                    <SelectItem value="siap-olah">Siap Olah</SelectItem>
                    <SelectItem value="rusak">Rusak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stok Awal</Label>
                <Input
                  type="number"
                  value={formData.stok_total}
                  onChange={(e) => setFormData(prev => ({ ...prev, stok_total: parseInt(e.target.value) || 0 }))}
                  className="rounded-xl border-2"
                />
              </div>
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
