import { useEffect, useState, type FormEvent } from "react";
import TataLetakDashboard from "../../layout/dashboard";
import {
    kurikulumApi,
    type KurikulumCpl,
    type KurikulumMataKuliah,
    type KurikulumProfil,
} from "../../service/kurikulumApi";

export default function KurikulumAdmin() {
    const [profils, setProfils] = useState<KurikulumProfil[]>([]);
    const [selectedProfilId, setSelectedProfilId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [offlineMode, setOfflineMode] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // State Form Profil Lulusan
    const [editingProfilId, setEditingProfilId] = useState<number | null>(null);
    const [judulProfil, setJudulProfil] = useState("");
    const [subjudulProfil, setSubjudulProfil] = useState("");
    const [deskripsiProfil, setDeskripsiProfil] = useState("");
    const [ringkasanProfil, setRingkasanProfil] = useState("");

    // State Form CPL
    const [editingCplId, setEditingCplId] = useState<number | null>(null);
    const [kodeCpl, setKodeCpl] = useState("");
    const [deskripsiCpl, setDeskripsiCpl] = useState("");

    // State Form Mata Kuliah
    const [editingMkId, setEditingMkId] = useState<number | null>(null);
    const [kodeMk, setKodeMk] = useState("");
    const [namaMk, setNamaMk] = useState("");
    const [sksMk, setSksMk] = useState<number>(2);
    const [semesterMk, setSemesterMk] = useState<number>(1);

    const loadData = async (preferredId?: number | null) => {
        try {
            setLoading(true);
            const list = await kurikulumApi.getAdminList();
            setOfflineMode(false);
            setProfils(list);

            if (list.length > 0) {
                const nextId =
                    preferredId && list.some((p) => p.id === preferredId)
                        ? preferredId
                        : selectedProfilId && list.some((p) => p.id === selectedProfilId)
                            ? selectedProfilId
                            : list[0].id;
                setSelectedProfilId(nextId);
            } else {
                setSelectedProfilId(null);
            }
        } catch {
            // Fallback ke endpoint publik bila endpoint admin belum ter-deploy/404
            try {
                const pub = await kurikulumApi.getPublik();
                const fallbackList = Array.isArray(pub.data) ? pub.data : [];
                setProfils(fallbackList);
                if (fallbackList.length > 0) {
                    setSelectedProfilId((prev) =>
                        prev && fallbackList.some((p) => p.id === prev)
                            ? prev
                            : fallbackList[0].id
                    );
                }
                setOfflineMode(true);
            } catch {
                setOfflineMode(true);
                setFeedback({
                    type: "error",
                    text: "Endpoint API /api/v1/kurikulum belum merespons (404/CORS). Pastikan backend sudah di-deploy.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const activeProfil =
        profils.find((p) => p.id === selectedProfilId) || profils[0] || null;

    const resetProfilForm = () => {
        setEditingProfilId(null);
        setJudulProfil("");
        setSubjudulProfil("");
        setDeskripsiProfil("");
        setRingkasanProfil("");
    };

    const startEditProfil = (p: KurikulumProfil) => {
        setEditingProfilId(p.id);
        setJudulProfil(p.judul);
        setSubjudulProfil(p.subjudul || "");
        setDeskripsiProfil(p.deskripsi);
        setRingkasanProfil(p.ringkasan_keterhubungan);
    };

    const handleSaveProfil = async (e: FormEvent) => {
        e.preventDefault();
        if (
            !judulProfil.trim() ||
            !deskripsiProfil.trim() ||
            !ringkasanProfil.trim()
        ) {
            setFeedback({
                type: "error",
                text: "Judul, deskripsi, dan ringkasan keterhubungan wajib diisi.",
            });
            return;
        }

        try {
            setSaving(true);
            setFeedback(null);
            const payload = {
                judul: judulProfil.trim(),
                subjudul: subjudulProfil.trim() || undefined,
                deskripsi: deskripsiProfil.trim(),
                ringkasan_keterhubungan: ringkasanProfil.trim(),
            };

            if (editingProfilId) {
                await kurikulumApi.updateProfil(editingProfilId, payload);
                await loadData(editingProfilId);
                setFeedback({ type: "success", text: "Profil lulusan diperbarui." });
            } else {
                const created = await kurikulumApi.createProfil(payload);
                await loadData(created.id);
                setFeedback({ type: "success", text: "Profil lulusan ditambahkan." });
            }
            resetProfilForm();
        } catch (err) {
            setFeedback({
                type: "error",
                text: err instanceof Error ? err.message : "Gagal menyimpan profil.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProfil = async (id: number) => {
        if (!window.confirm("Hapus profil lulusan ini beserta CPL & MK terkait?")) {
            return;
        }
        try {
            setSaving(true);
            await kurikulumApi.deleteProfil(id);
            if (editingProfilId === id) resetProfilForm();
            await loadData(null);
            setFeedback({ type: "success", text: "Profil lulusan dihapus." });
        } catch (err) {
            setFeedback({
                type: "error",
                text: err instanceof Error ? err.message : "Gagal menghapus profil.",
            });
        } finally {
            setSaving(false);
        }
    };

    const resetCplForm = () => {
        setEditingCplId(null);
        setKodeCpl("");
        setDeskripsiCpl("");
    };

    const startEditCpl = (cpl: KurikulumCpl) => {
        setEditingCplId(cpl.id);
        setKodeCpl(cpl.kode_cpl);
        setDeskripsiCpl(cpl.deskripsi);
    };

    const handleSaveCpl = async (e: FormEvent) => {
        e.preventDefault();
        if (!activeProfil || !kodeCpl.trim() || !deskripsiCpl.trim()) return;

        try {
            setSaving(true);
            setFeedback(null);
            const payload = {
                kode_cpl: kodeCpl.trim(),
                deskripsi: deskripsiCpl.trim(),
            };

            if (editingCplId) {
                await kurikulumApi.updateCpl(activeProfil.id, editingCplId, payload);
                setFeedback({ type: "success", text: "CPL diperbarui." });
            } else {
                await kurikulumApi.createCpl(activeProfil.id, payload);
                setFeedback({ type: "success", text: "CPL ditambahkan." });
            }
            resetCplForm();
            await loadData(activeProfil.id);
        } catch (err) {
            setFeedback({
                type: "error",
                text: err instanceof Error ? err.message : "Gagal menyimpan CPL.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCpl = async (cplId: number) => {
        if (!activeProfil) return;
        try {
            setSaving(true);
            await kurikulumApi.deleteCpl(activeProfil.id, cplId);
            if (editingCplId === cplId) resetCplForm();
            await loadData(activeProfil.id);
            setFeedback({ type: "success", text: "CPL dihapus." });
        } catch (err) {
            setFeedback({
                type: "error",
                text: err instanceof Error ? err.message : "Gagal menghapus CPL.",
            });
        } finally {
            setSaving(false);
        }
    };

    const resetMkForm = () => {
        setEditingMkId(null);
        setKodeMk("");
        setNamaMk("");
        setSksMk(2);
        setSemesterMk(1);
    };

    const startEditMk = (mk: KurikulumMataKuliah) => {
        setEditingMkId(mk.id);
        setKodeMk(mk.kode_mk);
        setNamaMk(mk.nama_mk);
        setSksMk(mk.sks);
        setSemesterMk(mk.semester);
    };

    const handleSaveMk = async (e: FormEvent) => {
        e.preventDefault();
        if (!activeProfil || !kodeMk.trim() || !namaMk.trim()) return;

        try {
            setSaving(true);
            setFeedback(null);
            const payload = {
                kode_mk: kodeMk.trim().toUpperCase(),
                nama_mk: namaMk.trim(),
                sks: Number(sksMk),
                semester: Number(semesterMk),
            };

            if (editingMkId) {
                await kurikulumApi.updateMataKuliah(activeProfil.id, editingMkId, payload);
                setFeedback({ type: "success", text: "Mata kuliah diperbarui." });
            } else {
                await kurikulumApi.createMataKuliah(activeProfil.id, payload);
                setFeedback({ type: "success", text: "Mata kuliah ditambahkan." });
            }
            resetMkForm();
            await loadData(activeProfil.id);
        } catch (err) {
            setFeedback({
                type: "error",
                text: err instanceof Error ? err.message : "Gagal menyimpan mata kuliah.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteMk = async (mkId: number) => {
        if (!activeProfil) return;
        try {
            setSaving(true);
            await kurikulumApi.deleteMataKuliah(activeProfil.id, mkId);
            if (editingMkId === mkId) resetMkForm();
            await loadData(activeProfil.id);
            setFeedback({ type: "success", text: "Mata kuliah dihapus." });
        } catch (err) {
            setFeedback({
                type: "error",
                text: err instanceof Error ? err.message : "Gagal menghapus mata kuliah.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleSeedDefault = async () => {
        try {
            setSaving(true);
            setFeedback(null);
            const seeded = await kurikulumApi.seedDefault();
            setOfflineMode(false);
            setProfils(seeded);
            if (seeded.length > 0) setSelectedProfilId(seeded[0].id);
            setFeedback({
                type: "success",
                text: "Data awal Peta Kurikulum OBE (5 Profil) berhasil dimuat.",
            });
        } catch (err) {
            setFeedback({
                type: "error",
                text: err instanceof Error ? err.message : "Gagal memuat data awal OBE.",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <TataLetakDashboard
            judulHalaman="Manajemen Peta Kurikulum OBE"
            subJudul="Kelola Profil Lulusan, Capaian Pembelajaran Lulusan (CPL), dan Mata Kuliah Pendukung"
        >
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            Struktur Peta Kurikulum S-1 Ilmu Hukum
                        </h2>
                        <p className="text-xs text-slate-500">
                            Perubahan di halaman ini langsung memengaruhi tampilan publik{" "}
                            <span className="font-semibold text-[#800000]">
                                /peta-kurikulum
                            </span>
                            .
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={handleSeedDefault}
                        className="rounded-lg bg-[#800000] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#660000] disabled:opacity-50"
                    >
                        Muat Data Default OBE (5 Profil)
                    </button>
                </div>

                {offlineMode && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                        Akses ke endpoint admin <code>/api/v1/kurikulum-peta</code> ditolak
                        (401 Unauthorized) atau tidak dapat dijangkau. Periksa token{" "}
                        <code>token_fh</code> dan konfigurasi autentikasi di server Laravel.
                    </div>
                )}

                {feedback && (
                    <div
                        className={`rounded-lg border px-4 py-3 text-sm font-medium ${feedback.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-red-200 bg-red-50 text-red-800"
                            }`}
                    >
                        {feedback.text}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                        Memuat data peta kurikulum...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                        {/* KOLOM KIRI: PROFIL LULUSAN */}
                        <div className="space-y-5 xl:col-span-5">
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="mb-3 text-sm font-bold text-slate-800">
                                    1. Daftar Profil Lulusan ({profils.length})
                                </h3>

                                {profils.length === 0 ? (
                                    <p className="text-xs text-slate-500">
                                        Belum ada profil lulusan. Klik tombol{" "}
                                        <strong>Muat Data Default OBE</strong> di atas atau tambah
                                        profil baru di bawah.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {profils.map((p, idx) => {
                                            const isSelected = activeProfil?.id === p.id;
                                            return (
                                                <div
                                                    key={p.id}
                                                    className={`flex items-center justify-between gap-2 rounded-lg border p-3 transition ${isSelected
                                                        ? "border-[#800000] bg-[#fff5f5]"
                                                        : "border-slate-200 bg-slate-50/70 hover:bg-slate-100/70"
                                                        }`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedProfilId(p.id);
                                                            resetCplForm();
                                                            resetMkForm();
                                                        }}
                                                        className="flex-1 text-left"
                                                    >
                                                        <div className="text-sm font-bold text-slate-900">
                                                            {idx + 1}. {p.judul}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {p.cpls.length} CPL • {p.mata_kuliahs.length} Mata
                                                            Kuliah
                                                        </div>
                                                    </button>

                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEditProfil(p)}
                                                            className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteProfil(p.id)}
                                                            className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <form
                                onSubmit={handleSaveProfil}
                                className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-800">
                                        {editingProfilId
                                            ? "Edit Profil Lulusan"
                                            : "Tambah Profil Lulusan Baru"}
                                    </h3>
                                    {editingProfilId && (
                                        <button
                                            type="button"
                                            onClick={resetProfilForm}
                                            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                                        >
                                            Batal Edit
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Judul Profil Lulusan
                                    </label>
                                    <input
                                        type="text"
                                        value={judulProfil}
                                        onChange={(e) => setJudulProfil(e.target.value)}
                                        placeholder="Contoh: Pengacara / Advokat & Praktisi Hukum"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Subjudul / Tagline
                                    </label>
                                    <input
                                        type="text"
                                        value={subjudulProfil}
                                        onChange={(e) => setSubjudulProfil(e.target.value)}
                                        placeholder="Contoh: Profil Lulusan #1 • Litigasi & Non-Litigasi"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Deskripsi Peran Profesional
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={deskripsiProfil}
                                        onChange={(e) => setDeskripsiProfil(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Ringkasan Keterhubungan (1 → 2 → 3)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={ringkasanProfil}
                                        onChange={(e) => setRingkasanProfil(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full rounded-lg bg-[#800000] px-4 py-2 text-sm font-semibold text-white hover:bg-[#660000] disabled:opacity-50"
                                >
                                    {editingProfilId
                                        ? "Simpan Perubahan Profil"
                                        : "Tambah Profil Lulusan"}
                                </button>
                            </form>
                        </div>

                        {/* KOLOM KANAN: CPL & MATA KULIAH */}
                        <div className="space-y-6 xl:col-span-7">
                            {!activeProfil ? (
                                <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                                    Pilih atau tambahkan Profil Lulusan terlebih dahulu untuk
                                    mengelola CPL dan Mata Kuliah Pendukung.
                                </div>
                            ) : (
                                <>
                                    {/* CPL */}
                                    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <h3 className="text-sm font-bold text-slate-800">
                                            2. Capaian Pembelajaran (CPL) — {activeProfil.judul}
                                        </h3>

                                        <form
                                            onSubmit={handleSaveCpl}
                                            className="grid grid-cols-1 gap-2.5 rounded-lg bg-slate-50 p-3.5 sm:grid-cols-12"
                                        >
                                            <input
                                                type="text"
                                                value={kodeCpl}
                                                onChange={(e) => setKodeCpl(e.target.value)}
                                                placeholder="Kode CPL (CPL-A Integritas)"
                                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm sm:col-span-4"
                                            />
                                            <input
                                                type="text"
                                                value={deskripsiCpl}
                                                onChange={(e) => setDeskripsiCpl(e.target.value)}
                                                placeholder="Deskripsi kompetensi CPL..."
                                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm sm:col-span-6"
                                            />
                                            <div className="flex gap-1.5 sm:col-span-2">
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="flex-1 rounded-lg bg-[#800000] px-3 py-2 text-xs font-semibold text-white hover:bg-[#660000]"
                                                >
                                                    {editingCplId ? "Simpan" : "Tambah"}
                                                </button>
                                                {editingCplId && (
                                                    <button
                                                        type="button"
                                                        onClick={resetCplForm}
                                                        className="rounded-lg border border-slate-300 bg-white px-2 text-xs text-slate-600"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        </form>

                                        <div className="space-y-2">
                                            {activeProfil.cpls.map((cpl) => (
                                                <div
                                                    key={cpl.id}
                                                    className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3"
                                                >
                                                    <div>
                                                        <div className="text-sm font-bold text-[#800000]">
                                                            {cpl.kode_cpl}
                                                        </div>
                                                        <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                                                            {cpl.deskripsi}
                                                        </p>
                                                    </div>
                                                    <div className="flex shrink-0 gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEditCpl(cpl)}
                                                            className="rounded border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteCpl(cpl.id)}
                                                            className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* MATA KULIAH */}
                                    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <h3 className="text-sm font-bold text-slate-800">
                                            3. Mata Kuliah Pendukung — {activeProfil.judul}
                                        </h3>

                                        <form
                                            onSubmit={handleSaveMk}
                                            className="grid grid-cols-1 gap-2.5 rounded-lg bg-slate-50 p-3.5 sm:grid-cols-12"
                                        >
                                            <input
                                                type="text"
                                                value={kodeMk}
                                                onChange={(e) => setKodeMk(e.target.value)}
                                                placeholder="Kode MK"
                                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm sm:col-span-3"
                                            />
                                            <input
                                                type="text"
                                                value={namaMk}
                                                onChange={(e) => setNamaMk(e.target.value)}
                                                placeholder="Nama Mata Kuliah"
                                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm sm:col-span-5"
                                            />
                                            <input
                                                type="number"
                                                min={1}
                                                max={12}
                                                value={sksMk}
                                                onChange={(e) => setSksMk(Number(e.target.value))}
                                                placeholder="SKS"
                                                className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm sm:col-span-1"
                                            />
                                            <input
                                                type="number"
                                                min={1}
                                                max={14}
                                                value={semesterMk}
                                                onChange={(e) => setSemesterMk(Number(e.target.value))}
                                                placeholder="Sem"
                                                className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm sm:col-span-1"
                                            />
                                            <div className="flex gap-1 sm:col-span-2">
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="flex-1 rounded-lg bg-[#800000] px-2.5 py-2 text-xs font-semibold text-white hover:bg-[#660000]"
                                                >
                                                    {editingMkId ? "Simpan" : "Tambah"}
                                                </button>
                                                {editingMkId && (
                                                    <button
                                                        type="button"
                                                        onClick={resetMkForm}
                                                        className="rounded-lg border border-slate-300 bg-white px-2 text-xs text-slate-600"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        </form>

                                        <div className="overflow-x-auto rounded-lg border border-slate-200">
                                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                                                <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                                                    <tr>
                                                        <th className="px-3 py-2.5">#</th>
                                                        <th className="px-3 py-2.5">Kode MK</th>
                                                        <th className="px-3 py-2.5">Nama Mata Kuliah</th>
                                                        <th className="px-3 py-2.5">SKS</th>
                                                        <th className="px-3 py-2.5">Semester</th>
                                                        <th className="px-3 py-2.5 text-right">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {activeProfil.mata_kuliahs.map((mk, idx) => (
                                                        <tr key={mk.id} className="hover:bg-slate-50/70">
                                                            <td className="px-3 py-2 text-slate-500">
                                                                {idx + 1}
                                                            </td>
                                                            <td className="px-3 py-2 font-bold text-[#800000]">
                                                                {mk.kode_mk}
                                                            </td>
                                                            <td className="px-3 py-2 font-medium text-slate-900">
                                                                {mk.nama_mk}
                                                            </td>
                                                            <td className="px-3 py-2 text-slate-700">
                                                                {mk.sks} SKS
                                                            </td>
                                                            <td className="px-3 py-2 text-slate-700">
                                                                Sem {mk.semester}
                                                            </td>
                                                            <td className="px-3 py-2 text-right">
                                                                <div className="inline-flex gap-1.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => startEditMk(mk)}
                                                                        className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteMk(mk.id)}
                                                                        className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                                                                    >
                                                                        Hapus
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </TataLetakDashboard>
    );
}