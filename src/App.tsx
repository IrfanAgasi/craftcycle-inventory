import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BahanSisa from "./pages/BahanSisa";
import StokMasuk from "./pages/StokMasuk";
import StokKeluar from "./pages/StokKeluar";
import Produksi from "./pages/Produksi";
import Riwayat from "./pages/Riwayat";
import BahanRusakPage from "./pages/BahanRusakPage";
import Kategori from "./pages/Kategori";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bahan" element={<BahanSisa />} />
              <Route path="/stok-masuk" element={<StokMasuk />} />
              <Route path="/stok-keluar" element={<StokKeluar />} />
              <Route path="/produksi" element={<Produksi />} />
              <Route path="/riwayat" element={<Riwayat />} />
              <Route path="/rusak" element={<BahanRusakPage />} />
              <Route path="/kategori" element={<Kategori />} />
              <Route path="/users" element={<Users />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
