import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PackagePlus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useInventory } from '@/hooks/useInventory';

export default function StokMasukPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { inventory: bahanList, kategori: kategoriList, stokMasuk } = useInventory();
  const [searchParams] = useSearchParams();
  const preselectedBahan = searchParams.get('bahan');

  const [formData, setFormData] = useState({
    bahan_id: preselectedBahan || '',
    jumlah: '',
    keterangan: '',
  });

  const [selectedNamaBahan, setSelectedNamaBahan] = useState<string>('');

  // Derived state for selection
  const uniqueNamaBahan = Array.from(new Set(bahanList.map(b => b.nama_bahan))).sort();

  const filteredBahanList = bahanList.filter(b => b.nama_bahan === selectedNamaBahan);

  // Auto-select nama bahan if editing/preselected
  if (preselectedBahan && !selectedNamaBahan && bahanList.length > 0) {
    const bahan = bahanList.find(b => b.bahan_id.toString() === preselectedBahan);
    if (bahan) {
      setSelectedNamaBahan(bahan.nama_bahan);
    }
  }

  const getKategoriName = (id: number) => {
    const kat = kategoriList.find(k => k.kategori_id === id);
    return kat ? kat.nama_kategori : 'Unknown';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bahan_id || !formData.jumlah) {
      toast({
        title: "Error",
        description: "Mohon lengkapi bahan dan jumlah",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login",
        variant: "destructive",
      });
      return;
    }

    try {
      const bahan = bahanList.find(b => b.bahan_id.toString() === formData.bahan_id);

      await stokMasuk({
        bahan_id: parseInt(formData.bahan_id),
        jumlah: parseFloat(formData.jumlah),
        user_id: user.user_id,
        keterangan: formData.keterangan
      });

      toast({
        title: "Stok Masuk Berhasil! ✨",
        description: `${formData.jumlah} unit ${bahan?.nama_bahan} telah ditambahkan`,
      });

      setFormData({ bahan_id: '', jumlah: '', keterangan: '' });
      // Optional: navigate back or stay
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mencatat stok masuk",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Input Stok Masuk"
        description="Tambahkan stok bahan yang masuk ke gudang"
        icon={PackagePlus}
      />

      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="y2k-card p-6 space-y-6">
          <div className="space-y-2">
            <Label>Pilih Bahan</Label>

            {/* Step 1: Pilih Nama Bahan */}
            <div className="space-y-2">
              <Select
                value={selectedNamaBahan}
                onValueChange={(v) => {
                  setSelectedNamaBahan(v);
                  setFormData(prev => ({ ...prev, bahan_id: '' })); // Reset selection
                }}
              >
                <SelectTrigger className="rounded-xl border-2 h-12">
                  <SelectValue placeholder="Pilih Nama Bahan..." />
                </SelectTrigger>
                <SelectContent>
                  {uniqueNamaBahan.map(nama => (
                    <SelectItem key={nama} value={nama}>
                      {nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Step 2: Pilih Warna/Varian */}
            {selectedNamaBahan && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Select
                  value={formData.bahan_id}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, bahan_id: v }))}
                >
                  <SelectTrigger className="rounded-xl border-2 h-12">
                    <SelectValue placeholder="Pilih Warna/Varian..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredBahanList.map(b => (
                      <SelectItem key={b.bahan_id} value={b.bahan_id.toString()}>
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{b.warna}</span>
                          <span className="text-muted-foreground text-xs">
                            ({b.berat_ukuran})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Jumlah</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Masukkan jumlah..."
              value={formData.jumlah}
              onChange={(e) => setFormData(prev => ({ ...prev, jumlah: e.target.value }))}
              className="rounded-xl border-2 h-12"
            />
          </div>

          <div className="space-y-2">
            <Label>Keterangan (Opsional)</Label>
            <Textarea
              placeholder="Tambahkan keterangan..."
              value={formData.keterangan}
              onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
              className="rounded-xl border-2 min-h-24"
            />
          </div>

          <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground">
              <strong>User:</strong> {user?.nama || 'Guest'} <br />
              <strong>Tanggal:</strong> {new Date().toLocaleString('id-ID')}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-lg bg-gradient-to-r from-y2k-teal to-y2k-mint text-foreground hover:opacity-90"
          >
            <PackagePlus className="w-5 h-5 mr-2" />
            Simpan Stok Masuk
          </Button>
        </form>
      </div>
    </div>
  );
}
