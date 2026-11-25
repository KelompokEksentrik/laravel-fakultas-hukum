import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CalendarDays,
    LogOut,
    Menu,
    X,
    Scale,
    ExternalLink,
} from 'lucide-react';
import { gunakanAutentikasi } from '../konteks/KonteksAutentikasi';

interface TataLetakDashboardProps {
    judulHalaman: string;
    subJudul?: string;
    children: ReactNode;
}

const menuNavigasi = [
    { label: 'Ringkasan', ke: '/dashboard', ikon: LayoutDashboard, akhir: true },
    { label: 'Dosen', ke: '/dashboard/dosen', ikon: Users, akhir: false },
    { label: 'Kurikulum', ke: '/dashboard/kurikulum', ikon: BookOpen, akhir: false },
    { label: 'Kalender Akademik', ke: '/dashboard/kalender-akademik', ikon: CalendarDays, akhir: false },
];

export default function TataLetakDashboard({
    judulHalaman,
    subJudul,
    children,
}: TataLetakDashboardProps) {
    const { pengguna, keluar } = gunakanAutentikasi();
    const navigate = useNavigate();
    const [sidebarTerbuka, setSidebarTerbuka] = useState(false);

    const tanganiKeluar = async () => {
        await keluar();
        navigate('/masuk', { replace: true });
    };

    return (
        <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-slate-50 flex">
            {/* Overlay mobile */}
            {sidebarTerbuka && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
                    onClick={() => setSidebarTerbuka(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-64 h-screen shrink-0 bg-amber-950 text-amber-50 flex flex-col transition-transform duration-200 ${sidebarTerbuka ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="h-16 px-5 flex items-center justify-between border-b border-amber-900/70 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-400/15 text-amber-300 flex items-center justify-center">
                            <Scale className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold leading-tight text-white">FH Admin</p>
                            <p className="text-[11px] text-amber-300/80">Panel Pengelola</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSidebarTerbuka(false)}
                        className="lg:hidden text-amber-200 hover:text-white p-1"
                        aria-label="Tutup menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-amber-300/60">
                        Menu Utama
                    </p>
                    {menuNavigasi.map((item) => {
                        const Ikon = item.ikon;
                        return (
                            <NavLink
                                key={item.ke}
                                to={item.ke}
                                end={item.akhir}
                                onClick={() => setSidebarTerbuka(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-amber-400/20 text-white'
                                        : 'text-amber-100/80 hover:bg-amber-900/60 hover:text-white'
                                    }`
                                }
                            >
                                <Ikon className="w-4 h-4 shrink-0" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-amber-900/70 space-y-3 shrink-0">
                    <div className="px-2">
                        <p className="text-xs font-medium text-white truncate">{pengguna?.nama || 'Admin'}</p>
                        <p className="text-[11px] text-amber-200/70 truncate">{pengguna?.email}</p>
                    </div>
                    <button
                        type="button"
                        onClick={tanganiKeluar}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-900/70 hover:bg-amber-900 text-amber-100 text-sm font-medium py-2 px-3 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Area Utama */}
            <div className="flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-y-auto">
                <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-4 lg:px-7 flex items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => setSidebarTerbuka(true)}
                            className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                            aria-label="Buka menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-base lg:text-lg font-bold text-slate-900 truncate">
                                {judulHalaman}
                            </h1>
                            {subJudul && (
                                <p className="text-xs text-slate-500 truncate hidden sm:block">{subJudul}</p>
                            )}
                        </div>
                    </div>

                    <a
                        href="/publik/dosen"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-950 bg-amber-100/80 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >
                        <span>Lihat Halaman Publik</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </header>

                <main className="flex-1 p-4 lg:p-7">{children}</main>
            </div>
        </div>
    );
}