import { useState } from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Y2KBadge } from '@/components/ui/y2k-badge';
import { Input } from '@/components/ui/input';
import { bahanRusak, getBahanById, getUserById } from '@/data/mockData';
import type { BahanRusak } from '@/types/database';

export default function BahanRusakPage() {
  const [search, setSearch] = useState('');

  const filteredRusak = bahanRusak.filter(r => {
    const bahan = getBahanById(r.bahan_id);
    return bahan?.nama_bahan.toLowerCase().includes(search.toLowerCase()) ||
           r.alasan.toLowerCase().includes(search.toLowerCase());
  }).sort((a, b) => new Date(b.tanggal_rusak).getTime() - new Date(a.tanggal_rusak).getTime());

  const columns = [
    {
      key: 'tanggal_rusak',
      header: 'Tanggal',
      render: (item: BahanRusak) => (
        <span className="text-sm">
          {new Date(item.tanggal_rusak).toLocaleDateString('id-ID', {
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
      key: 'bahan',
      header: 'Bahan',
      render: (item: BahanRusak) => {
        const bahan = getBahanById(item.bahan_id);
        return (
          <div>
            <p className="font-medium">{bahan?.nama_bahan}</p>
            <p className="text-xs text-muted-foreground">{bahan?.warna}</p>
          </div>
        );
      }
    },
    {
      key: 'jumlah',
      header: 'Jumlah',
      render: (item: BahanRusak) => (
        <Y2KBadge variant="danger" size="md">
          {item.jumlah} unit
        </Y2KBadge>
      )
    },
    {
      key: 'alasan',
      header: 'Alasan Kerusakan',
      render: (item: BahanRusak) => (
        <span className="text-sm">{item.alasan}</span>
      )
    },
    {
      key: 'user',
      header: 'Dilaporkan Oleh',
      render: (item: BahanRusak) => {
        const user = getUserById(item.user_id);
        return (
          <span className="text-sm">{user?.nama}</span>
        );
      }
    },
  ];

  const totalRusak = bahanRusak.reduce((sum, r) => sum + r.jumlah, 0);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Bahan Rusak" 
        description="Daftar bahan yang rusak atau tidak dapat digunakan"
        icon={AlertTriangle}
      />

      {/* Summary */}
      <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-destructive/20">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Bahan Rusak</p>
            <p className="text-2xl font-bold text-destructive font-space">{totalRusak} unit</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari bahan atau alasan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl border-2"
        />
      </div>

      <DataTable 
        data={filteredRusak} 
        columns={columns}
        emptyMessage="Tidak ada bahan rusak tercatat"
      />
    </div>
  );
}
