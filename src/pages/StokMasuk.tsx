import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { bahanSisa, getKategoriById } from '@/data/mockData';

export default function StokMasukPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const preselectedBahan = searchParams.get('bahan');

  const [formData, setFormData] = useState({
    bahan_id: preselectedBahan || '',
    jumlah: '',
    keterangan: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bahan_id || !formData.jumlah) {
      toast({
        title: "Error",
        description: "Mohon lengkapi bahan dan jumlah",
        variant: "destructive",
      });
      return;
    }

    const bahan = bahanSisa.find(b => b.bahan_id.toString() === formData.bahan_id);
    
    toast({
      title: "Stok Masuk Berhasil! ✨",
      description: `${formData.jumlah} unit ${bahan?.nama_bahan} telah ditambahkan`,
    });

    setFormData({ bahan_id: '', jumlah: '', keterangan: '' });
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
            <Select 
              value={formData.bahan_id} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, bahan_id: v }))}
            >
              <SelectTrigger className="rounded-xl border-2 h-12">
                <SelectValue placeholder="Pilih bahan..." />
              </SelectTrigger>
              <SelectContent>
                {bahanSisa.map(b => (
                  <SelectItem key={b.bahan_id} value={b.bahan_id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{b.nama_bahan}</span>
                      <span className="text-muted-foreground">
                        ({b.warna}) - {getKategoriById(b.kategori_id)?.nama_kategori}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <strong>User:</strong> {user?.nama} <br />
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
