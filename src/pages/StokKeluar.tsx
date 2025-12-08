import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PackageMinus, AlertTriangle } from 'lucide-react';
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

export default function StokKeluarPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { inventory: bahanList, stokKeluar } = useInventory();
  const [searchParams] = useSearchParams();
  const preselectedBahan = searchParams.get('bahan');

  const [formData, setFormData] = useState({
    bahan_id: preselectedBahan || '',
    jumlah: '',
    alasan: '',
    keterangan: '',
  });

  const selectedBahan = bahanList.find(b => b.bahan_id.toString() === formData.bahan_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bahan_id || !formData.jumlah || !formData.alasan) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field wajib",
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

    const jumlah = parseFloat(formData.jumlah);
    if (selectedBahan && jumlah > selectedBahan.stok_total) {
      toast({
        title: "Stok Tidak Cukup!",
        description: `Stok tersedia: ${selectedBahan.stok_total}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await stokKeluar({
        bahan_id: parseInt(formData.bahan_id),
        jumlah: jumlah,
        user_id: user.user_id,
        keterangan: `${formData.alasan}: ${formData.keterangan}`
      });

      const isRusak = formData.alasan === 'rusak';

      toast({
        title: isRusak ? "Bahan Rusak Dicatat! ⚠️" : "Stok Keluar Berhasil! ✨",
        description: `${formData.jumlah} unit ${selectedBahan?.nama_bahan} telah dikurangi`,
      });

      setFormData({ bahan_id: '', jumlah: '', alasan: '', keterangan: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal mencatat stok keluar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Input Stok Keluar"
        description="Catat pengeluaran stok bahan dari gudang"
        icon={PackageMinus}
      />

      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="y2k-card p-6 space-y-6">
          <div className="space-y-2">
            <Label>Pilih Bahan</Label>
            <Select
              value={formData.bahan_id}
              onValueChange={(v) => setFormData(prev => ({ ...prev, bahan_id: v }))}
            >
              <SelectTrigger className="rounded-xl border-2 h-12">
                <SelectValue placeholder="Pilih bahan..." />
              </SelectTrigger>
              <SelectContent>
                {bahanList.map(b => (
                  <SelectItem key={b.bahan_id} value={b.bahan_id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{b.nama_bahan}</span>
                      <span className="text-muted-foreground">
                        ({b.warna}) - Stok: {b.stok_total}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedBahan && (
              <p className="text-sm text-muted-foreground">
                Stok tersedia: <strong>{selectedBahan.stok_total}</strong>
              </p>
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
            <Label>Alasan Pengeluaran</Label>
            <Select
              value={formData.alasan}
              onValueChange={(v) => setFormData(prev => ({ ...prev, alasan: v }))}
            >
              <SelectTrigger className="rounded-xl border-2 h-12">
                <SelectValue placeholder="Pilih alasan..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="produksi">Produksi</SelectItem>
                <SelectItem value="rusak">Rusak</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.alasan === 'rusak' && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">
                Bahan akan dicatat sebagai rusak dan masuk ke daftar Bahan Rusak.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Keterangan {formData.alasan === 'rusak' ? '(Wajib)' : '(Opsional)'}</Label>
            <Textarea
              placeholder={formData.alasan === 'rusak' ? 'Jelaskan alasan kerusakan...' : 'Tambahkan keterangan...'}
              value={formData.keterangan}
              onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
              className="rounded-xl border-2 min-h-24"
              required={formData.alasan === 'rusak'}
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
            className="w-full h-12 rounded-xl text-lg bg-gradient-to-r from-y2k-pink to-y2k-orange text-primary-foreground hover:opacity-90"
          >
            <PackageMinus className="w-5 h-5 mr-2" />
            Simpan Stok Keluar
          </Button>
        </form>
      </div>
    </div>
  );
}
