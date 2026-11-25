import { type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PenyediaAutentikasi, gunakanAutentikasi } from './konteks/KonteksAutentikasi';
import LandingPage from './page/LandingPage';
import HalamanMasuk from './page/auth/login';
import RingkasanDashboard from './page/dashboard/dashboard';
import TataLetakDashboard from './layout/dashboard';

function RuteTerproteksi({ children }: { children: ReactNode }) {
  const { sudahMasuk, memuat } = gunakanAutentikasi();

  if (memuat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Memeriksa sesi...</span>
      </div>
    );
  }

  if (!sudahMasuk) {
    return <Navigate to="/masuk" replace />;
  }

  return <>{children}</>;
}

function PlaceholderMenu({ judul, subJudul }: { judul: string; subJudul: string }) {
  return (
    <TataLetakDashboard judulHalaman={judul} subJudul={subJudul}>
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-sm text-slate-600">
        Halaman {judul} siap dihubungkan dengan API & form CRUD pada tahap berikutnya.
      </div>
    </TataLetakDashboard>
  );
}

export default function App() {
  return (
    <PenyediaAutentikasi>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/masuk" element={<HalamanMasuk />} />

          <Route
            path="/dashboard"
            element={
              <RuteTerproteksi>
                <RingkasanDashboard />
              </RuteTerproteksi>
            }
          />
          <Route
            path="/dashboard/dosen"
            element={
              <RuteTerproteksi>
                <PlaceholderMenu
                  judul="Manajemen Dosen"
                  subJudul="Tambah, ubah, dan hapus data dosen"
                />
              </RuteTerproteksi>
            }
          />
          <Route
            path="/dashboard/kurikulum"
            element={
              <RuteTerproteksi>
                <PlaceholderMenu
                  judul="Manajemen Kurikulum"
                  subJudul="Tambah, ubah, dan hapus mata kuliah"
                />
              </RuteTerproteksi>
            }
          />
          <Route
            path="/dashboard/kalender-akademik"
            element={
              <RuteTerproteksi>
                <PlaceholderMenu
                  judul="Kalender Akademik"
                  subJudul="Tambah, ubah, dan hapus agenda akademik"
                />
              </RuteTerproteksi>
            }
          />

          <Route path="*" element={<Navigate to="/masuk" replace />} />
        </Routes>
      </BrowserRouter>
    </PenyediaAutentikasi>
  );
}