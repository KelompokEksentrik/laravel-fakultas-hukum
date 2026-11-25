import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { gunakanAutentikasi } from '../../konteks/KonteksAutentikasi';

interface PropsTataLetak {
  judulHalaman: string;
  subJudul?: string;
  children: ReactNode;
}

const MENU_ADMIN = [
  { label: 'Ringkasan', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Manajemen Dosen', path: '/dashboard/dosen', icon: Users },
  { label: 'Manajemen Kurikulum', path: '/dashboard/kurikulum', icon: BookOpen },
  { label: 'Kalender Akademik', path: '/dashboard/kalender-akademik', icon: Calendar },
];

export default function TataLetakDashboard({
  judulHalaman,
  subJudul,
  children,
}: PropsTataLetak) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { pengguna, keluar } = gunakanAutentikasi();
  const [sidebarMobileTerbuka, setSidebarMobileTerbuka] = useState(false);

  const handleKeluar = async () => {
    await keluar();
    navigate('/masuk', { replace: true });
  };

  const isiSidebar = (
    <div className="h-full flex flex-col justify-between">
      {/* Bagian Atas + Daftar Menu */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-200 shrink-0">
          <img
            src="/unpam-logo.png"
            alt="Logo Fakultas Hukum"
            className="w-8 h-8 object-contain"
          />
          <div className="leading-tight">
            <div className="font-bold text-slate-900 text-sm">Fakultas Hukum</div>
            <div className="text-[11px] text-slate-500">Panel Admin</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {MENU_ADMIN.map((item) => {
            const Icon = item.icon;
            const aktif = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarMobileTerbuka(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  aktif
                    ? 'bg-[#800000] text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bagian Bawah: Selalu diam di dasar sidebar */}
      <div className="p-3 border-t border-slate-200 bg-white shrink-0 space-y-2">
        {pengguna && (
          <div className="px-3 py-1.5 text-xs">
            <div className="font-semibold text-slate-800 truncate">{pengguna.nama}</div>
            <div className="text-slate-500 truncate">{pengguna.email}</div>
          </div>
        )}
        <button
          type="button"
          onClick={handleKeluar}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex">
      {/* Sidebar Desktop: tinggi pas 1 layar (h-screen), tidak ikut memanjang */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 bg-white border-r border-slate-200">
        {isiSidebar}
      </aside>

      {/* Drawer Sidebar Mobile */}
      {sidebarMobileTerbuka && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarMobileTerbuka(false)}
          />
          <aside className="relative z-10 w-64 h-full bg-white border-r border-slate-200">
            <button
              type="button"
              onClick={() => setSidebarMobileTerbuka(false)}
              className="absolute top-4 right-3 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Tutup menu"
            >
              <X className="w-4 h-4" />
            </button>
            {isiSidebar}
          </aside>
        </div>
      )}

      {/* Area Konten Utama yang Melakukan Scroll */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarMobileTerbuka(true)}
            className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
            aria-label="Buka menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
              {judulHalaman}
            </h1>
            {subJudul && (
              <p className="text-xs text-slate-500">{subJudul}</p>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}