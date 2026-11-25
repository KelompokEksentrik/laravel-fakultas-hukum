import { Link } from 'react-router-dom';
import { Users, BookOpen, CalendarDays, ArrowRight } from 'lucide-react';
import TataLetakDashboard from '../../layout/dashboard';

const kartuMenu = [
    {
        judul: 'Manajemen Dosen',
        deskripsi: 'Kelola profil dosen, NIDN, jabatan fungsional, dan bidang keahlian.',
        ke: '/dashboard/dosen',
        ikon: Users,
    },
    {
        judul: 'Manajemen Kurikulum',
        deskripsi: 'Kelola daftar mata kuliah, semester, beban SKS, dan prasyarat.',
        ke: '/dashboard/kurikulum',
        ikon: BookOpen,
    },
    {
        judul: 'Kalender Akademik',
        deskripsi: 'Kelola jadwal kegiatan akademik per tahun ajaran dan semester.',
        ke: '/dashboard/kalender-akademik',
        ikon: CalendarDays,
    },
];

export default function RingkasanDashboard() {
    return (
        <TataLetakDashboard
            judulHalaman="Ringkasan Dashboard"
            subJudul="Kelola 3 modul utama yang terhubung ke halaman publik"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {kartuMenu.map((item) => {
                    const Ikon = item.ikon;
                    return (
                        <Link
                            key={item.ke}
                            to={item.ke}
                            className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-amber-900/40 hover:shadow-sm transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-10 h-10 rounded-lg bg-amber-950/5 text-amber-950 flex items-center justify-center mb-4">
                                    <Ikon className="w-5 h-5" />
                                </div>
                                <h2 className="text-base font-semibold text-slate-900 group-hover:text-amber-950">
                                    {item.judul}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1.5">{item.deskripsi}</p>
                            </div>
                            <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-amber-950">
                                <span>Buka menu</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </TataLetakDashboard>
    );
}