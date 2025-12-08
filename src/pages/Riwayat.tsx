import { useState } from 'react';
import { History, Search, Filter, ArrowUpCircle, ArrowDownCircle, AlertCircle, Factory } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Y2KBadge } from '@/components/ui/y2k-badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHistory } from '@/hooks/useInventory';
import type { TipeRiwayat } from '@/types/database';
import type { RiwayatStokExtended } from '@/services/api';

const tipeIcons: Record<TipeRiwayat, React.ReactNode> = {
  masuk: <ArrowUpCircle className="w-4 h-4 text-success" />,
  keluar: <ArrowDownCircle className="w-4 h-4 text-y2k-orange" />,
  rusak: <AlertCircle className="w-4 h-4 text-destructive" />,
  produksi: <Factory className="w-4 h-4 text-y2k-purple" />,
};

const tipeBadgeVariant: Record<TipeRiwayat, 'success' | 'warning' | 'danger' | 'lavender'> = {
  masuk: 'success',
  keluar: 'warning',
  rusak: 'danger',
  produksi: 'lavender',
};

export default function RiwayatPage() {
  const { data: riwayatStok = [] } = useHistory();
  const [search, setSearch] = useState('');
  const [filterTipe, setFilterTipe] = useState('all');

  const filteredRiwayat = riwayatStok.filter(r => {
    const matchSearch = r.nama_bahan.toLowerCase().includes(search.toLowerCase()) ||
      r.keterangan.toLowerCase().includes(search.toLowerCase());
    const matchTipe = filterTipe === 'all' || r.tipe === filterTipe;
    return matchSearch && matchTipe;
  }).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const columns = [
    {
      key: 'tanggal',
      header: 'Tanggal',
      render: (item: RiwayatStokExtended) => (
        <span className="text-sm">
          {new Date(item.tanggal).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      )
    },
    {
      key: 'tipe',
      header: 'Tipe',
      render: (item: RiwayatStokExtended) => (
        <div className="flex items-center gap-2">
          {tipeIcons[item.tipe]}
          <Y2KBadge variant={tipeBadgeVariant[item.tipe]}>
            {item.tipe.charAt(0).toUpperCase() + item.tipe.slice(1)}
          </Y2KBadge>
        </div>
      )
    },
    {
      key: 'bahan',
      header: 'Bahan',
      render: (item: RiwayatStokExtended) => {
        return (
          <div>
            <p className="font-medium">{item.nama_bahan}</p>
            <p className="text-xs text-muted-foreground">{item.warna}</p>
          </div>
        );
      }
    },
    {
      key: 'jumlah',
      header: 'Jumlah',
      render: (item: RiwayatStokExtended) => (
        <span className={`font-bold ${item.tipe === 'masuk' ? 'text-success' :
            item.tipe === 'rusak' ? 'text-destructive' : 'text-y2k-orange'
          }`}>
          {item.tipe === 'masuk' ? '+' : '-'}{item.jumlah}
        </span>
      )
    },
    {
      key: 'user',
      header: 'User',
      render: (item: RiwayatStokExtended) => {
        return (
          <span className="text-sm">{item.user_name || 'Unknown'}</span>
        );
      }
    },
    {
      key: 'keterangan',
      header: 'Keterangan',
      render: (item: RiwayatStokExtended) => (
        <span className="text-sm text-muted-foreground">{item.keterangan || '-'}</span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Stok"
        description="Log semua aktivitas inventaris"
        icon={History}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari bahan atau keterangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-2"
          />
        </div>
        <Select value={filterTipe} onValueChange={setFilterTipe}>
          <SelectTrigger className="w-full sm:w-48 rounded-xl border-2">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="masuk">Masuk</SelectItem>
            <SelectItem value="keluar">Keluar</SelectItem>
            <SelectItem value="rusak">Rusak</SelectItem>
            <SelectItem value="produksi">Produksi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filteredRiwayat} columns={columns} />
    </div>
  );
}
