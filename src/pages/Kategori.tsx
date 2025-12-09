import { useState } from 'react';
import { FolderOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useKategori } from '@/hooks/useInventory';
import type { KategoriBahan } from '@/types/database';

export default function KategoriPage() {
  const { toast } = useToast();
  const { kategori: kategoriList, isLoading, createKategori, updateKategori, deleteKategori } = useKategori();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKategori, setEditingKategori] = useState<KategoriBahan | null>(null);
  const [namaKategori, setNamaKategori] = useState('');

  const openAddDialog = () => {
    setEditingKategori(null);
    setNamaKategori('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (kategori: KategoriBahan) => {
    setEditingKategori(kategori);
    setNamaKategori(kategori.nama_kategori);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!namaKategori.trim()) {
      toast({
        title: "Error",
        description: "Nama kategori tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingKategori) {
        await updateKategori({
          id: editingKategori.kategori_id,
          data: { nama_kategori: namaKategori }
        });
        toast({ 
          title: "Berhasil", 
          description: "Kategori berhasil diperbarui" 
        });
      } else {
        await createKategori({ nama_kategori: namaKategori });
        toast({ 
          title: "Berhasil", 
          description: "Kategori baru berhasil ditambahkan" 
        });
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: (error as Error).message || "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (kategori: KategoriBahan) => {
    if (confirm(`Hapus kategori "${kategori.nama_kategori}"?`)) {
      try {
        await deleteKategori(kategori.kategori_id);
        toast({ 
          title: "Berhasil", 
          description: "Kategori berhasil dihapus" 
        });
      } catch (error: any) {
        toast({
          title: "Gagal",
          description: error.message || "Gagal menghapus kategori",
          variant: "destructive"
        });
      }
    }
  };

  const columns = [
    { 
      key: 'kategori_id', 
      header: 'ID',
      render: (item: KategoriBahan) => (
        <span className="text-muted-foreground">#{item.kategori_id}</span>
      )
    },
    { 
      key: 'nama_kategori', 
      header: 'Nama Kategori',
      render: (item: KategoriBahan) => (
        <span className="font-medium">{item.nama_kategori}</span>
      )
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: KategoriBahan) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg"
            onClick={() => openEditDialog(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={() => handleDelete(item)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Kategori Bahan" 
        description="Kelola kategori bahan sisa"
        icon={FolderOpen}
      >
        <Button 
          onClick={openAddDialog}
          className="bg-gradient-to-r from-y2k-pink to-y2k-purple hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kategori
        </Button>
      </PageHeader>

      <DataTable data={kategoriList} columns={columns} />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-space">
              {editingKategori ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label>Nama Kategori</Label>
              <Input
                value={namaKategori}
                onChange={(e) => setNamaKategori(e.target.value)}
                placeholder="Masukkan nama kategori..."
                className="rounded-xl border-2"
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
