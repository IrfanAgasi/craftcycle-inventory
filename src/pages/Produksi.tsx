import { useState } from 'react';
import { Sparkles, Package, Check, X, Factory } from 'lucide-react';
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
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  produkJadi, 
  resepProduk, 
  bahanSisa,
  getBahanById,
  getResepByProdukId 
} from '@/data/mockData';
import type { ProdukJadi } from '@/types/database';

export default function ProduksiPage() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [selectedProduk, setSelectedProduk] = useState<ProdukJadi | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDetail = (produk: ProdukJadi) => {
    setSelectedProduk(produk);
    setIsDialogOpen(true);
  };

  const checkStokCukup = (produkId: number) => {
    const resep = getResepByProdukId(produkId);
    return resep.every(r => {
      const bahan = getBahanById(r.bahan_id);
      return bahan && bahan.stok_total >= r.jumlah_bahan;
    });
  };

  const handleProduksi = () => {
    if (!selectedProduk) return;

    if (!checkStokCukup(selectedProduk.produk_id)) {
      toast({
        title: "Stok Tidak Cukup! ⚠️",
        description: "Beberapa bahan tidak mencukupi untuk produksi",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Produksi Berhasil! 🎉",
      description: `1 unit ${selectedProduk.nama_produk} berhasil diproduksi`,
    });
    setIsDialogOpen(false);
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
      <PageHeader 
        title="Auto Craft" 
        description="Produksi kerajinan dari bahan sisa"
        icon={Sparkles}
      />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {produkJadi.map((produk, index) => {
          const stokCukup = checkStokCukup(produk.produk_id);
          const colorClass = cardColors[index % cardColors.length];
          
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
                <div className="w-14 h-14 rounded-2xl bg-card/80 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                
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
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
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
              
              <div className="space-y-6 py-4">
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
                              {resep.jumlah_bahan} / <span className="text-muted-foreground">{bahan?.stok_total}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">Butuh / Tersedia</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <DialogFooter>
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
    </div>
  );
}
