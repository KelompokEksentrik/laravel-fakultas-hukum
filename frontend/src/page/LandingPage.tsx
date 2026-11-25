import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      {/* Headbar / Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900">
            <img src="/unpam-logo.png" alt="Logo Fakultas Hukum" className="h-8 w-8 object-contain" />
            <span>Fakultas Hukum</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#beranda" className="hover:text-slate-900">Beranda</a>
            <a href="#informasi" className="hover:text-slate-900">Informasi</a>
            <a href="#statistik" className="hover:text-slate-900">Statistik</a>
            <a href="#tentang" className="hover:text-slate-900">Tentang</a>
          </nav>

          <Link
            to="/masuk"
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section id="beranda" className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 mb-4">
              Portal Informasi Akademik
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Pusat Informasi & Layanan Fakultas Hukum
            </h1>
            <p className="text-slate-600 leading-relaxed mb-8">
              Akses informasi akademik, pengumuman kegiatan, profil program studi, dan layanan terpadu Fakultas Hukum secara jelas dan terstruktur.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#informasi"
                className="px-5 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
              >
                Lihat Informasi
              </a>
              <Link
                to="/masuk"
                className="px-5 py-3 rounded-lg border border-slate-300 text-slate-800 text-sm font-medium hover:bg-slate-50 transition"
              >
                Masuk ke Sistem
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Pengumuman & Informasi Terkini</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="p-3 rounded-xl bg-white border border-slate-100">
                Informasi kalender akademik dan jadwal perkuliahan semester berjalan.
              </li>
              <li className="p-3 rounded-xl bg-white border border-slate-100">
                Panduan administrasi, bimbingan tugas akhir, dan layanan kemahasiswaan.
              </li>
              <li className="p-3 rounded-xl bg-white border border-slate-100">
                Agenda seminar hukum, kajian ilmiah, dan publikasi civitas akademika.
              </li>
            </ul>
          </div>
        </section>

        {/* Statistik Ringkas */}
        <section id="statistik" className="bg-slate-50 border-y border-slate-200 py-12">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="text-3xl font-bold text-slate-900">100+</div>
              <div className="text-sm text-slate-500 mt-1">Dosen & Tenaga Pendidik</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="text-3xl font-bold text-slate-900">1.500+</div>
              <div className="text-sm text-slate-500 mt-1">Mahasiswa Aktif</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="text-3xl font-bold text-slate-900">24/7</div>
              <div className="text-sm text-slate-500 mt-1">Akses Informasi Publik</div>
            </div>
          </div>
        </section>

        {/* Bagian Informasi / Layanan */}
        <section id="informasi" className="max-w-6xl mx-auto px-4 py-16">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Informasi Utama</h2>
            <p className="text-slate-600">
              Ringkasan informasi yang dapat dibaca langsung oleh pengunjung tanpa perlu login.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Profil & Kurikulum</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Informasi visi misi fakultas, struktur organisasi, serta garis besar kurikulum dan konsentrasi kajian hukum.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Layanan Akademik</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Alur layanan administrasi mahasiswa, surat menyurat akademik, serta ketentuan seminar dan sidang.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Berita & Kegiatan</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kabar kegiatan fakultas, pengabdian kepada masyarakat, diskusi hukum, dan pengumuman resmi.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="tentang" className="bg-slate-900 text-slate-300 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
          <div>
            <div className="font-semibold text-white">Fakultas Hukum</div>
            <p className="text-slate-400 mt-1">Portal informasi resmi fakultas.</p>
          </div>
          <div className="text-slate-400">
            © {new Date().getFullYear()} Fakultas Hukum. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}