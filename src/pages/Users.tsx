import { useState } from 'react';
import { Users as UsersIcon, Plus, Edit, Trash2, Shield, User as UserIcon, Briefcase, RefreshCcw } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Y2KBadge } from '@/components/ui/y2k-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUsers } from '@/hooks/useInventory';
import type { User, UserRole } from '@/types/database';

const roleIcons: Record<UserRole, React.ReactNode> = {
  admin: <Shield className="w-4 h-4" />,
  staff: <UserIcon className="w-4 h-4" />,
  manager: <Briefcase className="w-4 h-4" />,
};

const roleBadgeVariant: Record<UserRole, 'pink' | 'teal' | 'lavender'> = {
  admin: 'pink',
  staff: 'teal',
  manager: 'lavender',
};

export default function UsersPage() {
  const { toast } = useToast();
  const [status, setStatus] = useState<'active' | 'deleted'>('active');
  const { users, createUser, updateUser, deleteUser, restoreUser, isLoading } = useUsers(status);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  /* ... handlers ... */
  // Preserving handlers but ensuring I don't lose them.
  // Actually, replace_file_content replaces a block. I need to be careful not to delete handlers if I replace `UsersPage` body.
  // I will only replace the beginning of component to add state, and the return block to add tabs.
  // Since I can't easily split edits, I will rewrite the component body logic and return statement mainly.

  // Let's replace the top part first to add state.
  // Then replace the return part.
  // Wait, I can do it in two chunks? No, replace_file_content is single contiguous.
  // I'll use multi_replace.

  // Chunk 1: Add state status
  // Chunk 2: Add Tabs in JSX

  // Wait, current `useUsers` invocation is line 41: `const { users, ... } = useUsers();`
  // I change it to `useUsers(status)`.


  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'staff' as UserRole,
  });

  const openAddDialog = () => {
    setEditingUser(null);
    setFormData({ nama: '', email: '', password: '', role: 'staff' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      nama: user.nama,
      email: user.email,
      password: '',
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nama || !formData.email) {
      toast({
        title: "Error",
        description: "Mohon lengkapi nama dan email",
        variant: "destructive",
      });
      return;
    }

    if (!editingUser && !formData.password) {
      toast({
        title: "Error",
        description: "Password wajib diisi untuk user baru",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingUser) {
        await updateUser({
          id: editingUser.user_id,
          user: {
            nama: formData.nama,
            email: formData.email,
            role: formData.role,
            ...(formData.password ? { password: formData.password } : {})
          }
        });
        toast({ title: "Berhasil", description: "User berhasil diperbarui" });
      } else {
        await createUser({
          nama: formData.nama,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        toast({ title: "Berhasil", description: "User baru berhasil ditambahkan" });
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Hapus user "${user.nama}"?`)) {
      try {
        await deleteUser(user.user_id);
        toast({ title: "Berhasil", description: "User berhasil dihapus" });
      } catch (error: any) {
        toast({
          title: "Gagal",
          description: error.message || "Gagal menghapus user",
          variant: "destructive"
        });
      }
    }
  };

  const handleRestore = async (user: User) => {
    if (confirm(`Aktifkan kembali user "${user.nama}"?`)) {
      try {
        await restoreUser(user.user_id);
        toast({ title: "Berhasil", description: "User berhasil diaktifkan kembali" });
      } catch (error: any) {
        toast({
          title: "Gagal",
          description: error.message || "Gagal mengaktifkan user",
          variant: "destructive"
        });
      }
    }
  };

  const columns = [
    {
      key: 'nama',
      header: 'Nama',
      render: (item: User) => (
        <span className="font-medium">{item.nama}</span>
      )
    },
    {
      key: 'email',
      header: 'Email',
      render: (item: User) => (
        <span className="text-muted-foreground">{item.email}</span>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (item: User) => (
        <div className="flex items-center gap-2">
          {roleIcons[item.role]}
          <Y2KBadge variant={roleBadgeVariant[item.role]}>
            {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
          </Y2KBadge>
        </div>
      )
    },
    {
      key: 'created_at',
      header: 'Terdaftar',
      render: (item: User) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.created_at).toLocaleDateString('id-ID')}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: User) => (
        <div className="flex gap-2">
          {status === 'active' ? (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 rounded-lg"
                onClick={() => openEditDialog(item)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 rounded-lg border-destructive/50 text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(item)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 rounded-lg border-success/50 text-success hover:bg-success/10"
              onClick={() => handleRestore(item)}
              title="Aktifkan Kembali"
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Akun"
        description="Manajemen user dan hak akses"
        icon={UsersIcon}
      >
        {status === 'active' && (
          <Button
            onClick={openAddDialog}
            className="bg-gradient-to-r from-y2k-pink to-y2k-purple hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah User
          </Button>
        )}
      </PageHeader>

      <div className="flex space-x-2 border-b-2 border-border/50 pb-1">
        <button
          onClick={() => setStatus('active')}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${status === 'active'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-primary/70'
            }`}
        >
          Akun Aktif
          {status === 'active' && (
            <div className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-primary rounded-full transition-all" />
          )}
        </button>
        <button
          onClick={() => setStatus('deleted')}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${status === 'deleted'
            ? 'text-destructive'
            : 'text-muted-foreground hover:text-destructive/70'
            }`}
        >
          Akun Dihapus
          {status === 'deleted' && (
            <div className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-destructive rounded-full transition-all" />
          )}
        </button>
      </div>

      {isLoading ? (
        <div>Loading Users...</div>
      ) : (
        <DataTable data={users} columns={columns} />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-space">
              {editingUser ? 'Edit User' : 'Tambah User Baru'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                className="rounded-xl border-2"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="rounded-xl border-2"
              />
            </div>
            <div className="space-y-2">
              <Label>{editingUser ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="rounded-xl border-2"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData(prev => ({ ...prev, role: v as UserRole }))}
              >
                <SelectTrigger className="rounded-xl border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-y2k-pink to-y2k-purple hover:opacity-90 rounded-xl"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
