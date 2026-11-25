<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KurikulumCpl;
use App\Models\KurikulumMataKuliah;
use App\Models\KurikulumProfil;
use Database\Seeders\KurikulumSeeder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class KurikulumController extends Controller
{
    /**
     * Endpoint Publik: Peta Kurikulum OBE lengkap (Profil Lulusan -> CPL -> Mata Kuliah)
     */
    public function publik(Request $request): JsonResponse
    {
        $cari = mb_strtolower(trim((string) $request->input('search', '')), 'UTF-8');

        $profils = KurikulumProfil::with(['cpls', 'mataKuliahs'])
            ->orderBy('urutan', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        $totalCpl = 0;
        $totalMk = 0;

        $formatted = $profils->map(function (KurikulumProfil $profil) use ($cari, &$totalCpl, &$totalMk) {
            $cpls = $profil->cpls;
            $mks = $profil->mataKuliahs;

            $totalCpl += $cpls->count();
            $totalMk += $mks->count();

            if ($cari !== '') {
                $cocokProfil = str_contains(mb_strtolower($profil->judul, 'UTF-8'), $cari)
                    || str_contains(mb_strtolower($profil->deskripsi, 'UTF-8'), $cari);

                $cpls = $cpls->filter(fn (KurikulumCpl $cpl) =>
                    str_contains(mb_strtolower($cpl->kode_cpl, 'UTF-8'), $cari)
                    || str_contains(mb_strtolower($cpl->deskripsi, 'UTF-8'), $cari)
                )->values();

                $mks = $mks->filter(fn (KurikulumMataKuliah $mk) =>
                    str_contains(mb_strtolower($mk->kode_mk, 'UTF-8'), $cari)
                    || str_contains(mb_strtolower($mk->nama_mk, 'UTF-8'), $cari)
                )->values();

                if (! $cocokProfil && $cpls->isEmpty() && $mks->isEmpty()) {
                    return null;
                }
            }

            return [
                'id' => $profil->id,
                'judul' => $profil->judul,
                'subjudul' => $profil->subjudul,
                'deskripsi' => $profil->deskripsi,
                'ringkasan_keterhubungan' => $profil->ringkasan_keterhubungan,
                'urutan' => $profil->urutan,
                'total_sks_terkait' => (int) $profil->mataKuliahs->sum('sks'),
                'cpls' => $cpls,
                'mata_kuliahs' => $mks,
            ];
        })->filter()->values();

        return response()->json([
            'data' => $formatted,
            'ringkasan' => [
                'jumlah_profil' => $profils->count(),
                'label_capaian' => 'CPL',
                'total_sks_kurikulum' => 148,
                'total_cpl_item' => $totalCpl,
                'total_mk_terpetakan' => $totalMk,
            ],
        ]);
    }

    /**
     * Endpoint Admin: daftar seluruh profil lulusan beserta CPL & Mata Kuliah
     */
    public function index(): JsonResponse
    {
        $profils = KurikulumProfil::with(['cpls', 'mataKuliahs'])
            ->orderBy('urutan', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'data' => $profils,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $profil = KurikulumProfil::with(['cpls', 'mataKuliahs'])->findOrFail($id);

        return response()->json([
            'data' => $profil,
        ]);
    }

    public function storeProfil(Request $request): JsonResponse
    {
        $validasi = $request->validate([
            'judul' => 'required|string|max:255',
            'subjudul' => 'nullable|string|max:255',
            'deskripsi' => 'required|string',
            'ringkasan_keterhubungan' => 'required|string',
            'urutan' => 'nullable|integer|min:0',
        ]);

        $profil = KurikulumProfil::create([
            'judul' => trim($validasi['judul']),
            'subjudul' => isset($validasi['subjudul']) ? trim($validasi['subjudul']) : null,
            'deskripsi' => trim($validasi['deskripsi']),
            'ringkasan_keterhubungan' => trim($validasi['ringkasan_keterhubungan']),
            'urutan' => (int) ($validasi['urutan'] ?? (KurikulumProfil::max('urutan') + 1)),
        ]);

        return response()->json([
            'pesan' => 'Profil lulusan berhasil ditambahkan.',
            'data' => $profil->load(['cpls', 'mataKuliahs']),
        ], 201);
    }

    public function updateProfil(Request $request, int $id): JsonResponse
    {
        $profil = KurikulumProfil::findOrFail($id);

        $validasi = $request->validate([
            'judul' => 'required|string|max:255',
            'subjudul' => 'nullable|string|max:255',
            'deskripsi' => 'required|string',
            'ringkasan_keterhubungan' => 'required|string',
            'urutan' => 'nullable|integer|min:0',
        ]);

        $profil->update([
            'judul' => trim($validasi['judul']),
            'subjudul' => isset($validasi['subjudul']) ? trim($validasi['subjudul']) : $profil->subjudul,
            'deskripsi' => trim($validasi['deskripsi']),
            'ringkasan_keterhubungan' => trim($validasi['ringkasan_keterhubungan']),
            'urutan' => isset($validasi['urutan']) ? (int) $validasi['urutan'] : $profil->urutan,
        ]);

        return response()->json([
            'pesan' => 'Profil lulusan berhasil diperbarui.',
            'data' => $profil->fresh(['cpls', 'mataKuliahs']),
        ]);
    }

    public function destroyProfil(int $id): JsonResponse
    {
        $profil = KurikulumProfil::findOrFail($id);
        $profil->delete();

        return response()->json([
            'pesan' => 'Profil lulusan berhasil dihapus.',
        ]);
    }

    public function storeCpl(Request $request, int $profilId): JsonResponse
    {
        $profil = KurikulumProfil::findOrFail($profilId);

        $validasi = $request->validate([
            'kode_cpl' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'urutan' => 'nullable|integer|min:0',
        ]);

        $cpl = $profil->cpls()->create([
            'kode_cpl' => trim($validasi['kode_cpl']),
            'deskripsi' => trim($validasi['deskripsi']),
            'urutan' => (int) ($validasi['urutan'] ?? ($profil->cpls()->max('urutan') + 1)),
        ]);

        return response()->json([
            'pesan' => 'CPL berhasil ditambahkan.',
            'data' => $cpl,
        ], 201);
    }

    public function updateCpl(Request $request, int $cplId): JsonResponse
    {
        $cpl = KurikulumCpl::findOrFail($cplId);

        $validasi = $request->validate([
            'kode_cpl' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'urutan' => 'nullable|integer|min:0',
        ]);

        $cpl->update([
            'kode_cpl' => trim($validasi['kode_cpl']),
            'deskripsi' => trim($validasi['deskripsi']),
            'urutan' => isset($validasi['urutan']) ? (int) $validasi['urutan'] : $cpl->urutan,
        ]);

        return response()->json([
            'pesan' => 'CPL berhasil diperbarui.',
            'data' => $cpl->fresh(),
        ]);
    }

    public function destroyCpl(int $cplId): JsonResponse
    {
        $cpl = KurikulumCpl::findOrFail($cplId);
        $cpl->delete();

        return response()->json([
            'pesan' => 'CPL berhasil dihapus.',
        ]);
    }

    public function storeMataKuliah(Request $request, int $profilId): JsonResponse
    {
        $profil = KurikulumProfil::findOrFail($profilId);

        $validasi = $request->validate([
            'kode_mk' => 'required|string|max:50',
            'nama_mk' => 'required|string|max:255',
            'sks' => 'required|integer|min:1|max:12',
            'semester' => 'required|integer|min:1|max:14',
            'urutan' => 'nullable|integer|min:0',
        ]);

        $mk = $profil->mataKuliahs()->create([
            'kode_mk' => strtoupper(trim($validasi['kode_mk'])),
            'nama_mk' => trim($validasi['nama_mk']),
            'sks' => (int) $validasi['sks'],
            'semester' => (int) $validasi['semester'],
            'urutan' => (int) ($validasi['urutan'] ?? ($profil->mataKuliahs()->max('urutan') + 1)),
        ]);

        return response()->json([
            'pesan' => 'Mata kuliah pendukung berhasil ditambahkan.',
            'data' => $mk,
        ], 201);
    }

    public function updateMataKuliah(Request $request, int $mkId): JsonResponse
    {
        $mk = KurikulumMataKuliah::findOrFail($mkId);

        $validasi = $request->validate([
            'kode_mk' => 'required|string|max:50',
            'nama_mk' => 'required|string|max:255',
            'sks' => 'required|integer|min:1|max:12',
            'semester' => 'required|integer|min:1|max:14',
            'urutan' => 'nullable|integer|min:0',
        ]);

        $mk->update([
            'kode_mk' => strtoupper(trim($validasi['kode_mk'])),
            'nama_mk' => trim($validasi['nama_mk']),
            'sks' => (int) $validasi['sks'],
            'semester' => (int) $validasi['semester'],
            'urutan' => isset($validasi['urutan']) ? (int) $validasi['urutan'] : $mk->urutan,
        ]);

        return response()->json([
            'pesan' => 'Mata kuliah pendukung berhasil diperbarui.',
            'data' => $mk->fresh(),
        ]);
    }

    public function destroyMataKuliah(int $mkId): JsonResponse
    {
        $mk = KurikulumMataKuliah::findOrFail($mkId);
        $mk->delete();

        return response()->json([
            'pesan' => 'Mata kuliah pendukung berhasil dihapus.',
        ]);
    }

    public function seedDefault(): JsonResponse
    {
        Artisan::call('db:seed', [
            '--class' => KurikulumSeeder::class,
            '--force' => true,
        ]);

        return response()->json([
            'pesan' => 'Data awal peta kurikulum OBE (5 Profil Lulusan, CPL, dan Mata Kuliah) berhasil dimuat.',
            'data' => KurikulumProfil::with(['cpls', 'mataKuliahs'])->orderBy('urutan')->get(),
        ]);
    }
}