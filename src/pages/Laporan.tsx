import { useQuery } from '@tanstack/react-query';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { fetchWeeklyTrends, fetchTopMaterials, fetchTopProducts, fetchCategoryDistribution } from '@/services/api';
import { PageHeader } from '@/components/ui/page-header';
import { PieChart as PieChartIcon, TrendingUp, BarChart as BarChartIcon, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const COLORS = ['#FF69B4', '#E6E6FA', '#008080', '#98FF98', '#FFA500', '#f472b6', '#a78bfa', '#2dd4bf'];

export default function Laporan() {
    const { data: trends, isLoading: trendsLoading } = useQuery({
        queryKey: ['analytics-trends-weekly'],
        queryFn: fetchWeeklyTrends
    });

    const { data: topMaterials, isLoading: topMaterialsLoading } = useQuery({
        queryKey: ['analytics-top-materials'],
        queryFn: fetchTopMaterials
    });

    const { data: topProducts, isLoading: topProductsLoading } = useQuery({
        queryKey: ['analytics-top-products'],
        queryFn: fetchTopProducts
    });

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['analytics-categories'],
        queryFn: fetchCategoryDistribution
    });

    if (trendsLoading || topMaterialsLoading || topProductsLoading || categoriesLoading) {
        return <div className="p-8 text-center text-muted-foreground">Memuat data analitik...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Laporan Analitik"
                description="Analisis performa inventaris dan tren penggunaan bahan."
                icon={PieChartIcon}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Trends */}
                <Card className="col-span-1 lg:col-span-2 border-2 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                    <CardHeader className="bg-muted/30">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <CardTitle>Grafik stok mingguan</CardTitle>
                        </div>
                        <CardDescription>Perbandingan stok masuk, keluar, dan rusak (12 minggu terakhir)</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trends}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" fontSize={12} stroke="#888888" />
                                    <YAxis fontSize={12} stroke="#888888" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="masuk" stroke="#4ade80" strokeWidth={3} activeDot={{ r: 6 }} name="Masuk" />
                                    <Line type="monotone" dataKey="keluar" stroke="#f472b6" strokeWidth={3} name="Keluar" />
                                    <Line type="monotone" dataKey="rusak" stroke="#ef4444" strokeWidth={3} name="Rusak" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Materials */}
                <Card className="border-2 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                    <CardHeader className="bg-muted/30">
                        <div className="flex items-center gap-2">
                            <BarChartIcon className="w-5 h-5 text-y2k-purple" />
                            <CardTitle>Top 5 Bahan Digunakan</CardTitle>
                        </div>
                        <CardDescription>Bahan dengan penggunaan (stok keluar) tertinggi</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topMaterials} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                                    <XAxis type="number" fontSize={12} stroke="#888888" />
                                    <YAxis dataKey="name" type="category" width={150} fontSize={12} stroke="#888888" />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#a78bfa" radius={[0, 4, 4, 0]} barSize={32} name="Jumlah Keluar">
                                        {topMaterials?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card className="border-2 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                    <CardHeader className="bg-muted/30">
                        <div className="flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-y2k-pink" />
                            <CardTitle>Distribusi Kategori</CardTitle>
                        </div>
                        <CardDescription>Jumlah jenis bahan per kategori</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categories}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {categories?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="border-2 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                    <CardHeader className="bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-y2k-teal" />
                            <CardTitle>Top 5 Produk Diproduksi</CardTitle>
                        </div>
                        <CardDescription>Produk yang paling sering diproduksi</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[300px] w-full">
                            {topProducts && topProducts.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                                        <XAxis type="number" fontSize={12} stroke="#888888" />
                                        <YAxis dataKey="name" type="category" width={150} fontSize={12} stroke="#888888" />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="value" fill="#2dd4bf" radius={[0, 4, 4, 0]} barSize={32} name="Jumlah Produksi">
                                            {topProducts?.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    Belum ada data produksi
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
