import { useState } from 'react';
import { AlertTriangle, Search, Filter, ArrowUpCircle, ArrowDownCircle} from 'lucide-react';
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
import { useBahanRusak } from '@/hooks/useInventory';
import type { BahanRusakExtended } from '@/services/api';

// export default function BahanRusakPage() {
//   const [search, setSearch] = useState('');

//   const filteredRusak = bahanRusakList.filter(r => {
//     const bahan = getBahanById(r.bahan_id);
//     return bahan?.nama_bahan.toLowerCase().includes(search.toLowerCase()) ||
//            r.alasan.toLowerCase().includes(search.toLowerCase());
//   }).sort((a, b) => new Date(b.tanggal_rusak).getTime() - new Date(a.tanggal_rusak).getTime());

export default function BahanRusakPage() {
  const [search, setSearch] = useState('');
  const [filterBahan, setFilterBahan] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ 
    key: 'tanggal_rusak', 
    direction: 'desc' 
  });

  const { data: bahanRusakList = [], isLoading, isError } = useBahanRusak();
  
  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const uniqueBahan = Array.from(new Set(bahanRusakList.map(r => r.nama_bahan))).sort();

  // Filter and Sort
  const filteredRusak = bahanRusakList.filter(r => {
    const searchLower = search.toLowerCase();
    const matchSearch = 
      r.nama_bahan?.toLowerCase().includes(searchLower) ||
      r.warna?.toLowerCase().includes(searchLower) ||
      r.alasan?.toLowerCase().includes(searchLower) ||
      r.user_name?.toLowerCase().includes(searchLower) ||
      r.user_role?.toLowerCase().includes(searchLower) ||
      new Date(r.tanggal_rusak).toLocaleString('id-ID').toLowerCase().includes(searchLower) ||
      r.jumlah.toString().includes(searchLower);

    const matchBahan = filterBahan === 'all' || r.nama_bahan === filterBahan;

    // Date Filtering
    let matchDate = true;
    if (dateRange.from || dateRange.to) {
      const itemDate = new Date(r.tanggal_rusak);
      const checkDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).getTime();

      const fromDate = dateRange.from ? new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate()).getTime() : null;
      const toDate = dateRange.to ? new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate()).getTime() : null;

      if (fromDate && checkDate < fromDate) matchDate = false;
      if (toDate && checkDate > toDate) matchDate = false;
    }

    return matchSearch && matchBahan && matchDate;
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

    if (key === 'tanggal_rusak') {
      aValue = new Date(a.tanggal_rusak).getTime();
      bValue = new Date(b.tanggal_rusak).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Sort Icon Component
  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpCircle className="w-4 h-4 text-muted-foreground/30" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUpCircle className="w-4 h-4 text-primary" />
      : <ArrowDownCircle className="w-4 h-4 text-primary" />;
  };

  // Render Header with Sort
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
      key: 'tanggal_rusak',
      header: renderHeader('Tanggal', 'tanggal_rusak'),
      render: (item: BahanRusakExtended) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {new Date(item.tanggal_rusak).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      )
    },
    {
      key: 'bahan',
      header: renderHeader('Bahan', 'bahan'),
      render: (item: BahanRusakExtended) => (
        <div>
            <p className="font-medium">{item.nama_bahan}</p>
            <p className="text-xs text-muted-foreground">
              {item.warna} • {item.berat_ukuran}
            </p>
        </div>
      )
    },
    {
      key: 'jumlah',
      header: renderHeader('Jumlah', 'jumlah'),
      render: (item: BahanRusakExtended) => (
        <Y2KBadge variant="danger" size="md">
          {Math.floor(item.jumlah)} unit
        </Y2KBadge>
      )
    },
    {
      key: 'alasan',
      header: renderHeader('Alasan Kerusakan', 'alasan'),
      render: (item: BahanRusakExtended) => (
        <div className="max-w-xs">
          <span className="text-sm line-clamp-2">{item.alasan}</span>
        </div>
      )
    },
    {
      key: 'user',
      header: renderHeader('Dilaporkan Oleh', 'user'),
      render: (item: BahanRusakExtended) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{item.user_name || 'Unknown'}</span>
          <span className="text-muted-foreground text-xs ml-1">({item.user_role || '-'})</span>
        </div>
      ),
    },
  ];

  const totalRusak = Array.isArray(bahanRusakList) 
    ? bahanRusakList.reduce((sum, r) => sum + (Number(r.jumlah) || 0), 0)
    : 0;

  // if (isLoading) {
  //   return <div className="p-8 text-center">Loading...</div>;
  // }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Bahan Rusak" 
        description="Daftar bahan yang rusak atau tidak dapat digunakan"
        icon={AlertTriangle}
      />

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive/30 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-destructive/20">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bahan Rusak</p>
              <p className="text-2xl font-bold text-destructive font-space">
                {Math.floor(totalRusak)} unit
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari semua data (bahan, user, warna, alasan, dll)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-2 h-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          {/* Date Filter */}
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

      <DataTable 
        data={filteredRusak} 
        columns={columns}
        emptyMessage="Tidak ada bahan rusak tercatat"
      />
    </div>
  );
}
