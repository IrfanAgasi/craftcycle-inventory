import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  PackagePlus, 
  PackageMinus, 
  AlertTriangle,
  Sparkles,
  Factory,
  TrendingUp
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { Y2KBadge } from '@/components/ui/y2k-badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  bahanSisa, 
  kategoriBahan, 
  riwayatStok, 
  produkJadi,
  bahanRusak,
  getKategoriById 
} from '@/data/mockData';
import type { BahanSisa } from '@/types/database';

export default function Dashboard() {
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  // Calculate stats
  const totalBahan = bahanSisa.length;
  const totalKategori = kategoriBahan.length;
  const totalProduk = produkJadi.length;
  
  const thisMonth = new Date().getMonth();
  const stokMasukBulanIni = riwayatStok.filter(r => 
    r.tipe === 'masuk' && new Date(r.tanggal).getMonth() === thisMonth
  ).reduce((sum, r) => sum + r.jumlah, 0);
  
  const stokKeluarBulanIni = riwayatStok.filter(r => 
    r.tipe === 'keluar' && new Date(r.tanggal).getMonth() === thisMonth
  ).reduce((sum, r) => sum + r.jumlah, 0);
  
  const produksiBulanIni = riwayatStok.filter(r => 
    r.tipe === 'produksi' && new Date(r.tanggal).getMonth() === thisMonth
  ).length;
  
  const rusakBulanIni = bahanRusak.filter(r => 
    new Date(r.tanggal_rusak).getMonth() === thisMonth
  ).reduce((sum, r) => sum + r.jumlah, 0);

  // Low stock alert
  const lowStockBahan = bahanSisa.filter(b => b.stok_total < 10);

  // Table columns
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
      render: (item: BahanSisa) => hasRole(['admin', 'staff']) ? (
        <div className="flex gap-2">
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
        </div>
      ) : null
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard" 
        description="Selamat datang di Craft Cycle Inventory System"
        icon={LayoutDashboard}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bahan"
          value={totalBahan}
          icon={Package}
          variant="pink"
        />
        <StatCard
          title="Total Kategori"
          value={totalKategori}
          icon={FolderOpen}
          variant="lavender"
        />
        <StatCard
          title="Stok Masuk Bulan Ini"
          value={stokMasukBulanIni}
          icon={PackagePlus}
          variant="teal"
        />
        <StatCard
          title="Stok Keluar Bulan Ini"
          value={stokKeluarBulanIni}
          icon={PackageMinus}
          variant="mint"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Produk Jadi"
          value={totalProduk}
          icon={Sparkles}
          variant="pink"
        />
        <StatCard
          title="Produksi Bulan Ini"
          value={produksiBulanIni}
          icon={Factory}
          variant="teal"
        />
        <StatCard
          title="Bahan Rusak Bulan Ini"
          value={rusakBulanIni}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Bahan Stok Rendah"
          value={lowStockBahan.length}
          icon={TrendingUp}
          variant={lowStockBahan.length > 0 ? 'danger' : 'mint'}
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockBahan.length > 0 && (
        <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive/30">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold text-destructive">Peringatan Stok Rendah!</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockBahan.map(b => (
              <Y2KBadge key={b.bahan_id} variant="danger" size="md">
                {b.nama_bahan} ({b.warna}) - Stok: {b.stok_total}
              </Y2KBadge>
            ))}
          </div>
        </div>
      )}

      {/* Bahan Sisa Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-space">Daftar Bahan Sisa</h2>
          {hasRole(['admin', 'staff']) && (
            <Button 
              onClick={() => navigate('/bahan')}
              className="bg-gradient-to-r from-y2k-pink to-y2k-purple hover:opacity-90"
            >
              <Package className="w-4 h-4 mr-2" />
              Kelola Bahan
            </Button>
          )}
        </div>
        <DataTable 
          data={bahanSisa.slice(0, 10)} 
          columns={columns}
        />
      </div>
    </div>
  );
}
