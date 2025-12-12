import { useState } from 'react';
import { History, Search, Filter, ArrowUpCircle, ArrowDownCircle, AlertCircle } from 'lucide-react';
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
};

const tipeBadgeVariant: Record<TipeRiwayat, 'success' | 'warning' | 'danger'> = {
  masuk: 'success',
  keluar: 'warning',
  rusak: 'danger',
};

export default function RiwayatPage() {
  const { data: riwayatStok = [] } = useHistory();
  const [search, setSearch] = useState('');
  const [filterTipe, setFilterTipe] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'tanggal', direction: 'desc' });

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const filteredRiwayat = riwayatStok.filter(r => {
    const searchLower = search.toLowerCase();
    const matchSearch =
      r.nama_bahan?.toLowerCase().includes(searchLower) ||
      r.keterangan?.toLowerCase().includes(searchLower) ||
      r.warna?.toLowerCase().includes(searchLower) ||
      r.user_name?.toLowerCase().includes(searchLower) ||
      r.user_role?.toLowerCase().includes(searchLower) ||
      new Date(r.tanggal).toLocaleString('id-ID').toLowerCase().includes(searchLower) ||
      r.jumlah.toString().includes(searchLower);

    const matchTipe = filterTipe === 'all' || r.tipe === filterTipe;

    //date filtering
    let matchDate = true;
    if (dateRange.from || dateRange.to) {
      const itemDate = new Date(r.tanggal);
      const checkDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).getTime();

      const fromDate = dateRange.from ? new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate()).getTime() : null;
      const toDate = dateRange.to ? new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate()).getTime() : null;

      if (fromDate && checkDate < fromDate) matchDate = false;
      if (toDate && checkDate > toDate) matchDate = false;
    }

    return matchSearch && matchTipe && matchDate;
  }).sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue: any = (a as any)[key];
    let bValue: any = (b as any)[key];

    if (key === 'user') {
      aValue = a.user_name || '';
      bValue = b.user_name || '';
    } else if (key === 'bahan') {
      aValue = a.nama_bahan || '';
      bValue = b.nama_bahan || '';
    }

    if (key === 'tanggal') {
      aValue = new Date(a.tanggal).getTime();
      bValue = new Date(b.tanggal).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

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
      key: 'tanggal',
      header: renderHeader('Tanggal', 'tanggal'),
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
      header: renderHeader('Tipe', 'tipe'),
      render: (item: RiwayatStokExtended) => {
        const displayText = item.tipe.charAt(0).toUpperCase() + item.tipe.slice(1);
        return (
          <div className="flex items-center gap-2">
            {tipeIcons[item.tipe]}
            <Y2KBadge variant={tipeBadgeVariant[item.tipe]}>
              {displayText}
            </Y2KBadge>
          </div>
        );
      }
    },
    {
      key: 'bahan',
      header: renderHeader('Bahan', 'bahan'),
      render: (item: RiwayatStokExtended) => {
        const detail = item.berat_ukuran
          ? `${item.warna || ''} - ${item.berat_ukuran}`.trim()
          : item.warna || '';
        return (
          <div>
            <p className="font-medium">{item.nama_bahan || 'Bahan tidak diketahui'}</p>
            {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
          </div>
        );
      }
    },
    {
      key: 'jumlah',
      header: renderHeader('Jumlah', 'jumlah'),
      render: (item: RiwayatStokExtended) => (
        <span className={`font-bold ${item.tipe === 'masuk' ? 'text-success' :
          item.tipe === 'rusak' ? 'text-destructive' : 'text-y2k-orange'
          }`}>
          {item.tipe === 'masuk' ? '+' : '-'}{Math.floor(item.jumlah)}
        </span>
      )
    },
    {
      key: 'user',
      header: renderHeader('User', 'user'),
      render: (item: RiwayatStokExtended) => {
        return (
          <span className="text-sm">
            {item.user_name || 'Unknown'}
            <span className="text-muted-foreground text-xs ml-1">
              ({item.user_role || '-'})
            </span>
          </span>
        );
      }
    },
    {
      key: 'keterangan',
      header: renderHeader('Keterangan', 'keterangan'),
      render: (item: RiwayatStokExtended) => (
        <span className="text-sm text-muted-foreground whitespace-normal break-words max-w-[200px] block">
          {item.keterangan || '-'}
        </span>
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
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari semua data (bahan, user, tanggal, dll)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-2 h-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          {/* Tipe Filter */}
          <Select value={filterTipe} onValueChange={setFilterTipe}>
            <SelectTrigger className="w-[180px] rounded-xl border-2">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="masuk">Masuk</SelectItem>
              <SelectItem value="keluar">Keluar</SelectItem>
              <SelectItem value="rusak">Rusak</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter (Simple Native Inputs for Reliability) */}
          <div className="flex items-center gap-2 bg-card border-2 rounded-xl px-3 py-1">
            <span className="text-xs text-muted-foreground font-medium">Dari:</span>
            <input
              type="date"
              className="bg-transparent text-sm outline-none w-auto"
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.valueAsDate || undefined }))}
            />
            <span className="text-xs text-muted-foreground font-medium">Sampai:</span>
            <input
              type="date"
              className="bg-transparent text-sm outline-none w-auto"
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.valueAsDate || undefined }))}
            />
          </div>
        </div>
      </div>

      <DataTable data={filteredRiwayat} columns={columns} />
    </div>
  );
}
