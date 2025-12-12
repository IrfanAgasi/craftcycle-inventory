import { useQuery } from '@tanstack/react-query';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { fetchUserPerformance } from '@/services/api';
import { PageHeader } from '@/components/ui/page-header';
import { ClipboardCheck, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Y2KBadge } from '@/components/ui/y2k-badge';

export default function AuditUser() {
    const { data: users, isLoading } = useQuery({
        queryKey: ['user-performance'],
        queryFn: fetchUserPerformance
    });

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Memuat data audit...</div>;
    }

    const columns = [
        {
            key: 'nama',
            header: 'Nama User',
            render: (item: any) => (
                <div>
                    <p className="font-medium">{item.nama}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item.role}</p>
                </div>
            )
        },
        {
            key: 'total_masuk',
            header: 'Input Stok',
            render: (item: any) => (
                <span className="font-medium text-success">{item.total_masuk} kali</span>
            )
        },
        {
            key: 'total_keluar',
            header: 'Barang Keluar',
            render: (item: any) => (
                <span className="font-medium text-y2k-orange">{item.total_keluar} kali</span>
            )
        },
        {
            key: 'total_rusak',
            header: 'Laporan Rusak',
            render: (item: any) => (
                <span className="font-medium text-destructive">{item.total_rusak} kali</span>
            )
        },
        {
            key: 'last_active',
            header: 'Terakhir Aktif',
            render: (item: any) => (
                <span className="text-sm text-muted-foreground">
                    {item.last_active
                        ? new Date(item.last_active).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })
                        : 'Belum ada aktivitas'}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Audit Kinerja User"
                description="Monitoring aktivitas dan kinerja staff."
                icon={ClipboardCheck}
            />

            {/* Performance Chart */}
            <Card className="border-2 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        <CardTitle>Aktivitas User</CardTitle>
                    </div>
                    <CardDescription>Perbandingan jumlah transaksi per user</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={users}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="nama" fontSize={12} stroke="#888888" />
                                <YAxis fontSize={12} stroke="#888888" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="total_masuk" name="Input Masuk" fill="#4ade80" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="total_keluar" name="Barang Keluar" fill="#f472b6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Table */}
            <Card className="border-none shadow-none bg-transparent">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold font-space">Detail Kinerja</h2>
                </div>
                <DataTable data={users} columns={columns} />
            </Card>
        </div>
    );
}
