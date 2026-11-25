import { useState } from "react";
import { Link } from "react-router-dom";

interface InfoItem {
    kategori: string;
    judul: string;
    ringkasan: string;
}

const INFORMASI_UTAMA: InfoItem[] = [
    {
        kategori: "Profil & Akademik",
        judul: "Visi, Misi & Kurikulum Hukum",
        ringkasan:
            "Informasi penyelenggaraan pendidikan tinggi ilmu hukum, struktur kurikulum, serta bidang kajian hukum perdata, pidana, tata negara, dan bisnis.",
    },
    {
        kategori: "Kemahasiswaan",
        judul: "Layanan & Administrasi Perkuliahan",
        ringkasan:
            "Panduan alur administrasi akademik, bimbingan skripsi/tugas akhir, perwalian, serta ketentuan kegiatan akademik mahasiswa.",
    },
    {
        kategori: "Kegiatan & Publikasi",
        judul: "Seminar, Kajian Ilmiah & Berita Fakultas",
        ringkasan:
            "Ringkasan agenda diskusi hukum, kuliah umum, pengabdian kepada masyarakat, serta pengumuman resmi fakultas.",
    },
];

const PENGUMUMAN_RINGKAS: string[] = [
    "Kalender akademik dan jadwal perkuliahan semester berjalan dapat dipantau melalui portal resmi fakultas.",
    "Layanan administrasi dan informasi akademik tersedia bagi civitas akademika serta masyarakat umum.",
    "Pengumuman seminar, workshop hukum, dan kegiatan fakultas diperbarui secara berkala.",
];

export default function LandingPage() {
    const [menuTerbuka, setMenuTerbuka] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
            {/* Headbar */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                    <Link to="/" className="flex items-center gap-3 shrink-0">
                        <img
                            src="/unpam-logo.png"
                            alt="Logo Fakultas Hukum"
                            className="h-9 w-9 object-contain"
                        />
                        <div className="leading-tight">
                            <div className="font-bold text-slate-900 text-sm sm:text-base">
                                Fakultas Hukum
                            </div>
                            <div className="text-[11px] text-slate-500 hidden sm:block">
                                Portal Informasi Publik
                            </div>
                        </div>
                    </Link>

                    {/* Navigasi Desktop */}
                    <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
                        <a href="#beranda" className="hover:text-slate-900 transition">
                            Beranda
                        </a>
                        <a href="#informasi" className="hover:text-slate-900 transition">
                            Informasi
                        </a>
                        <a href="#pengumuman" className="hover:text-slate-900 transition">
                            Pengumuman
                        </a>
                        <a href="#kontak" className="hover:text-slate-900 transition">
                            Kontak
                        </a>
                    </nav>

                    {/* Aksi Kanan: Tombol Login ke /masuk + Menu Mobile */}
                    <div className="flex items-center gap-2.5">
                        <Link
                            to="/masuk"
                            className="px-4 py-2 rounded-lg bg-amber-950 text-white text-sm font-semibold hover:bg-amber-900 transition shadow-xs"
                        >
                            Login
                        </Link>

                        <button
                            type="button"
                            onClick={() => setMenuTerbuka((prev) => !prev)}
                            className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
                            aria-label="Buka menu navigasi"
                        >
                            {menuTerbuka ? "✕" : "☰"}
                        </button>
                    </div>
                </div>

                {/* Menu Mobile */}
                {menuTerbuka && (
                    <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2 text-sm font-medium text-slate-700">
                        <a
                            href="#beranda"
                            onClick={() => setMenuTerbuka(false)}
                            className="block py-1.5 hover:text-slate-950"
                        >
                            Beranda
                        </a>
                        <a
                            href="#informasi"
                            onClick={() => setMenuTerbuka(false)}
                            className="block py-1.5 hover:text-slate-950"
                        >
                            Informasi
                        </a>
                        <a
                            href="#pengumuman"
                            onClick={() => setMenuTerbuka(false)}
                            className="block py-1.5 hover:text-slate-950"
                        >
                            Pengumuman
                        </a>
                        <a
                            href="#kontak"
                            onClick={() => setMenuTerbuka(false)}
                            className="block py-1.5 hover:text-slate-950"
                        >
                            Kontak
                        </a>
                    </div>
                )}
            </header>

            {/* Konten Utama */}
            <main className="flex-1">
                {/* Hero Banner */}
                <section id="beranda" className="bg-white border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20 grid md:grid-cols-12 gap-10 items-center">
                        <div className="md:col-span-7 space-y-5">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                                Sistem Informasi & Layanan Fakultas Hukum
                            </span>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                                Pusat Informasi Akademik & Profil Fakultas Hukum
                            </h1>
                            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                                Halaman informasi resmi yang menyajikan profil fakultas, layanan akademik, agenda kegiatan, serta pengumuman penting bagi mahasiswa, dosen, dan pengunjung.
                            </p>
                            <div className="pt-2 flex flex-wrap items-center gap-3">
                                <a
                                    href="#informasi"
                                    className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                                >
                                    Jelajahi Informasi
                                </a>
                                <Link
                                    to="/masuk"
                                    className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition"
                                >
                                    Masuk ke Akun
                                </Link>
                            </div>
                        </div>

                        {/* Kartu Ringkasan Cepat */}
                        <div id="pengumuman" className="md:col-span-5">
                            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 shadow-xs">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-slate-900 text-base">
                                        Informasi & Pengumuman
                                    </h2>
                                    <span className="text-xs font-medium text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                                        Terkini
                                    </span>
                                </div>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    {PENGUMUMAN_RINGKAS.map((item, index) => (
                                        <li
                                            key={index}
                                            className="p-3.5 rounded-xl bg-white border border-slate-200/80 leading-relaxed"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Baris Ringkasan Singkat */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Program Studi
                            </div>
                            <div className="text-xl font-bold text-slate-900 mt-1">
                                Ilmu Hukum (S1)
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Pembelajaran teori dan praktik hukum terpadu.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Layanan Publik
                            </div>
                            <div className="text-xl font-bold text-slate-900 mt-1">
                                Informasi Terbuka
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Dapat diakses langsung tanpa perlu login terlebih dahulu.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Akses Internal
                            </div>
                            <div className="text-xl font-bold text-slate-900 mt-1">
                                Portal Pengguna
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Gunakan menu Login di atas untuk masuk ke halaman `/masuk`.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Daftar Informasi Utama */}
                <section id="informasi" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Informasi Fakultas Hukum
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-1.5">
                            Rangkuman informasi utama yang ditampilkan pada halaman depan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {INFORMASI_UTAMA.map((info) => (
                            <article
                                key={info.judul}
                                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition"
                            >
                                <div>
                                    <span className="inline-block text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-md mb-3">
                                        {info.kategori}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                        {info.judul}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {info.ringkasan}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer id="kontak" className="bg-slate-900 text-slate-300 border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
                    <div>
                        <div className="font-semibold text-white">Fakultas Hukum</div>
                        <p className="text-slate-400 text-xs mt-1">
                            Informasi akademik & layanan fakultas.
                        </p>
                    </div>
                    <div className="text-xs text-slate-400">
                        © {new Date().getFullYear()} Fakultas Hukum. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}