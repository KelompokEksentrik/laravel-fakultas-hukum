import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import './DosenPublik.css';

interface DosenPublikItem {
    id: number;
    nama: string;
    nidn_nuptk: string | null;
    kepakaran: string | null;
    foto_url: string | null;
    link_scholar: string | null;
    link_sinta: string | null;
    link_pddikti: string | null;
}

interface MetaPaginasi {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
const DEFAULT_PHOTO =
    'https://cms.unpam.ac.id/storage/assets/pages/content/daSLOuCMvpk0UXKhRIypvoEpXEMaemtfLLKJUmhm.png';

export default function DosenPublik() {
    const [daftarDosen, setDaftarDosen] = useState<DosenPublikItem[]>([]);
    const [meta, setMeta] = useState<MetaPaginasi>({
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
        from: 0,
        to: 0,
    });
    const [halaman, setHalaman] = useState(1);
    const [pencarian, setPencarian] = useState('');
    const [memuat, setMemuat] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setMemuat(true);
            try {
                const url = new URL(`${API_BASE}/publik/dosen`);
                url.searchParams.set('page', String(halaman));
                url.searchParams.set('per_page', '12');
                if (pencarian.trim()) {
                    url.searchParams.set('search', pencarian.trim());
                }

                const res = await fetch(url.toString(), {
                    headers: { Accept: 'application/json' },
                    signal: controller.signal,
                });
                const json = await res.json();
                if (res.ok) {
                    setDaftarDosen(json.data || []);
                    if (json.meta) setMeta(json.meta);
                }
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error('Gagal memuat daftar dosen:', err);
                }
            } finally {
                setMemuat(false);
            }
        }, 250);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [halaman, pencarian]);

    const daftarHalaman = (): (number | '...')[] => {
        const { current_page, last_page } = meta;
        if (last_page <= 7) {
            return Array.from({ length: last_page }, (_, i) => i + 1);
        }
        if (current_page <= 4) {
            return [1, 2, 3, 4, 5, '...', last_page];
        }
        if (current_page >= last_page - 3) {
            return [1, '...', last_page - 4, last_page - 3, last_page - 2, last_page - 1, last_page];
        }
        return [1, '...', current_page - 1, current_page, current_page + 1, '...', last_page];
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Headbar Publik */}
            {/* <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900">
                        <img src="/unpam-logo.png" alt="Logo Fakultas Hukum" className="h-8 w-8 object-contain" />
                        <span>Fakultas Hukum</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                        <Link to="/" className="hover:text-slate-900">Beranda</Link>
                        <Link to="/dosen" className="text-[#800000] font-semibold">Dosen</Link>
                        <Link to="/kurikulum" className="hover:text-slate-900">Kurikulum</Link>
                        <Link to="/akademik" className="hover:text-slate-900">Akademik</Link>
                    </nav>

                    <Link
                        to="/masuk"
                        className="px-4 py-2 rounded-lg bg-[#800000] text-white text-sm font-semibold hover:bg-[#9b1c1c] transition"
                    >
                        Login
                    </Link>
                </div>
            </header> */}

            {/* Konten Utama (Sesuai Slicing dosen.html) */}
            <div className="dosen-page-container">
                {/* Search Bar */}
                <div className="search-wrapper">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setHalaman(1);
                        }}
                        className="search-box"
                    >
                        <span className="search-icon">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            value={pencarian}
                            onChange={(e) => {
                                setPencarian(e.target.value);
                                setHalaman(1);
                            }}
                            className="search-input"
                            placeholder="Cari Nama Dosen atau NIDN"
                            aria-label="Cari Nama Dosen"
                        />
                    </form>
                </div>

                {/* Grid Kartu Dosen */}
                <div className="dosen-grid">
                    {memuat ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 20px', color: '#800000' }}>
                            Memuat data dosen...
                        </div>
                    ) : daftarDosen.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 20px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#800000', marginBottom: '6px' }}>
                                Dosen Tidak Ditemukan
                            </div>
                            <div style={{ fontSize: '14px', color: '#71717a' }}>
                                Coba gunakan kata kunci nama, NIDN, atau bidang kepakaran yang lain.
                            </div>
                        </div>
                    ) : (
                        daftarDosen.map((dosen) => (
                            <div key={dosen.id} className="dosen-card">
                                <div className="dosen-photo-container">
                                    <div className="dosen-arch-backdrop" />
                                    <img
                                        src={dosen.foto_url || DEFAULT_PHOTO}
                                        alt={dosen.nama}
                                        className="dosen-photo"
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = DEFAULT_PHOTO;
                                        }}
                                    />
                                </div>

                                <div className="dosen-info">
                                    <div className="dosen-name">{dosen.nama}</div>
                                    <div className="dosen-nidn-title">NIDN / NUPTK</div>
                                    <div className="dosen-nidn-number">{dosen.nidn_nuptk || '-'}</div>
                                </div>

                                <div className="dosen-tabs">
                                    <a
                                        href={dosen.link_scholar || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="dosen-tab-btn"
                                        style={!dosen.link_scholar ? { opacity: 0.45, pointerEvents: 'none' } : undefined}
                                    >
                                        Google Scholar
                                    </a>
                                    <a
                                        href={dosen.link_sinta || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="dosen-tab-btn"
                                        style={!dosen.link_sinta ? { opacity: 0.45, pointerEvents: 'none' } : undefined}
                                    >
                                        Sinta
                                    </a>
                                    <a
                                        href={dosen.link_pddikti || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="dosen-tab-btn"
                                        style={!dosen.link_pddikti ? { opacity: 0.45, pointerEvents: 'none' } : undefined}
                                    >
                                        PDDikti
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {!memuat && meta.total > 0 && (
                    <div className="pagination-container">
                        <ul className="pagination-nav">
                            <li className={`page-item ${meta.current_page <= 1 ? 'disabled' : ''}`}>
                                <button
                                    type="button"
                                    onClick={() => setHalaman((p) => Math.max(1, p - 1))}
                                    disabled={meta.current_page <= 1}
                                    className="page-link nav-btn"
                                >
                                    &laquo; Prev
                                </button>
                            </li>

                            {daftarHalaman().map((item, idx) =>
                                item === '...' ? (
                                    <li key={`el-${idx}`} className="page-item">
                                        <span className="page-ellipsis">...</span>
                                    </li>
                                ) : (
                                    <li key={item} className={`page-item ${item === meta.current_page ? 'active' : ''}`}>
                                        <button
                                            type="button"
                                            onClick={() => setHalaman(item)}
                                            className="page-link"
                                        >
                                            {item}
                                        </button>
                                    </li>
                                )
                            )}

                            <li className={`page-item ${meta.current_page >= meta.last_page ? 'disabled' : ''}`}>
                                <button
                                    type="button"
                                    onClick={() => setHalaman((p) => Math.min(meta.last_page, p + 1))}
                                    disabled={meta.current_page >= meta.last_page}
                                    className="page-link nav-btn"
                                >
                                    Next &raquo;
                                </button>
                            </li>
                        </ul>

                        <div className="pagination-info">
                            Menampilkan <strong>{meta.from} - {meta.to}</strong> dari <strong>{meta.total}</strong> Dosen
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}