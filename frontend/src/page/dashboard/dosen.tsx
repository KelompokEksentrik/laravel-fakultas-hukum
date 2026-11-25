import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Upload,
    X,
    Loader2,
    ExternalLink,
    FileSpreadsheet,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import TataLetakDashboard from '../../layout/dashboard';

interface Dosen {
    id: number;
    nama: string;
    nidn_nuptk: string | null;
    kepakaran: string | null;
    foto_url: string | null;
    link_scholar: string | null;
    link_sinta: string | null;
    link_pddikti: string | null;
    link_scopus: string | null;
    urutan: number;
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
const OPSI_PER_HALAMAN = [10, 25, 50, 100];

function ambilToken(): string {
    return localStorage.getItem('token_fh') || '';
}

export default function ManajemenDosen() {
    const [daftarDosen, setDaftarDosen] = useState<Dosen[]>([]);
    const [meta, setMeta] = useState<MetaPaginasi>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
    });

    const [halaman, setHalaman] = useState<number>(1);
    const [perHalaman, setPerHalaman] = useState<number>(10);
    const [kataKunci, setKataKunci] = useState<string>('');
    const [memuat, setMemuat] = useState<boolean>(true);
    const [pesanSukses, setPesanSukses] = useState<string>('');
    const [pesanError, setPesanError] = useState<string>('');

    // State Modal Tambah / Edit
    const [modalTerbuka, setModalTerbuka] = useState<boolean>(false);
    const [idEdit, setIdEdit] = useState<number | null>(null);
    const [menyimpan, setMenyimpan] = useState<boolean>(false);

    const [nama, setNama] = useState('');
    const [nidnNuptk, setNidnNuptk] = useState('');
    const [kepakaran, setKepakaran] = useState('');
    const [fotoUrl, setFotoUrl] = useState('');
    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [linkScholar, setLinkScholar] = useState('');
    const [linkSinta, setLinkSinta] = useState('');
    const [linkPddikti, setLinkPddikti] = useState('');
    const [linkScopus, setLinkScopus] = useState('');
    const [urutan, setUrutan] = useState<number>(0);

    // State Import CSV
    const [mengimpor, setMengimpor] = useState<boolean>(false);

    const muatDataDosen = async (
        targetPage = halaman,
        targetPerPage = perHalaman,
        search = kataKunci
    ) => {
        setMemuat(true);
        setPesanError('');

        try {
            const url = new URL(`${API_BASE}/dosen`);
            url.searchParams.set('page', String(targetPage));
            url.searchParams.set('per_page', String(targetPerPage));
            if (search.trim()) {
                url.searchParams.set('search', search.trim());
            }

            const res = await fetch(url.toString(), {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${ambilToken()}`,
                },
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.pesan || 'Gagal memuat data dosen.');

            const semuaItem: Dosen[] = Array.isArray(json.data) ? json.data : [];

            if (json.meta) {
                setDaftarDosen(semuaItem);
                setMeta(json.meta);
            } else {
                // Fallback jika backend mengembalikan seluruh array sekaligus
                const total = semuaItem.length;
                const lastPage = Math.max(1, Math.ceil(total / targetPerPage));
                const validPage = Math.min(Math.max(1, targetPage), lastPage);
                const startIdx = (validPage - 1) * targetPerPage;
                const sliced = semuaItem.slice(startIdx, startIdx + targetPerPage);

                setDaftarDosen(sliced);
                setMeta({
                    current_page: validPage,
                    last_page: lastPage,
                    per_page: targetPerPage,
                    total,
                    from: total === 0 ? 0 : startIdx + 1,
                    to: Math.min(startIdx + targetPerPage, total),
                });
            }
        } catch (err: any) {
            setPesanError(err.message || 'Terjadi kesalahan saat memuat data.');
        } finally {
            setMemuat(false);
        }
    };

    useEffect(() => {
        void muatDataDosen(halaman, perHalaman, kataKunci);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [halaman, perHalaman]);

    const handleCariSubmit = (e: FormEvent) => {
        e.preventDefault();
        setHalaman(1);
        void muatDataDosen(1, perHalaman, kataKunci);
    };

    const handleUbahPerHalaman = (nilaiBaru: number) => {
        setPerHalaman(nilaiBaru);
        setHalaman(1);
    };

    const bukaModalTambah = () => {
        setIdEdit(null);
        setNama('');
        setNidnNuptk('');
        setKepakaran('');
        setFotoUrl('');
        setFotoFile(null);
        setLinkScholar('');
        setLinkSinta('');
        setLinkPddikti('');
        setLinkScopus('');
        setUrutan(meta.total + 1);
        setModalTerbuka(true);
    };

    const bukaModalEdit = (dosen: Dosen) => {
        setIdEdit(dosen.id);
        setNama(dosen.nama);
        setNidnNuptk(dosen.nidn_nuptk || '');
        setKepakaran(dosen.kepakaran || '');
        setFotoUrl(dosen.foto_url || '');
        setFotoFile(null);
        setLinkScholar(dosen.link_scholar || '');
        setLinkSinta(dosen.link_sinta || '');
        setLinkPddikti(dosen.link_pddikti || '');
        setLinkScopus(dosen.link_scopus || '');
        setUrutan(dosen.urutan || 0);
        setModalTerbuka(true);
    };

    const simpanDosen = async (e: FormEvent) => {
        e.preventDefault();
        setMenyimpan(true);
        setPesanError('');
        setPesanSukses('');

        try {
            const formData = new FormData();
            formData.append('nama', nama);
            formData.append('nidn_nuptk', nidnNuptk);
            formData.append('kepakaran', kepakaran);
            formData.append('foto_url', fotoUrl);
            formData.append('link_scholar', linkScholar);
            formData.append('link_sinta', linkSinta);
            formData.append('link_pddikti', linkPddikti);
            formData.append('link_scopus', linkScopus);
            formData.append('urutan', String(urutan));

            if (fotoFile) {
                formData.append('foto_file', fotoFile);
            }

            const endpoint = idEdit ? `${API_BASE}/dosen/${idEdit}` : `${API_BASE}/dosen`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${ambilToken()}`,
                },
                body: formData,
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.pesan || 'Gagal menyimpan data dosen.');

            setPesanSukses(json.pesan || 'Data dosen tersimpan.');
            setModalTerbuka(false);
            void muatDataDosen(halaman, perHalaman, kataKunci);
        } catch (err: any) {
            setPesanError(err.message || 'Gagal menyimpan data.');
        } finally {
            setMenyimpan(false);
        }
    };

    const hapusDosen = async (dosen: Dosen) => {
        if (!window.confirm(`Hapus data dosen "${dosen.nama}"?`)) return;
        setPesanError('');
        setPesanSukses('');

        try {
            const res = await fetch(`${API_BASE}/dosen/${dosen.id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${ambilToken()}`,
                },
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.pesan || 'Gagal menghapus data.');

            setPesanSukses(json.pesan || 'Data dosen dihapus.');
            const halamanBerikutnya =
                daftarDosen.length === 1 && halaman > 1 ? halaman - 1 : halaman;
            setHalaman(halamanBerikutnya);
            void muatDataDosen(halamanBerikutnya, perHalaman, kataKunci);
        } catch (err: any) {
            setPesanError(err.message || 'Gagal menghapus data.');
        }
    };

    const handleImportCsv = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setMengimpor(true);
        setPesanError('');
        setPesanSukses('');

        try {
            const formData = new FormData();
            formData.append('file_csv', file);

            const res = await fetch(`${API_BASE}/dosen-import`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${ambilToken()}`,
                },
                body: formData,
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.pesan || 'Gagal mengimpor file CSV.');

            setPesanSukses(json.pesan);
            setHalaman(1);
            void muatDataDosen(1, perHalaman, kataKunci);
        } catch (err: any) {
            setPesanError(err.message || 'Terjadi kesalahan saat impor CSV.');
        } finally {
            setMengimpor(false);
            e.target.value = '';
        }
    };

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
        <TataLetakDashboard
            judulHalaman="Manajemen Dosen"
            subJudul={`Kelola direktori dosen Fakultas Hukum (${meta.total} data)`}
        >
            {/* Notifikasi */}
            {pesanSukses && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
                    <span>{pesanSukses}</span>
                    <button onClick={() => setPesanSukses('')} className="text-emerald-600 hover:text-emerald-900">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
            {pesanError && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between">
                    <span>{pesanError}</span>
                    <button onClick={() => setPesanError('')} className="text-red-600 hover:text-red-900">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Toolbar Atas */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <form onSubmit={handleCariSubmit} className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={kataKunci}
                        onChange={(e) => {
                            const nilai = e.target.value;
                            setKataKunci(nilai);
                            if (nilai === '') {
                                setHalaman(1);
                                void muatDataDosen(1, perHalaman, '');
                            }
                        }}
                        placeholder="Cari nama dosen, NIDN, atau kepakaran..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-red-800"
                    />
                </form>

                <div className="flex flex-wrap items-center gap-2.5">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition">
                        {mengimpor ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                        )}
                        <span>{mengimpor ? 'Mengimpor...' : 'Import CSV'}</span>
                        <input
                            type="file"
                            accept=".csv,.txt"
                            onChange={handleImportCsv}
                            disabled={mengimpor}
                            className="hidden"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={bukaModalTambah}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#800000] text-white text-sm font-semibold hover:bg-[#9b1c1c] transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Dosen</span>
                    </button>
                </div>
            </div>

            {/* Tabel Data Dosen */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {memuat ? (
                    <div className="p-12 flex items-center justify-center gap-2 text-slate-500 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memuat data dosen...</span>
                    </div>
                ) : daftarDosen.length === 0 ? (
                    <div className="p-12 text-center text-sm text-slate-500">
                        Belum ada data dosen yang cocok. Klik <strong>Import CSV</strong> untuk mengunggah data dari spreadsheet atau <strong>Tambah Dosen</strong>.
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase">
                                        <th className="py-3 px-4 w-12">No</th>
                                        <th className="py-3 px-4">Foto</th>
                                        <th className="py-3 px-4">Nama & Gelar</th>
                                        <th className="py-3 px-4">NIDN / NUPTK</th>
                                        <th className="py-3 px-4">Kepakaran</th>
                                        <th className="py-3 px-4">Tautan Akademik</th>
                                        <th className="py-3 px-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {daftarDosen.map((dosen, index) => (
                                        <tr key={dosen.id} className="hover:bg-slate-50/70">
                                            <td className="py-3 px-4 text-slate-500 font-medium">
                                                {meta.from + index}
                                            </td>
                                            <td className="py-3 px-4">
                                                <img
                                                    src={
                                                        dosen.foto_url ||
                                                        'https://cms.unpam.ac.id/storage/assets/pages/content/daSLOuCMvpk0UXKhRIypvoEpXEMaemtfLLKJUmhm.png'
                                                    }
                                                    alt={dosen.nama}
                                                    className="w-11 h-12 object-cover rounded-lg border border-slate-200 bg-slate-100"
                                                />
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-slate-900">
                                                {dosen.nama}
                                            </td>
                                            <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                                                {dosen.nidn_nuptk || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-slate-600 max-w-xs">
                                                {dosen.kepakaran || '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-wrap gap-1.5 text-xs">
                                                    {dosen.link_scholar && (
                                                        <a
                                                            href={dosen.link_scholar}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                        >
                                                            Scholar <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                    {dosen.link_sinta && (
                                                        <a
                                                            href={dosen.link_sinta}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                        >
                                                            Sinta <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                    {dosen.link_pddikti && (
                                                        <a
                                                            href={dosen.link_pddikti}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                        >
                                                            PDDikti <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                    {dosen.link_scopus && (
                                                        <a
                                                            href={dosen.link_scopus}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                                                        >
                                                            Scopus <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => bukaModalEdit(dosen)}
                                                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 mr-1"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => hapusDosen(dosen)}
                                                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Tabel: Pilihan Jumlah Tampil + Info + Pagination */}
                        <div className="px-4 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                            <div className="flex flex-wrap items-center gap-3 text-slate-600">
                                <label className="inline-flex items-center gap-2">
                                    <span>Tampilkan</span>
                                    <select
                                        value={perHalaman}
                                        onChange={(e) => handleUbahPerHalaman(Number(e.target.value))}
                                        className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:outline-none focus:border-[#800000]"
                                    >
                                        {OPSI_PER_HALAMAN.map((opsi) => (
                                            <option key={opsi} value={opsi}>
                                                {opsi}
                                            </option>
                                        ))}
                                    </select>
                                    <span>data</span>
                                </label>

                                <span className="text-xs sm:text-sm text-slate-500">
                                    Menampilkan <strong>{meta.from}</strong> - <strong>{meta.to}</strong> dari{' '}
                                    <strong>{meta.total}</strong> dosen
                                </span>
                            </div>

                            {/* Tombol Pagination */}
                            {meta.last_page > 1 && (
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setHalaman((p) => Math.max(1, p - 1))}
                                        disabled={meta.current_page <= 1}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-100 disabled:opacity-45 disabled:pointer-events-none"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                        <span>Prev</span>
                                    </button>

                                    {daftarHalaman().map((item, idx) =>
                                        item === '...' ? (
                                            <span key={`el-${idx}`} className="px-2 text-slate-400 text-xs">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => setHalaman(item)}
                                                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition ${item === meta.current_page
                                                        ? 'bg-[#800000] text-white border border-[#800000]'
                                                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        )
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setHalaman((p) => Math.min(meta.last_page, p + 1))}
                                        disabled={meta.current_page >= meta.last_page}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-100 disabled:opacity-45 disabled:pointer-events-none"
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Modal Form Tambah / Edit */}
            {modalTerbuka && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                            <h3 className="font-bold text-slate-900 text-lg">
                                {idEdit ? 'Edit Data Dosen' : 'Tambah Dosen Baru'}
                            </h3>
                            <button
                                onClick={() => setModalTerbuka(false)}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={simpanDosen} className="space-y-3.5 text-sm">
                            <div>
                                <label className="block font-medium text-slate-700 mb-1">
                                    Nama Lengkap dan Gelar *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    placeholder="Contoh: Heriyanto Saputra, S.S., S.H., M.H."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-medium text-slate-700 mb-1">
                                        NIDN / NIDK / NUPTK
                                    </label>
                                    <input
                                        type="text"
                                        value={nidnNuptk}
                                        onChange={(e) => setNidnNuptk(e.target.value)}
                                        placeholder="422029102"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-700 mb-1">
                                        Urutan Tampil
                                    </label>
                                    <input
                                        type="number"
                                        value={urutan}
                                        onChange={(e) => setUrutan(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-slate-700 mb-1">
                                    Kepakaran / Mata Kuliah Kekhususan
                                </label>
                                <input
                                    type="text"
                                    value={kepakaran}
                                    onChange={(e) => setKepakaran(e.target.value)}
                                    placeholder="Contoh: Hukum Pidana"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-slate-700 mb-1">
                                    Upload Foto (ke Supabase) atau URL Foto
                                </label>
                                <div className="flex flex-col gap-2">
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50">
                                        <Upload className="w-4 h-4" />
                                        <span>{fotoFile ? fotoFile.name : 'Pilih file gambar PNG/JPG (maks 3MB)'}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                    </label>
                                    <input
                                        type="text"
                                        value={fotoUrl}
                                        onChange={(e) => setFotoUrl(e.target.value)}
                                        placeholder="Atau tempel URL foto / link Google Drive"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-slate-700 mb-1">Link Google Scholar</label>
                                <input
                                    type="url"
                                    value={linkScholar}
                                    onChange={(e) => setLinkScholar(e.target.value)}
                                    placeholder="https://scholar.google.com/..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-medium text-slate-700 mb-1">Link Sinta</label>
                                    <input
                                        type="url"
                                        value={linkSinta}
                                        onChange={(e) => setLinkSinta(e.target.value)}
                                        placeholder="https://sinta.kemdiktisaintek.go.id/..."
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-slate-700 mb-1">Link PDDikti</label>
                                    <input
                                        type="url"
                                        value={linkPddikti}
                                        onChange={(e) => setLinkPddikti(e.target.value)}
                                        placeholder="https://pddikti.kemdiktisaintek.go.id/..."
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-slate-700 mb-1">
                                    Link Profil Scopus (Jika Ada)
                                </label>
                                <input
                                    type="url"
                                    value={linkScopus}
                                    onChange={(e) => setLinkScopus(e.target.value)}
                                    placeholder="https://www.scopus.com/authid/detail.uri?authorId=..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>

                            <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setModalTerbuka(false)}
                                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={menyimpan}
                                    className="px-4 py-2 rounded-lg bg-[#800000] text-white font-semibold hover:bg-[#9b1c1c] disabled:opacity-60 inline-flex items-center gap-2"
                                >
                                    {menyimpan && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <span>{menyimpan ? 'Menyimpan...' : 'Simpan Data'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </TataLetakDashboard>
    );
}