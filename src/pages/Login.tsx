import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Recycle, Sparkles, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login Berhasil! ✨",
          description: "Selamat datang di Craft Cycle",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Gagal",
          description: "Email atau password salah",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-y2k-pink-light/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-y2k-teal-light/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-y2k-lavender-light/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="y2k-card p-8 space-y-8">
          {/* Logo */}
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-y2k-pink to-y2k-teal shadow-glow animate-pulse-glow">
              <Recycle className="w-12 h-12 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient font-space">Craft Cycle</h1>
              <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-y2k-pink" />
                Transforming Waste into Wonders
                <Sparkles className="w-4 h-4 text-y2k-teal" />
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@craftcycle.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-2 border-border/60 bg-card/50 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-2 border-border/60 bg-card/50 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-lg font-semibold bg-gradient-to-r from-y2k-pink to-y2k-purple hover:opacity-90 transition-opacity shadow-y2k"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground text-center mb-3">Demo Akun:</p>
            <div className="grid gap-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                <span className="font-medium">Admin</span>
                <code className="text-y2k-pink">admin@craftcycle.id / admin123</code>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                <span className="font-medium">Staff</span>
                <code className="text-y2k-teal">staff@craftcycle.id / staff123</code>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                <span className="font-medium">Manager</span>
                <code className="text-y2k-purple">manager@craftcycle.id / manager123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
