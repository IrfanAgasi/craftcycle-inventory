import { useState } from 'react';
import { Sparkles, Package, Check, X, Factory, Plus, Upload, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Y2KBadge } from '@/components/ui/y2k-badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useProduk } from '@/hooks/useProduk';
import type { ProdukJadi } from '@/types/database';

interface ResepItem {
  bahan_id: number;
  jumlah_bahan: number;
}

export default function ProduksiPage() {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const { inventory: bahanList } = useInventory();
  const { produkList, getResepByProdukId, addProduk, produksi, loading } = useProduk();
  
  const [selectedProduk, setSelectedProduk] = useState<ProdukJadi | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newProduk, setNewProduk] = useState({
    nama_produk: '',
    harga_jual: '',
    gambar: null as File | null,
  });
  const [resepItems, setResepItems] = useState<ResepItem[]>([
    { bahan_id: 0, jumlah_bahan: 0 }
  ]);
  const [previewImage, setPreviewImage] = useState<string>('');

  const openDetail = (produk: ProdukJadi) => {
    setSelectedProduk(produk);
    setIsDialogOpen(true);
  };

  const getBahanById = (bahanId: number) => {
    return bahanList.find(b => b.bahan_id === bahanId);
  };

  const checkStokCukup = (produkId: number) => {
    const resep = getResepByProdukId(produkId);
    return resep.every(r => {
      const bahan = getBahanById(r.bahan_id);
      return bahan && bahan.stok_total >= r.jumlah_bahan;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error! ⚠️",
          description: "Ukuran gambar maksimal 2MB",
          variant: "destructive",
        });
        return;
      }

      setNewProduk({ ...newProduk, gambar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addResepItem = () => {
    setResepItems([...resepItems, { bahan_id: 0, jumlah_bahan: 0 }]);
  };

  const removeResepItem = (index: number) => {
    setResepItems(resepItems.filter((_, i) => i !== index));
  };

  const updateResepItem = (index: number, field: keyof ResepItem, value: number) => {
    const updated = [...resepItems];
    updated[index][field] = value;
    setResepItems(updated);
  };

  const handleSubmitProdukBaru = async () => {
    if (!newProduk.nama_produk || !newProduk.harga_jual) {
      toast({
        title: "Error! ⚠️",
        description: "Nama produk dan harga wajib diisi",
        variant: "destructive",
      });
      return;
    }

    const validResep = resepItems.filter(item => item.bahan_id > 0 && item.jumlah_bahan > 0);
    if (validResep.length === 0) {
      toast({
        title: "Error! ⚠️",
        description: "Minimal satu resep harus ditambahkan",
        variant: "destructive",
      });
      return;
    }

    try {
      await addProduk({
        nama_produk: newProduk.nama_produk,
        harga_jual: parseFloat(newProduk.harga_jual),
        gambar_url: previewImage || undefined, // Send base64 image
        resep: validResep
      });

      toast({
        title: "Produk Berhasil Ditambahkan! 🎉",
        description: `${newProduk.nama_produk} berhasil ditambahkan`,
      });

      // Reset form
      setNewProduk({ nama_produk: '', harga_jual: '', gambar: null });
      setResepItems([{ bahan_id: 0, jumlah_bahan: 0 }]);
      setPreviewImage('');
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error! ⚠️",
        description: error instanceof Error ? error.message : 'Gagal menambahkan produk',
        variant: "destructive",
      });
    }
  };

  const handleProduksi = async () => {
    if (!selectedProduk || !user) return;

    if (!checkStokCukup(selectedProduk.produk_id)) {
      toast({
        title: "Stok Tidak Cukup! ⚠️",
        description: "Beberapa bahan tidak mencukupi untuk produksi",
        variant: "destructive",
      });
      return;
    }

    try {
      await produksi(selectedProduk.produk_id, user.user_id, 1);
      
      toast({
        title: "Produksi Berhasil! 🎉",
        description: `1 unit ${selectedProduk.nama_produk} berhasil diproduksi`,
      });

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error! ⚠️",
        description: error instanceof Error ? error.message : 'Gagal melakukan produksi',
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const cardColors = [
    'from-y2k-pink-light to-y2k-lavender-light border-y2k-pink/40',
    'from-y2k-teal-light to-y2k-mint border-y2k-teal/40',
    'from-y2k-lavender-light to-y2k-baby-blue border-y2k-lavender/40',
    'from-y2k-yellow/30 to-y2k-orange/20 border-y2k-orange/40',
    'from-y2k-mint to-y2k-teal-light border-y2k-mint',
  ];



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Auto Craft" 
          description="Produksi kerajinan dari bahan sisa"
          icon={Sparkles}
        />
        {hasRole(['admin', 'staff']) && (
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-y2k-pink to-y2k-purple hover:opacity-90 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">Loading...</div>
        ) : produkList.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">Belum ada produk</div>
        ) : (
          produkList.map((produk, index) => {
          const stokCukup = checkStokCukup(produk.produk_id);
          const colorClass = cardColors[index % cardColors.length];
          
          // Debug: Log gambar_url
          if (index === 0) {
            console.log('Produk gambar_url:', produk.gambar_url ? 'exists' : 'empty', produk.gambar_url?.substring(0, 50));
          }
          
          return (
            <div
              key={produk.produk_id}
              className={`
                relative overflow-hidden rounded-2xl border-2 p-5
                bg-gradient-to-br ${colorClass}
                transition-all duration-300 hover:shadow-y2k hover:scale-[1.02] cursor-pointer
              `}
              onClick={() => openDetail(produk)}
            >
              {/* Decorative circle */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/10 blur-2xl" />
              
              <div className="relative space-y-4">
                {/* Product Image or Icon */}
                {produk.gambar_url && produk.gambar_url.trim() !== '' ? (
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-sm">
                    <img 
                      src={produk.gambar_url} 
                      alt={produk.nama_produk}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-card/80">
                              <svg class="w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-sm border-2 border-dashed border-primary/20">
                    <div className="text-center">
                      <Sparkles className="w-16 h-16 text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">No Image</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="font-bold text-lg text-foreground">{produk.nama_produk}</h3>
                  <p className="text-2xl font-bold text-primary font-space mt-1">
                    {formatPrice(produk.harga_jual)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Y2KBadge variant={produk.stok_total > 0 ? 'teal' : 'warning'}>
                    Stok: {produk.stok_total}
                  </Y2KBadge>
                  <Y2KBadge variant={stokCukup ? 'success' : 'danger'}>
                    {stokCukup ? 'Siap Produksi' : 'Bahan Kurang'}
                  </Y2KBadge>
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] flex flex-col">
          {selectedProduk && (
            <>
              <DialogHeader>
                <DialogTitle className="font-space text-xl flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-y2k-pink-light to-y2k-lavender-light">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  {selectedProduk.nama_produk}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4 overflow-y-auto flex-1 px-1">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Harga Jual</p>
                    <p className="text-2xl font-bold text-primary font-space">
                      {formatPrice(selectedProduk.harga_jual)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Stok Produk</p>
                    <p className="text-2xl font-bold font-space">{selectedProduk.stok_total}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Bahan yang Dibutuhkan
                  </h4>
                  <div className="space-y-2">
                    {getResepByProdukId(selectedProduk.produk_id).map(resep => {
                      const bahan = getBahanById(resep.bahan_id);
                      const cukup = bahan && bahan.stok_total >= resep.jumlah_bahan;
                      
                      return (
                        <div 
                          key={resep.resep_id}
                          className={`
                            flex items-center justify-between p-3 rounded-xl border-2
                            ${cukup ? 'bg-success/5 border-success/30' : 'bg-destructive/5 border-destructive/30'}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            {cukup ? (
                              <Check className="w-5 h-5 text-success" />
                            ) : (
                              <X className="w-5 h-5 text-destructive" />
                            )}
                            <div>
                              <p className="font-medium">{bahan?.nama_bahan}</p>
                              <p className="text-sm text-muted-foreground">{bahan?.warna}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {Math.round(resep.jumlah_bahan)} / <span className="text-muted-foreground">{Math.round(bahan?.stok_total || 0)}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">Butuh / Tersedia</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-auto">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                  Tutup
                </Button>
                {hasRole(['admin', 'staff']) && (
                  <Button 
                    onClick={handleProduksi}
                    disabled={!checkStokCukup(selectedProduk.produk_id)}
                    className="bg-gradient-to-r from-y2k-pink to-y2k-purple hover:opacity-90 rounded-xl"
                  >
                    <Factory className="w-4 h-4 mr-2" />
                    Produksi 1 Unit
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Tambah Produk Baru */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-space text-xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-y2k-pink-light to-y2k-lavender-light">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              Tambah Produk Baru
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4 overflow-y-auto flex-1 px-1">
            {/* Upload Gambar */}
            <div className="space-y-2">
              <Label>Gambar Produk</Label>
              <div className="flex items-center gap-4">
                {previewImage && (
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-xl object-cover border-2 border-border"
                  />
                )}
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer bg-muted/30">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Gambar</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Nama Produk */}
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Produk *</Label>
              <Input
                id="nama"
                placeholder="Masukkan nama produk"
                value={newProduk.nama_produk}
                onChange={(e) => setNewProduk({ ...newProduk, nama_produk: e.target.value })}
                className="rounded-xl"
              />
            </div>

            {/* Harga Jual */}
            <div className="space-y-2">
              <Label htmlFor="harga">Harga Jual (Rp) *</Label>
              <Input
                id="harga"
                type="number"
                placeholder="Masukkan harga jual"
                value={newProduk.harga_jual}
                onChange={(e) => setNewProduk({ ...newProduk, harga_jual: e.target.value })}
                className="rounded-xl"
              />
            </div>

            {/* Resep */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Resep Produksi *</Label>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={addResepItem}
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Bahan
                </Button>
              </div>

              <div className="space-y-3">
                {resepItems.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end p-3 rounded-xl bg-muted/30 border border-border">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Bahan</Label>
                      <Select
                        value={item.bahan_id.toString()}
                        onValueChange={(value) => updateResepItem(index, 'bahan_id', parseInt(value))}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Pilih bahan" />
                        </SelectTrigger>
                        <SelectContent>
                          {bahanList.map((bahan) => (
                            <SelectItem key={bahan.bahan_id} value={bahan.bahan_id.toString()}>
                              {bahan.nama_bahan} - {bahan.warna}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-28 space-y-2">
                      <Label className="text-xs">Jumlah</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.jumlah_bahan || ''}
                        onChange={(e) => updateResepItem(index, 'jumlah_bahan', parseInt(e.target.value) || 0)}
                        className="rounded-xl"
                      />
                    </div>

                    {resepItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeResepItem(index)}
                        className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-auto">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">
              Batal
            </Button>
            <Button 
              onClick={handleSubmitProdukBaru}
              className="bg-gradient-to-r from-y2k-pink to-y2k-purple hover:opacity-90 rounded-xl"
            >
              <Check className="w-4 h-4 mr-2" />
              Simpan Produk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
