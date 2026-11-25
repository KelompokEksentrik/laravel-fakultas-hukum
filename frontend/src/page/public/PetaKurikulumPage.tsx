import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
    kurikulumApi,
    type KurikulumCpl,
    type KurikulumProfil,
} from "../../service/kurikulumApi";

interface ConnectorLine {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    kind: "profil-cpl" | "cpl-mk";
}

function getRelatedMkIdsForCpl(
    profil: KurikulumProfil,
    cpl: KurikulumCpl,
    cplIndex: number
): number[] {
    const mks = profil.mata_kuliahs;
    if (mks.length === 0) return [];

    const text = `${cpl.kode_cpl} ${cpl.deskripsi}`.toLowerCase();
    const scored = mks.filter((mk) => {
        const mkText = `${mk.kode_mk} ${mk.nama_mk}`.toLowerCase();
        if (text.includes("etika") || text.includes("integritas") || text.includes("yudisial")) {
            return mkText.includes("etika") || mkText.includes("anti korupsi") || mkText.includes("filsafat") || mkText.includes("pidana");
        }
        if (text.includes("acara") || text.includes("litigasi") || text.includes("advokasi") || text.includes("pembuktian")) {
            return mkText.includes("acara") || mkText.includes("plkh") || mkText.includes("pembuktian") || mkText.includes("keadvokatan");
        }
        if (text.includes("mediasi") || text.includes("negosiasi") || text.includes("non-litigasi") || text.includes("alternatif")) {
            return mkText.includes("non litigasi") || mkText.includes("perdata") || mkText.includes("hubungan industrial");
        }
        if (text.includes("perundang") || text.includes("naskah") || text.includes("regulasi") || text.includes("kontrak") || text.includes("perikatan")) {
            return mkText.includes("perundang") || mkText.includes("perikatan") || mkText.includes("logika") || mkText.includes("kelembagaan") || mkText.includes("jaminan") || mkText.includes("daerah");
        }
        if (text.includes("bisnis") || text.includes("korporasi") || text.includes("komersial") || text.includes("audit") || text.includes("risiko")) {
            return mkText.includes("dagang") || mkText.includes("perbankan") || mkText.includes("kepailitan") || mkText.includes("haki") || mkText.includes("pajak") || mkText.includes("ketenagakerjaan") || mkText.includes("asuransi");
        }
        if (text.includes("investigasi") || text.includes("berkas") || text.includes("putusan")) {
            return mkText.includes("pidana") || mkText.includes("pembuktian") || mkText.includes("kriminologi") || mkText.includes("penologi") || mkText.includes("victimologi");
        }
        if (text.includes("penelitian") || text.includes("metodologi") || text.includes("publikasi") || text.includes("policy") || text.includes("teori")) {
            return mkText.includes("metode penelitian") || mkText.includes("filsafat") || mkText.includes("sosiologi") || mkText.includes("politik") || mkText.includes("perbandingan") || mkText.includes("skripsi") || mkText.includes("pengantar ilmu hukum");
        }
        return false;
    });

    if (scored.length > 0) {
        return scored.map((m) => m.id);
    }

    // Fallback distribusi merata agar setiap CPL selalu punya alur MK yang jelas
    const totalCpl = Math.max(profil.cpls.length, 1);
    const chunkSize = Math.max(1, Math.ceil(mks.length / totalCpl));
    const start = (cplIndex * chunkSize) % mks.length;
    const slice = mks.slice(start, start + chunkSize);
    return (slice.length > 0 ? slice : [mks[0]]).map((m) => m.id);
}

export default function PetaKurikulumPage() {
    const [profils, setProfils] = useState<KurikulumProfil[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfilId, setSelectedProfilId] = useState<number | null>(null);
    const [selectedCplId, setSelectedCplId] = useState<number | null>(null);
    const [selectedMkId, setSelectedMkId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [lines, setLines] = useState<ConnectorLine[]>([]);

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const profilNodeRefs = useRef<Record<number, HTMLButtonElement | null>>({});
    const cplNodeRefs = useRef<Record<number, HTMLButtonElement | null>>({});
    const mkNodeRefs = useRef<Record<number, HTMLButtonElement | null>>({});

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                const res = await kurikulumApi.getPublik();
                if (!active) return;
                const list = Array.isArray(res.data) ? res.data : [];
                setProfils(list);
                if (list.length > 0) {
                    setSelectedProfilId(list[0].id);
                }
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const activeProfil = useMemo(() => {
        if (profils.length === 0) return null;
        if (selectedProfilId) {
            return profils.find((p) => p.id === selectedProfilId) || profils[0];
        }
        return profils[0];
    }, [profils, selectedProfilId]);

    const activeCpl = useMemo(() => {
        if (!activeProfil || !selectedCplId) return null;
        return activeProfil.cpls.find((c) => c.id === selectedCplId) || null;
    }, [activeProfil, selectedCplId]);

    const highlightedCplIds = useMemo(() => {
        if (!activeProfil) return new Set<number>();
        if (activeCpl) return new Set<number>([activeCpl.id]);
        if (selectedMkId) {
            const mk = activeProfil.mata_kuliahs.find((m) => m.id === selectedMkId);
            if (mk) {
                const matched = activeProfil.cpls.filter((cpl, idx) =>
                    getRelatedMkIdsForCpl(activeProfil, cpl, idx).includes(mk.id)
                );
                if (matched.length > 0) return new Set<number>(matched.map((c) => c.id));
            }
        }
        return new Set<number>(activeProfil.cpls.map((c) => c.id));
    }, [activeProfil, activeCpl, selectedMkId]);

    const highlightedMkIds = useMemo(() => {
        if (!activeProfil) return new Set<number>();
        if (activeCpl) {
            const idx = activeProfil.cpls.findIndex((c) => c.id === activeCpl.id);
            return new Set<number>(
                getRelatedMkIdsForCpl(activeProfil, activeCpl, Math.max(idx, 0))
            );
        }
        if (selectedMkId) return new Set<number>([selectedMkId]);
        return new Set<number>(activeProfil.mata_kuliahs.map((m) => m.id));
    }, [activeProfil, activeCpl, selectedMkId]);

    const filteredMks = useMemo(() => {
        if (!activeProfil) return [];
        const q = searchQuery.trim().toLowerCase();
        if (!q) return activeProfil.mata_kuliahs;
        return activeProfil.mata_kuliahs.filter(
            (mk) =>
                mk.kode_mk.toLowerCase().includes(q) ||
                mk.nama_mk.toLowerCase().includes(q) ||
                `semester ${mk.semester}`.includes(q)
        );
    }, [activeProfil, searchQuery]);

    const computeLines = () => {
        const container = mapContainerRef.current;
        if (!container || !activeProfil || window.innerWidth < 1024) {
            setLines([]);
            return;
        }

        const cRect = container.getBoundingClientRect();
        const pEl = profilNodeRefs.current[activeProfil.id];
        if (!pEl) {
            setLines([]);
            return;
        }

        const pRect = pEl.getBoundingClientRect();
        const xStartP = pRect.right - cRect.left;
        const yStartP = pRect.top + pRect.height / 2 - cRect.top;

        const nextLines: ConnectorLine[] = [];

        highlightedCplIds.forEach((cplId) => {
            const cEl = cplNodeRefs.current[cplId];
            if (!cEl) return;
            const cplRect = cEl.getBoundingClientRect();
            const xLeftC = cplRect.left - cRect.left;
            const yMidC = cplRect.top + cplRect.height / 2 - cRect.top;
            const xRightC = cplRect.right - cRect.left;

            nextLines.push({
                id: `p-${activeProfil.id}-c-${cplId}`,
                x1: xStartP,
                y1: yStartP,
                x2: xLeftC,
                y2: yMidC,
                kind: "profil-cpl",
            });

            const cplIdx = activeProfil.cpls.findIndex((c) => c.id === cplId);
            const cplObj = activeProfil.cpls[cplIdx];
            if (cplObj) {
                const mkIds = getRelatedMkIdsForCpl(activeProfil, cplObj, Math.max(cplIdx, 0));
                mkIds.forEach((mkId) => {
                    if (!highlightedMkIds.has(mkId)) return;
                    const mEl = mkNodeRefs.current[mkId];
                    if (!mEl) return;
                    const mRect = mEl.getBoundingClientRect();
                    const xLeftM = mRect.left - cRect.left;
                    const yMidM = mRect.top + mRect.height / 2 - cRect.top;

                    nextLines.push({
                        id: `c-${cplId}-m-${mkId}`,
                        x1: xRightC,
                        y1: yMidC,
                        x2: xLeftM,
                        y2: yMidM,
                        kind: "cpl-mk",
                    });
                });
            }
        });

        setLines(nextLines);
    };

    useLayoutEffect(() => {
        const raf = requestAnimationFrame(computeLines);
        const onResize = () => computeLines();
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
        };
    }, [activeProfil, activeCpl, selectedMkId, highlightedCplIds, highlightedMkIds, filteredMks]);

    const handleSelectProfil = (id: number) => {
        setSelectedProfilId(id);
        setSelectedCplId(null);
        setSelectedMkId(null);
    };

    const handleSelectCpl = (cplId: number) => {
        setSelectedMkId(null);
        setSelectedCplId((prev) => (prev === cplId ? null : cplId));
    };

    const handleSelectMk = (mkId: number) => {
        setSelectedCplId(null);
        setSelectedMkId((prev) => (prev === mkId ? null : mkId));
    };

    const totalSksKurikulum = 148;

    return (
        <div
            className="min-h-screen w-full px-3.5 pt-7 pb-14 text-[#222222]"
            style={{
                fontFamily: "'Geist', Arial, Helvetica, sans-serif",
                background:
                    "linear-gradient(to bottom, #800000 0%, #800000 155px, #f7efef 155px, #f7efef 100%)",
            }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');

        @keyframes flowDash {
          to {
            stroke-dashoffset: -24;
          }
        }

        @keyframes gentlePop {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .obe-flow-line {
          stroke-dasharray: 6 6;
          animation: flowDash 1.1s linear infinite;
        }

        .obe-pop {
          animation: gentlePop 0.28s ease-out both;
        }
      `}</style>

            <div className="mx-auto w-full max-w-[1220px] rounded-xl bg-white px-4 py-6 shadow-[0_2px_14px_rgba(60,0,0,0.18)] sm:px-8 sm:py-9">
                {/* HEADER */}
                <header className="mb-7 text-center">
                    <div className="mb-3 inline-block rounded-full border border-[#e8c9c9] bg-[#fbf0f0] px-4 py-1 text-sm font-semibold text-[#800000]">
                        Kurikulum Outcome-Based Education (OBE)
                    </div>
                    <h1 className="text-[clamp(25px,4vw,38px)] leading-[1.2] font-bold text-[#800000]">
                        Peta Kurikulum Program Studi S-1 Ilmu Hukum
                    </h1>
                    <p className="mx-auto mt-2.5 max-w-[740px] text-[15.5px] leading-relaxed text-[#4f4747]">
                        Klik salah satu <strong className="text-[#222222]">Profil Lulusan</strong> atau{" "}
                        <strong className="text-[#222222]">CPL</strong> untuk menelusuri alur
                        keterhubungan langsung ke{" "}
                        <strong className="text-[#222222]">Mata Kuliah Pendukung</strong>.
                    </p>
                </header>

                {/* RINGKASAN */}
                <section className="mb-7 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                    <div className="rounded-lg border border-[#e8d5d5] border-t-[3px] border-t-[#800000] bg-white px-5 py-4">
                        <div className="text-sm font-semibold text-[#5f5757]">
                            1. Profil Lulusan
                        </div>
                        <div className="mt-0.5 text-[22px] font-bold text-[#800000]">
                            {profils.length || 5}{" "}
                            <span className="text-sm font-semibold text-[#5f5757]">
                                Peran Profesional
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-[#e8d5d5] border-t-[3px] border-t-[#800000] bg-white px-5 py-4">
                        <div className="text-sm font-semibold text-[#5f5757]">
                            2. Capaian Pembelajaran
                        </div>
                        <div className="mt-0.5 text-[22px] font-bold text-[#800000]">
                            CPL{" "}
                            <span className="text-sm font-semibold text-[#5f5757]">
                                Standar Kompetensi
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-[#e8d5d5] border-t-[3px] border-t-[#800000] bg-white px-5 py-4">
                        <div className="text-sm font-semibold text-[#5f5757]">
                            3. Mata Kuliah
                        </div>
                        <div className="mt-0.5 text-[22px] font-bold text-[#800000]">
                            {totalSksKurikulum}{" "}
                            <span className="text-sm font-semibold text-[#5f5757]">
                                SKS Pendukung
                            </span>
                        </div>
                    </div>
                </section>

                {/* PETA ALUR INTERAKTIF 3 KOLOM */}
                {loading ? (
                    <div className="space-y-3">
                        <div className="h-12 animate-pulse rounded-lg bg-[#faf2f2]" />
                        <div className="h-96 animate-pulse rounded-xl border border-[#ebd7d7] bg-[#faf2f2]" />
                    </div>
                ) : !activeProfil ? (
                    <div className="rounded-xl border border-[#e8d5d5] bg-[#fff8f8] p-8 text-center text-sm text-[#5f5757]">
                        Data peta kurikulum belum tersedia.
                    </div>
                ) : (
                    <>
                        <section    
                            ref={mapContainerRef}
                            className="relative rounded-xl border border-[#e8d5d5] bg-white p-4 sm:p-6"
                        >
                            {/* SVG Connector Overlay (Desktop) */}
                            <svg
                                className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full lg:block"
                                aria-hidden="true"
                            >
                                {lines.map((line) => {
                                    const midX = (line.x1 + line.x2) / 2;
                                    const d = `M ${line.x1} ${line.y1} C ${midX} ${line.y1}, ${midX} ${line.y2}, ${line.x2} ${line.y2}`;
                                    const isPrimary = line.kind === "profil-cpl";
                                    return (
                                        <g key={line.id}>
                                            <path
                                                d={d}
                                                fill="none"
                                                stroke={isPrimary ? "#800000" : "#b84a4a"}
                                                strokeOpacity={isPrimary ? 0.35 : 0.28}
                                                strokeWidth={isPrimary ? 2.5 : 2}
                                            />
                                            <path
                                                d={d}
                                                fill="none"
                                                stroke={isPrimary ? "#800000" : "#9e2a2a"}
                                                strokeWidth={isPrimary ? 2.5 : 2}
                                                className="obe-flow-line"
                                            />
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* Toolbar Status & Reset */}
                            <div className="relative z-20 mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f0d9d9] bg-[#fff8f8] px-4 py-3">
                                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                                    <span className="rounded-full bg-[#800000] px-2.5 py-0.5 font-semibold text-white">
                                        Alur Aktif
                                    </span>
                                    <span className="font-bold text-[#800000]">
                                        {activeProfil.judul}
                                    </span>
                                    {activeCpl && (
                                        <>
                                            <span className="text-[#800000]">→</span>
                                            <span className="rounded bg-[#fbf0f0] px-2 py-0.5 font-bold text-[#800000] ring-1 ring-[#e2bebe]">
                                                {activeCpl.kode_cpl}
                                            </span>
                                        </>
                                    )}
                                    <span className="text-[#5f5757]">
                                        • {highlightedCplIds.size} CPL &amp; {highlightedMkIds.size}{" "}
                                        MK tersorot
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {(selectedCplId !== null || selectedMkId !== null) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedCplId(null);
                                                setSelectedMkId(null);
                                            }}
                                            className="rounded-lg border border-[#e0bebe] bg-white px-3 py-1 text-xs font-semibold text-[#800000] transition hover:bg-[#fbf0f0]"
                                        >
                                            Tampilkan Semua Alur Profil
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* 3 Kolom Alur */}
                            <div className="relative z-20 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
                                {/* KOLOM 1: PROFIL LULUSAN */}
                                <div className="space-y-2.5 lg:col-span-4">
                                    <div className="flex items-center gap-2 border-b border-[#e8d5d5] pb-2">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#800000] text-xs font-bold text-white">
                                            1
                                        </span>
                                        <h2 className="text-sm font-bold text-[#800000] sm:text-base">
                                            Profil Lulusan
                                        </h2>
                                    </div>

                                    <div className="space-y-2">
                                        {profils.map((profil, idx) => {
                                            const isSelected = profil.id === activeProfil.id;
                                            return (
                                                <button
                                                    key={profil.id}
                                                    ref={(el) => {
                                                        profilNodeRefs.current[profil.id] = el;
                                                    }}
                                                    type="button"
                                                    onClick={() => handleSelectProfil(profil.id)}
                                                    className={`w-full rounded-xl border p-3.5 text-left transition-all duration-200 ${isSelected
                                                            ? "border-[#800000] bg-[#800000] text-white shadow-md"
                                                            : "border-[#e8d5d5] bg-[#fff8f8] text-[#222222] hover:border-[#800000]/60 hover:bg-[#fff1f1]"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span
                                                            className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? "text-white/85" : "text-[#800000]"
                                                                }`}
                                                        >
                                                            Profil #{idx + 1}
                                                        </span>
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${isSelected
                                                                    ? "bg-white text-[#800000]"
                                                                    : "bg-[#f2e4e4] text-[#800000]"
                                                                }`}
                                                        >
                                                            {profil.mata_kuliahs.length} MK
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 text-sm leading-snug font-bold">
                                                        {profil.judul}
                                                    </div>
                                                    <div
                                                        className={`mt-1 text-xs ${isSelected ? "text-white/85" : "text-[#5f5757]"
                                                            }`}
                                                    >
                                                        {profil.subjudul || "Peran Profesional OBE"}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* KOLOM 2: CAPAIAN PEMBELAJARAN LULUSAN (CPL) */}
                                <div className="space-y-2.5 lg:col-span-4">
                                    <div className="flex items-center justify-between gap-2 border-b border-[#e8d5d5] pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#800000] text-xs font-bold text-white">
                                                2
                                            </span>
                                            <h2 className="text-sm font-bold text-[#800000] sm:text-base">
                                                Capaian Pembelajaran (CPL)
                                            </h2>
                                        </div>
                                        <span className="text-[11px] font-medium text-[#6f6262]">
                                            Klik untuk fokus alur
                                        </span>
                                    </div>

                                    <div className="space-y-2.5">
                                        {activeProfil.cpls.map((cpl) => {
                                            const isHighlighted = highlightedCplIds.has(cpl.id);
                                            const isClicked = selectedCplId === cpl.id;

                                            return (
                                                <button
                                                    key={cpl.id}
                                                    ref={(el) => {
                                                        cplNodeRefs.current[cpl.id] = el;
                                                    }}
                                                    type="button"
                                                    onClick={() => handleSelectCpl(cpl.id)}
                                                    className={`obe-pop w-full rounded-xl border p-3.5 text-left transition-all duration-200 ${isClicked
                                                            ? "border-[#800000] bg-[#800000] text-white shadow-md ring-2 ring-[#800000]/30"
                                                            : isHighlighted
                                                                ? "border-[#d8b4b4] bg-[#fff9f9] text-[#222222] hover:border-[#800000]"
                                                                : "border-[#eee2e2] bg-white/70 text-[#8a7d7d] opacity-55 hover:opacity-90"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span
                                                            className={`text-sm font-bold ${isClicked ? "text-white" : "text-[#800000]"
                                                                }`}
                                                        >
                                                            {cpl.kode_cpl}
                                                        </span>
                                                        <span
                                                            className={`text-xs font-semibold ${isClicked ? "text-white/90" : "text-[#800000]"
                                                                }`}
                                                        >
                                                            {isClicked ? "Aktif • Alur MK →" : "Telusuri →"}
                                                        </span>
                                                    </div>
                                                    <p
                                                        className={`mt-1.5 text-xs leading-relaxed sm:text-[13px] ${isClicked ? "text-white/95" : "text-[#4f4747]"
                                                            }`}
                                                    >
                                                        {cpl.deskripsi}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* KOLOM 3: MATA KULIAH PENDUKUNG */}
                                <div className="space-y-2.5 lg:col-span-4">
                                    <div className="flex items-center justify-between gap-2 border-b border-[#e8d5d5] pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#800000] text-xs font-bold text-white">
                                                3
                                            </span>
                                            <h2 className="text-sm font-bold text-[#800000] sm:text-base">
                                                Mata Kuliah Pendukung
                                            </h2>
                                        </div>
                                        <span className="text-xs font-semibold text-[#800000]">
                                            {filteredMks.length} MK
                                        </span>
                                    </div>

                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Filter kode / nama MK / semester..."
                                        className="w-full rounded-lg border border-[#e2c6c6] bg-[#fffafa] px-3 py-1.5 text-xs text-[#222222] placeholder-[#8c7e7e] focus:border-[#800000] focus:bg-white focus:outline-none"
                                    />

                                    <div className="max-h-[560px] space-y-1.5 overflow-y-auto pr-0.5">
                                        {filteredMks.map((mk) => {
                                            const isHighlighted = highlightedMkIds.has(mk.id);
                                            const isClicked = selectedMkId === mk.id;

                                            return (
                                                <button
                                                    key={mk.id}
                                                    ref={(el) => {
                                                        mkNodeRefs.current[mk.id] = el;
                                                    }}
                                                    type="button"
                                                    onClick={() => handleSelectMk(mk.id)}
                                                    className={`obe-pop flex w-full items-center justify-between gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-all duration-200 ${isClicked
                                                            ? "border-[#800000] bg-[#fff0f0] shadow-sm ring-1 ring-[#800000]"
                                                            : isHighlighted
                                                                ? "border-[#ebd6d6] bg-white hover:border-[#800000]/60 hover:bg-[#fff8f8]"
                                                                : "border-[#f0e5e5] bg-[#fcfafa] opacity-45 hover:opacity-85"
                                                        }`}
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold tracking-wide text-[#800000]">
                                                                {mk.kode_mk}
                                                            </span>
                                                            <span className="text-[11px] text-[#6f6262]">
                                                                • Sem {mk.semester}
                                                            </span>
                                                        </div>
                                                        <div className="mt-0.5 truncate text-xs font-semibold text-[#222222] sm:text-[13px]">
                                                            {mk.nama_mk}
                                                        </div>
                                                    </div>

                                                    <span className="shrink-0 rounded-full bg-[#f2e4e4] px-2.5 py-0.5 text-[11px] font-bold text-[#800000]">
                                                        {mk.sks} SKS
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* RINGKASAN DESKRIPSI & KETERHUBUNGAN PROFIL AKTIF */}
                        <section className="mt-6 space-y-4">
                            <div className="rounded-r-lg border border-[#f2dede] border-l-4 border-l-[#800000] bg-[#fff8f8] px-4 py-3.5">
                                <div className="mb-1 text-sm font-bold text-[#800000]">
                                    1. Deskripsi Peran Profesional — {activeProfil.judul}
                                </div>
                                <p className="text-sm leading-relaxed text-[#3a3030]">
                                    {activeProfil.deskripsi}
                                </p>
                            </div>

                            <div className="rounded-lg bg-[#800000] px-5 py-4 text-white">
                                <div className="mb-1 text-sm font-bold">
                                    Ringkasan Keterhubungan (Poin 1, 2, dan 3)
                                </div>
                                <p className="text-sm leading-relaxed text-white/95">
                                    {activeProfil.ringkasan_keterhubungan}
                                </p>
                            </div>
                        </section>
                    </>
                )}

                {/* CATATAN OBE */}
                <footer className="mt-7 rounded-r-xl border border-[#f2dede] border-l-4 border-l-[#800000] bg-[#fff8f8] px-5 py-4">
                    <div className="mb-1 text-sm font-semibold text-[#800000]">
                        Penjelasan Konsep Peta Kurikulum OBE
                    </div>
                    <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#4f4747]">
                        <li>
                            <strong>Pendekatan Outcome-Based Education (OBE)</strong> menyusun
                            kurikulum secara terbalik (<em>backward design</em>): dari Profil
                            Lulusan, diturunkan ke CPL, lalu didukung oleh Mata Kuliah yang
                            relevan.
                        </li>
                        <li>
                            Setiap mata kuliah memiliki keterikatan langsung (
                            <em>constructive alignment</em>) terhadap pemenuhan CPL dan
                            pembentukan profil lulusan mahasiswa Fakultas Hukum UNPAM[cite: 2].
                        </li>
                    </ul>
                </footer>
            </div>
        </div>
    );
}