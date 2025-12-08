import { 
  LayoutDashboard, 
  Package, 
  PackagePlus, 
  PackageMinus, 
  History, 
  Sparkles, 
  AlertTriangle,
  Users,
  FolderOpen,
  LogOut,
  Recycle
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const menuItems = [
  { 
    title: 'Dashboard', 
    url: '/dashboard', 
    icon: LayoutDashboard,
    roles: ['admin', 'staff', 'manager'] as const
  },
  { 
    title: 'Bahan Sisa', 
    url: '/bahan', 
    icon: Package,
    roles: ['admin', 'staff', 'manager'] as const
  },
  { 
    title: 'Stok Masuk', 
    url: '/stok-masuk', 
    icon: PackagePlus,
    roles: ['admin', 'staff'] as const
  },
  { 
    title: 'Stok Keluar', 
    url: '/stok-keluar', 
    icon: PackageMinus,
    roles: ['admin', 'staff'] as const
  },
  { 
    title: 'Auto Craft', 
    url: '/produksi', 
    icon: Sparkles,
    roles: ['admin', 'staff', 'manager'] as const
  },
  { 
    title: 'Riwayat Stok', 
    url: '/riwayat', 
    icon: History,
    roles: ['admin', 'staff', 'manager'] as const
  },
  { 
    title: 'Bahan Rusak', 
    url: '/rusak', 
    icon: AlertTriangle,
    roles: ['admin', 'manager'] as const
  },
  { 
    title: 'Kategori', 
    url: '/kategori', 
    icon: FolderOpen,
    roles: ['admin'] as const
  },
  { 
    title: 'Kelola Akun', 
    url: '/users', 
    icon: Users,
    roles: ['admin'] as const
  },
];

export function AppSidebar() {
  const { user, logout, hasRole } = useAuth();

  const filteredMenu = menuItems.filter(item => hasRole([...item.roles]));

  return (
    <aside className="w-64 min-h-screen bg-card/90 backdrop-blur-xl border-r-2 border-border/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-y2k-pink to-y2k-teal flex items-center justify-center shadow-y2k">
            <Recycle className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient font-space">Craft Cycle</h1>
            <p className="text-xs text-muted-foreground">Inventory System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 rounded-2xl bg-gradient-to-r from-y2k-pink-light/50 to-y2k-lavender-light/50 border border-border/30">
        <p className="font-medium text-foreground truncate">{user?.nama}</p>
        <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
            activeClassName="bg-primary/10 text-primary font-medium shadow-sm border border-primary/20"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
