import { useEffect, useMemo, useRef, useState } from "react";
import {
    kurikulumApi,
    type KurikulumProfil,
    type KurikulumPublikResponse,
} from "../../service/kurikulumApi";

const FALLBACK_PROFILS: KurikulumProfil[] = [
    {
        id: 1,
        urutan: 1,
        judul: "Pengacara / Advokat & Praktisi Hukum",
        subjudul: "Profil Lulusan #1 • Litigasi & Non-Litigasi",
        deskripsi:
            "Profesi yang memberikan jasa hukum, advokasi perkara pidana, perdata, tata usaha negara, maupun peradilan agama, serta pendampingan negosiasi dan mediasi penyelesaian sengketa di luar pengadilan.",
        ringkasan_keterhubungan:
            "Sebagai Pengacara / Advokat & Praktisi Hukum, lulusan dibekali pemahaman mendalam tentang prosedur peradilan dan etika advokasi (Poin 1), yang diwujudkan melalui penguasaan Capaian Pembelajaran berupa kemampuan menyusun surat hukum, teknik pembuktian, dan strategi pembelaan (Poin 2). Seluruh kompetensi ini secara terstruktur disokong oleh paket Mata Kuliah Hukum Acara, Keadvokatan, serta Praktik Litigasi dan Non-Litigasi (Poin 3).",
        cpls: [
            {
                id: 101,
                kurikulum_profil_id: 1,
                urutan: 1,
                kode_cpl: "CPL-A (Integritas Etika)",
                deskripsi:
                    "Menjunjung tinggi kode etik advokat, integritas moralitas penegakan hukum, keadilan substantif, dan perlindungan hak asasi manusia.",
            },
            {
                id: 102,
                kurikulum_profil_id: 1,
                urutan: 2,
                kode_cpl: "CPL-B (Keahlian Hukum Acara)",
                deskripsi:
                    "Menguasai hukum materiil (Perdata, Pidana, TUN) dan seluruh tahapan hukum formil pada lingkungan peradilan di Indonesia.",
            },
            {
                id: 103,
                kurikulum_profil_id: 1,
                urutan: 3,
                kode_cpl: "CPL-C (Keterampilan Advokasi & Litigasi)",
                deskripsi:
                    "Mampu menyusun dokumen hukum persidangan (surat kuasa, gugatan, replik, pledoi, memori banding/kasasi) dan beracara di pengadilan.",
            },
            {
                id: 104,
                kurikulum_profil_id: 1,
                urutan: 4,
                kode_cpl: "CPL-D (Penyelesaian Alternatif / Non-Litigasi)",
                deskripsi:
                    "Mampu melakukan teknik mediasi, negosiasi, dan konsiliasi untuk menyelesaikan perselisihan secara damai dan solutif.",
            },
        ],
        mata_kuliahs: [
            { id: 1001, kurikulum_profil_id: 1, urutan: 1, kode_mk: "22HUK0373", nama_mk: "Keadvokatan", sks: 3, semester: 6 },
            { id: 1002, kurikulum_profil_id: 1, urutan: 2, kode_mk: "22HUK0314", nama_mk: "Hukum Acara Perdata", sks: 4, semester: 4 },
            { id: 1003, kurikulum_profil_id: 1, urutan: 3, kode_mk: "22HUK0324", nama_mk: "Hukum Acara Pidana", sks: 4, semester: 4 },
            { id: 1004, kurikulum_profil_id: 1, urutan: 4, kode_mk: "22HUK0102", nama_mk: "Hukum Acara Peradilan TUN", sks: 2, semester: 5 },
            { id: 1005, kurikulum_profil_id: 1, urutan: 5, kode_mk: "22HUK0152", nama_mk: "Hukum Acara Peradilan Agama", sks: 2, semester: 6 },
            { id: 1006, kurikulum_profil_id: 1, urutan: 6, kode_mk: "22HUK0112", nama_mk: "Hukum Pembuktian", sks: 2, semester: 5 },
            { id: 1007, kurikulum_profil_id: 1, urutan: 7, kode_mk: "22HUK0192", nama_mk: "PLKH Perdata (Peradilan Semu)", sks: 2, semester: 7 },
            { id: 1008, kurikulum_profil_id: 1, urutan: 8, kode_mk: "22HUK0202", nama_mk: "PLKH Pidana (Peradilan Semu)", sks: 2, semester: 7 },
            { id: 1009, kurikulum_profil_id: 1, urutan: 9, kode_mk: "22HUK0222", nama_mk: "PLKH Non Litigasi", sks: 2, semester: 7 },
            { id: 1010, kurikulum_profil_id: 1, urutan: 10, kode_mk: "22FHK0102", nama_mk: "Etika Profesi Hukum", sks: 2, semester: 7 },
        ],
    },
];

export default function PetaKurikulumPage() {
    const [profils, setProfils] = useState<KurikulumProfil[]>(FALLBACK_PROFILS);
    const [ringkasan, setRingkasan] = useState<KurikulumPublikResponse["ringkasan"]>({
        jumlah_profil: 5,
        label_capaian: "CPL",
        total_sks_kurikulum: 148,
        total_cpl_item: 16,
        total_mk_terpetakan: 46,
    });
    const [loading, setLoading] = useState(true);
    const [openIds, setOpenIds] = useState<number[]>([1]);
    const [activePillId, setActivePillId] = useState<number | null>(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
    const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                const res = await kurikulumApi.getPublik();
                if (!active) return;
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setProfils(res.data);
                    setOpenIds([res.data[0].id]);
                    setActivePillId(res.data[0].id);
                }
                if (res.ringkasan) {
                    setRingkasan(res.ringkasan);
                }
            } catch {
                // Tetap tampilkan fallback agar halaman publik tetap aman saat offline/cold-start
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const toggleProfil = (id: number, forceOpen = false) => {
        setActivePillId(id);
        setOpenIds((prev) => {
            if (prev.includes(id)) {
                return forceOpen ? prev : prev.filter((item) => item !== id);
            }
            return [...prev, id];
        });
    };

    const handleSelectPill = (id: number) => {
        toggleProfil(id, true);
        requestAnimationFrame(() => {
            cardRefs.current[id]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    };

    const handleExpandAll = () => {
        setOpenIds(filteredProfils.map((p) => p.id));
    };

    const handleCollapseAll = () => {
        setOpenIds([]);
    };

    const filteredProfils = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return profils
            .map((profil) => {
                const matchProfil =
                    !q ||
                    profil.judul.toLowerCase().includes(q) ||
                    (profil.subjudul || "").toLowerCase().includes(q) ||
                    profil.deskripsi.toLowerCase().includes(q);

                const matchedCpls = q
                    ? profil.cpls.filter(
                        (cpl) =>
                            cpl.kode_cpl.toLowerCase().includes(q) ||
                            cpl.deskripsi.toLowerCase().includes(q)
                    )
                    : profil.cpls;

                const matchedMks = profil.mata_kuliahs.filter((mk) => {
                    const matchSem =
                        selectedSemester === "all" || mk.semester === selectedSemester;
                    const matchText =
                        !q ||
                        mk.kode_mk.toLowerCase().includes(q) ||
                        mk.nama_mk.toLowerCase().includes(q);
                    return matchSem && matchText;
                });

                const hasFilterActive = Boolean(q) || selectedSemester !== "all";
                if (
                    hasFilterActive &&
                    !matchProfil &&
                    matchedCpls.length === 0 &&
                    matchedMks.length === 0
                ) {
                    return null;
                }

                return {
                    ...profil,
                    cpls: matchedCpls,
                    mata_kuliahs: matchedMks,
                };
            })
            .filter(Boolean) as KurikulumProfil[];
    }, [profils, searchQuery, selectedSemester]);

    return (
        <div
            className="min-h-screen w-full px-3.5 pt-7 pb-14 text-[#222222]"
            style={{
                fontFamily: "'Geist', Arial, Helvetica, sans-serif",
                background:
                    "linear-gradient(to bottom, #800000 0%, #800000 175px, #f7efef 175px, #f7efef 100%)",
            }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.04); }
        }

        @keyframes staggerFadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(128, 0, 0, 0.35); }
          70% { box-shadow: 0 0 0 8px rgba(128, 0, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(128, 0, 0, 0); }
        }

        .obe-float-orb {
          animation: floatSlow 6s ease-in-out infinite;
        }

        .obe-stagger-item {
          animation: staggerFadeUp 0.36s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .obe-pill-active {
          animation: pulseRing 2.2s infinite;
        }

        .obe-accordion-grid {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.38s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .obe-accordion-grid[data-open="true"] {
          grid-template-rows: 1fr;
        }

        .obe-accordion-inner {
          overflow: hidden;
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.28s ease, transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .obe-accordion-grid[data-open="true"] .obe-accordion-inner {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

            <div className="mx-auto w-full max-w-[1160px] rounded-xl bg-white px-4 py-6 shadow-[0_6px_28px_rgba(60,0,0,0.16)] sm:px-9 sm:py-10">
                {/* HEADER */}
                <header className="relative mb-8 overflow-hidden rounded-2xl border border-[#f0d8d8] bg-gradient-to-br from-[#fff8f8] via-white to-[#fdf2f2] px-5 py-7 text-center sm:px-8">
                    <div className="obe-float-orb pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-[#800000]/[0.06]" />
                    <div
                        className="obe-float-orb pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-[#800000]/[0.05]"
                        style={{ animationDelay: "2.2s" }}
                    />

                    <div className="relative inline-flex items-center gap-2 rounded-full border border-[#e8c9c9] bg-[#fbf0f0] px-4 py-1.5 text-sm font-semibold text-[#800000]">
                        <span className="h-2 w-2 rounded-full bg-[#800000]" />
                        Kurikulum Outcome-Based Education (OBE)
                    </div>

                    <h1 className="relative mt-3.5 text-[clamp(25px,4.2vw,38px)] leading-[1.2] font-bold text-[#800000]">
                        Peta Kurikulum Program Studi S-1 Ilmu Hukum
                    </h1>

                    <p className="relative mx-auto mt-3 max-w-[740px] text-[15.5px] leading-relaxed text-[#4f4747]">
                        Eksplorasi keterhubungan konstruktif interaktif antara{" "}
                        <strong className="text-[#222222]">Profil Lulusan</strong>,{" "}
                        <strong className="text-[#222222]">
                            Capaian Pembelajaran Lulusan (CPL)
                        </strong>
                        , dan{" "}
                        <strong className="text-[#222222]">Mata Kuliah Pendukung</strong>{" "}
                        untuk mengarahkan kompetensi akademik mahasiswa secara terukur.
                    </p>
                </header>

                {/* RINGKASAN */}
                <section className="mb-8 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                    <div className="rounded-lg border border-[#e8d5d5] border-t-[3px] border-t-[#800000] bg-white px-5 py-4 transition-transform duration-200 hover:-translate-y-0.5">
                        <div className="text-sm font-semibold text-[#5f5757]">
                            1. Profil Lulusan
                        </div>
                        <div className="mt-1 text-[22px] leading-tight font-bold text-[#800000]">
                            {ringkasan.jumlah_profil}{" "}
                            <span className="text-sm font-semibold text-[#5f5757]">
                                Peran Profesional
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-[#e8d5d5] border-t-[3px] border-t-[#800000] bg-white px-5 py-4 transition-transform duration-200 hover:-translate-y-0.5">
                        <div className="text-sm font-semibold text-[#5f5757]">
                            2. Capaian Pembelajaran
                        </div>
                        <div className="mt-1 text-[22px] leading-tight font-bold text-[#800000]">
                            {ringkasan.label_capaian}{" "}
                            <span className="text-sm font-semibold text-[#5f5757]">
                                Standar Kompetensi ({ringkasan.total_cpl_item} Butir)
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-[#e8d5d5] border-t-[3px] border-t-[#800000] bg-white px-5 py-4 transition-transform duration-200 hover:-translate-y-0.5">
                        <div className="text-sm font-semibold text-[#5f5757]">
                            3. Mata Kuliah
                        </div>
                        <div className="mt-1 text-[22px] leading-tight font-bold text-[#800000]">
                            {ringkasan.total_sks_kurikulum}{" "}
                            <span className="text-sm font-semibold text-[#5f5757]">
                                SKS Kurikulum ({ringkasan.total_mk_terpetakan} Pemetaan MK)
                            </span>
                        </div>
                    </div>
                </section>

                {/* DIAGRAM 3 PILAR */}
                <section className="mb-8 rounded-xl border border-[#e8d5d5] bg-white p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h2 className="text-lg font-bold text-[#800000]">
                                Diagram Alur Keterhubungan Peta Kurikulum
                            </h2>
                            <p className="mt-0.5 text-sm text-[#5f5757]">
                                Tiga pilar kurikulum yang saling menopang secara terintegrasi:
                            </p>
                        </div>
                        <div className="hidden items-center gap-1.5 rounded-full bg-[#fff5f5] px-3 py-1 text-xs font-semibold text-[#800000] md:flex">
                            <span>Profil</span>
                            <span>→</span>
                            <span>CPL</span>
                            <span>→</span>
                            <span>Mata Kuliah</span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-3">
                        <div className="rounded-xl border border-[#f0cfcf] bg-[#fff7f7] p-4 transition-all duration-200 hover:border-[#800000]/40 hover:shadow-sm">
                            <div className="mb-3 flex items-center gap-2.5 border-b border-[#e8d5d5] pb-2.5">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#800000] text-sm font-bold text-white">
                                    1
                                </span>
                                <div>
                                    <div className="text-base font-bold text-[#800000]">
                                        Profil Lulusan
                                    </div>
                                    <div className="text-xs text-[#5f5757]">
                                        Peran profesional lulusan di dunia kerja
                                    </div>
                                </div>
                            </div>
                            <ul className="list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-[#3a3030]">
                                <li>
                                    <strong>Pengacara / Advokat &amp; Praktisi Hukum</strong>
                                </li>
                                <li>
                                    <strong>
                                        Perancang Peraturan &amp; Kontrak (Legal Drafter)
                                    </strong>
                                </li>
                                <li>
                                    <strong>Konsultan Hukum Bisnis / In-House Counsel</strong>
                                </li>
                                <li>
                                    <strong>
                                        Aparatur Penegak Hukum Publik (Hakim, Jaksa, Penyidik)
                                    </strong>
                                </li>
                                <li>
                                    <strong>
                                        Akademisi / Peneliti &amp; Analis Kebijakan Hukum
                                    </strong>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-xl border border-[#f0cfcf] bg-[#fff7f7] p-4 transition-all duration-200 hover:border-[#800000]/40 hover:shadow-sm">
                            <div className="mb-3 flex items-center gap-2.5 border-b border-[#e8d5d5] pb-2.5">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#800000] text-sm font-bold text-white">
                                    2
                                </span>
                                <div>
                                    <div className="text-base font-bold text-[#800000]">
                                        Capaian Pembelajaran (CPL)
                                    </div>
                                    <div className="text-xs text-[#5f5757]">
                                        Standar kompetensi dan kapabilitas lulusan
                                    </div>
                                </div>
                            </div>
                            <ul className="list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-[#3a3030]">
                                <li>
                                    <strong>Sikap &amp; Etika</strong>: Integritas moral dan nilai
                                    humanis
                                </li>
                                <li>
                                    <strong>Pengetahuan Yuridis</strong>: Teori hukum materiil dan
                                    formil
                                </li>
                                <li>
                                    <strong>Keterampilan Khusus</strong>: Praktik peradilan dan
                                    litigasi
                                </li>
                                <li>
                                    <strong>Legal Drafting</strong>: Penyusunan kontrak dan
                                    regulasi
                                </li>
                                <li>
                                    <strong>Analisis Kritis</strong>: Legal reasoning dan
                                    penyelesaian sengketa
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-xl border border-[#f0cfcf] bg-[#fff7f7] p-4 transition-all duration-200 hover:border-[#800000]/40 hover:shadow-sm">
                            <div className="mb-3 flex items-center gap-2.5 border-b border-[#e8d5d5] pb-2.5">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#800000] text-sm font-bold text-white">
                                    3
                                </span>
                                <div>
                                    <div className="text-base font-bold text-[#800000]">
                                        Mata Kuliah Pendukung
                                    </div>
                                    <div className="text-xs text-[#5f5757]">
                                        Kurikulum penunjang penguasaan CPL
                                    </div>
                                </div>
                            </div>
                            <ul className="list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-[#3a3030]">
                                <li>
                                    <strong>Mata Kuliah Dasar</strong>: PIH, PHI, Logika Hukum
                                </li>
                                <li>
                                    <strong>Mata Kuliah Substansi</strong>: Pidana, Perdata, HTN,
                                    HAN
                                </li>
                                <li>
                                    <strong>Mata Kuliah Prosedural</strong>: Hukum Acara dan
                                    Pembuktian
                                </li>
                                <li>
                                    <strong>Praktikum &amp; Klinis</strong>: PLKH Litigasi dan
                                    Non-Litigasi
                                </li>
                                <li>
                                    <strong>Tugas Akhir</strong>: Skripsi 6 SKS
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* FILTER & QUICK-JUMP DOCK */}
                <section className="mb-6 rounded-xl border border-[#e8d5d5] bg-[#fcf8f8] p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari profil lulusan, CPL, kode MK, atau nama mata kuliah..."
                                className="w-full rounded-lg border border-[#dfc3c3] bg-white px-3.5 py-2 text-sm text-[#222222] placeholder-[#8c7e7e] focus:border-[#800000] focus:outline-none"
                            />
                            <select
                                value={selectedSemester}
                                onChange={(e) =>
                                    setSelectedSemester(
                                        e.target.value === "all" ? "all" : Number(e.target.value)
                                    )
                                }
                                className="rounded-lg border border-[#dfc3c3] bg-white px-3 py-2 text-sm font-medium text-[#3a3030] focus:border-[#800000] focus:outline-none"
                            >
                                <option value="all">Semua Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                    <option key={sem} value={sem}>
                                        Semester {sem}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleExpandAll}
                                className="rounded-lg border border-[#e3c6c6] bg-white px-3 py-1.5 text-xs font-semibold text-[#800000] transition hover:bg-[#fbf0f0]"
                            >
                                Buka Semua
                            </button>
                            <button
                                type="button"
                                onClick={handleCollapseAll}
                                className="rounded-lg border border-[#e3c6c6] bg-white px-3 py-1.5 text-xs font-semibold text-[#5f5757] transition hover:bg-[#f3eaea]"
                            >
                                Tutup Semua
                            </button>
                        </div>
                    </div>

                    {/* Kapsul lompat cepat ke profil */}
                    <div className="mt-3.5 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-[#6f6262]">
                            Loncat ke Profil:
                        </span>
                        {profils.map((item, idx) => {
                            const isSelected = activePillId === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelectPill(item.id)}
                                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${isSelected
                                            ? "obe-pill-active bg-[#800000] text-white shadow-sm"
                                            : "border border-[#e4c8c8] bg-white text-[#800000] hover:border-[#800000] hover:bg-[#fff3f3]"
                                        }`}
                                >
                                    #{idx + 1} {item.judul.split(" (")[0]}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* DAFTAR PROFIL LULUSAN INTERAKTIF */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="h-16 animate-pulse rounded-xl border border-[#ebd7d7] bg-[#faf2f2]"
                            />
                        ))}
                    </div>
                ) : filteredProfils.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#dfbaba] bg-[#fff9f9] p-8 text-center">
                        <p className="text-sm font-semibold text-[#800000]">
                            Tidak ada data peta kurikulum yang cocok dengan filter tersebut.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedSemester("all");
                            }}
                            className="mt-3 rounded-lg bg-[#800000] px-4 py-2 text-xs font-semibold text-white hover:bg-[#660000]"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredProfils.map((profil, idx) => {
                            const isOpen = openIds.includes(profil.id);
                            const totalSksProfil = profil.mata_kuliahs.reduce(
                                (acc, mk) => acc + Number(mk.sks || 0),
                                0
                            );

                            return (
                                <div
                                    key={profil.id}
                                    ref={(el) => {
                                        cardRefs.current[profil.id] = el;
                                    }}
                                    className="overflow-hidden rounded-xl border border-[#e5cece] bg-white shadow-[0_2px_10px_rgba(128,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_6px_20px_rgba(128,0,0,0.1)]"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleProfil(profil.id)}
                                        aria-expanded={isOpen}
                                        className="flex w-full flex-wrap items-center justify-between gap-3 bg-[#800000] px-5 py-4 text-left text-white transition-colors duration-200 hover:bg-[#6b0000]"
                                    >
                                        <div>
                                            <div className="text-lg leading-snug font-bold">
                                                {profil.judul}
                                            </div>
                                            <div className="mt-0.5 text-xs text-white/90 sm:text-sm">
                                                {profil.subjudul || `Profil Lulusan #${idx + 1}`}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#800000] sm:inline-block">
                                                {profil.cpls.length} CPL • {profil.mata_kuliahs.length}{" "}
                                                MK ({totalSksProfil} SKS)
                                            </span>
                                            <span
                                                className={`inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-xs transition-transform duration-300 ${isOpen ? "rotate-180 bg-white/25" : "rotate-0"
                                                    }`}
                                            >
                                                ▼
                                            </span>
                                        </div>
                                    </button>

                                    <div className="obe-accordion-grid" data-open={isOpen}>
                                        <div className="obe-accordion-inner">
                                            <div className="space-y-5 p-5 sm:p-6">
                                                {/* Step Indicator 1 -> 2 -> 3 */}
                                                <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#f0d9d9] bg-[#fff9f9] p-2.5 text-center text-xs font-semibold">
                                                    <div className="rounded-md bg-[#800000] px-2 py-1.5 text-white">
                                                        1. Profil Lulusan
                                                    </div>
                                                    <div className="rounded-md border border-[#e6c5c5] bg-white px-2 py-1.5 text-[#800000]">
                                                        2. CPL ({profil.cpls.length})
                                                    </div>
                                                    <div className="rounded-md border border-[#e6c5c5] bg-white px-2 py-1.5 text-[#800000]">
                                                        3. Mata Kuliah ({profil.mata_kuliahs.length})
                                                    </div>
                                                </div>

                                                {/* 1. Deskripsi */}
                                                <div className="rounded-r-lg border border-[#f2dede] border-l-4 border-l-[#800000] bg-[#fff8f8] px-4 py-3.5">
                                                    <div className="mb-1 text-sm font-bold text-[#800000]">
                                                        1. Deskripsi Peran Profesional (Profil Lulusan)
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-[#3a3030] sm:text-[15px]">
                                                        {profil.deskripsi}
                                                    </p>
                                                </div>

                                                {/* 2. CPL */}
                                                <div>
                                                    <div className="mb-2.5 text-sm font-bold text-[#800000]">
                                                        2. Capaian Pembelajaran Lulusan (Kompetensi yang
                                                        Harus Dicapai)
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                                                        {profil.cpls.map((cpl, cplIdx) => (
                                                            <div
                                                                key={cpl.id}
                                                                style={
                                                                    isOpen
                                                                        ? { animationDelay: `${cplIdx * 65}ms` }
                                                                        : undefined
                                                                }
                                                                className={`${isOpen ? "obe-stagger-item" : ""
                                                                    } rounded-lg border border-[#ebdada] bg-[#fdfcfc] p-3.5 transition-colors hover:border-[#800000]/40`}
                                                            >
                                                                <div className="mb-1 text-sm font-bold text-[#800000]">
                                                                    {cpl.kode_cpl}
                                                                </div>
                                                                <p className="text-sm leading-relaxed text-[#4f4747]">
                                                                    {cpl.deskripsi}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* 3. Mata Kuliah Pendukung */}
                                                <div>
                                                    <div className="mb-2.5 text-sm font-bold text-[#800000]">
                                                        3. Mata Kuliah Terkait (Pendukung Pencapaian CPL)
                                                    </div>
                                                    <div className="overflow-hidden rounded-lg border border-[#e8d5d5]">
                                                        {profil.mata_kuliahs.map((mk, mkIdx) => (
                                                            <div
                                                                key={mk.id}
                                                                style={
                                                                    isOpen
                                                                        ? {
                                                                            animationDelay: `${Math.min(
                                                                                mkIdx * 35,
                                                                                350
                                                                            )}ms`,
                                                                        }
                                                                        : undefined
                                                                }
                                                                className={`${isOpen ? "obe-stagger-item" : ""
                                                                    } flex flex-wrap items-center gap-2 border-b border-[#f1e2e2] px-4 py-2.5 last:border-b-0 sm:gap-3.5 ${mkIdx % 2 === 0
                                                                        ? "bg-white"
                                                                        : "bg-[#fffbfb]"
                                                                    } hover:bg-[#fff3f3]`}
                                                            >
                                                                <span className="w-6 text-xs font-semibold text-[#777777]">
                                                                    {mkIdx + 1}
                                                                </span>
                                                                <span className="w-24 text-xs font-bold tracking-wide text-[#800000] sm:text-sm">
                                                                    {mk.kode_mk}
                                                                </span>
                                                                <span className="min-w-[180px] flex-1 text-sm font-semibold text-[#222222]">
                                                                    {mk.nama_mk}
                                                                </span>
                                                                <span className="rounded-full bg-[#f2e4e4] px-3 py-0.5 text-xs font-bold text-[#800000]">
                                                                    {mk.sks} SKS
                                                                </span>
                                                                <span className="w-24 text-right text-xs text-[#5f5757] sm:text-sm">
                                                                    Semester {mk.semester}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Ringkasan Keterhubungan */}
                                                <div className="rounded-lg bg-[#800000] px-5 py-4 text-white">
                                                    <div className="mb-1 text-sm font-bold">
                                                        Ringkasan Keterhubungan (Poin 1, 2, dan 3)
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-white/95">
                                                        {profil.ringkasan_keterhubungan}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* CATATAN OBE */}
                <footer className="mt-8 rounded-r-xl border border-[#f2dede] border-l-4 border-l-[#800000] bg-[#fff8f8] px-5 py-4">
                    <div className="mb-1.5 text-sm font-semibold text-[#800000]">
                        Penjelasan Konsep Peta Kurikulum OBE
                    </div>
                    <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#4f4747]">
                        <li>
                            <strong>Pendekatan Outcome-Based Education (OBE)</strong> menyusun
                            kurikulum secara terbalik (<em>backward design</em>): dimulai dari
                            merumuskan Profil Lulusan yang dibutuhkan dunia profesi,
                            menurunkan CPL, lalu menyusun Mata Kuliah yang relevan.
                        </li>
                        <li>
                            Setiap mata kuliah memiliki keterikatan langsung (
                            <em>constructive alignment</em>) terhadap pemenuhan CPL dan
                            pembentukan profil lulusan mahasiswa Fakultas Hukum UNPAM.
                        </li>
                        <li>
                            Mahasiswa dapat berkonsultasi dengan Dosen Pembimbing Akademik
                            (DPA) untuk memilih mata kuliah peminatan yang paling sesuai dengan
                            target karier.
                        </li>
                    </ul>
                </footer>
            </div>
        </div>
    );
}