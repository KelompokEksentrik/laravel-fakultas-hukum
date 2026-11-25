<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DosenController extends Controller
{
    /**
     * Endpoint Publik: daftar dosen A-Z dengan pencarian & pagination (default 12/halaman)
     */
    public function publik(Request $request): JsonResponse
    {
        $perHalaman = max(1, (int) $request->input('per_page', 12));
        $cari = trim((string) $request->input('search', ''));

        $query = Dosen::query()
            ->orderByRaw("COALESCE(NULLIF(TRIM(nama_sort), ''), lower(TRIM(nama))) ASC")
            ->orderBy('id', 'asc');

        if ($cari !== '') {
            $query->where(function ($q) use ($cari) {
                $q->where('nama', 'ilike', "%{$cari}%")
                    ->orWhere('nidn_nuptk', 'ilike', "%{$cari}%")
                    ->orWhere('kepakaran', 'ilike', "%{$cari}%");
            });
        }

        $paginasi = $query->paginate($perHalaman);

        return response()->json([
            'data' => $paginasi->items(),
            'meta' => [
                'current_page' => $paginasi->currentPage(),
                'last_page' => $paginasi->lastPage(),
                'per_page' => $paginasi->perPage(),
                'total' => $paginasi->total(),
                'from' => $paginasi->firstItem() ?? 0,
                'to' => $paginasi->lastItem() ?? 0,
            ],
        ]);
    }

    /**
     * Endpoint Admin: daftar dosen dengan pencarian & pagination (default 10/halaman)
     */
    public function index(Request $request): JsonResponse
    {
        $perHalaman = max(1, (int) $request->input('per_page', 10));
        $cari = trim((string) $request->input('search', ''));

        $query = Dosen::query()
            ->orderByRaw("COALESCE(NULLIF(TRIM(nama_sort), ''), lower(TRIM(nama))) ASC")
            ->orderBy('id', 'asc');

        if ($cari !== '') {
            $query->where(function ($q) use ($cari) {
                $q->where('nama', 'ilike', "%{$cari}%")
                    ->orWhere('nidn_nuptk', 'ilike', "%{$cari}%")
                    ->orWhere('kepakaran', 'ilike', "%{$cari}%");
            });
        }

        $paginasi = $query->paginate($perHalaman);

        return response()->json([
            'data' => $paginasi->items(),
            'meta' => [
                'current_page' => $paginasi->currentPage(),
                'last_page' => $paginasi->lastPage(),
                'per_page' => $paginasi->perPage(),
                'total' => $paginasi->total(),
                'from' => $paginasi->firstItem() ?? 0,
                'to' => $paginasi->lastItem() ?? 0,
            ],
        ]);
    }

    /**
     * Tambah data dosen baru
     */
    public function store(Request $request): JsonResponse
    {
        $validasi = $request->validate([
            'nama' => 'required|string|max:255',
            'nidn_nuptk' => 'nullable|string|max:100',
            'kepakaran' => 'nullable|string|max:500',
            'foto_url' => 'nullable|string|max:1000',
            'foto_file' => 'nullable|image|max:3072',
            'link_scholar' => 'nullable|string|max:1000',
            'link_sinta' => 'nullable|string|max:1000',
            'link_pddikti' => 'nullable|string|max:2000',
            'link_scopus' => 'nullable|string|max:1000',
            'urutan' => 'nullable|integer',
        ]);

        $fotoFinal = $this->prosesFoto($request, $validasi['foto_url'] ?? null);

        $dosen = Dosen::create([
            'nama' => trim($validasi['nama']),
            'nama_sort' => Dosen::buatNamaSort(trim($validasi['nama'])),
            'nidn_nuptk' => $this->bersihkanTeks($validasi['nidn_nuptk'] ?? null),
            'kepakaran' => $this->bersihkanTeks($validasi['kepakaran'] ?? null),
            'foto_url' => $fotoFinal,
            'link_scholar' => $this->bersihkanUrl($validasi['link_scholar'] ?? null),
            'link_sinta' => $this->bersihkanUrl($validasi['link_sinta'] ?? null),
            'link_pddikti' => $this->bersihkanUrl($validasi['link_pddikti'] ?? null),
            'link_scopus' => $this->bersihkanUrl($validasi['link_scopus'] ?? null),
            'urutan' => (int) ($validasi['urutan'] ?? 0),
        ]);

        return response()->json([
            'pesan' => 'Data dosen berhasil ditambahkan.',
            'data' => $dosen,
        ], 201);
    }

    /**
     * Perbarui data dosen (mendukung POST dengan FormData maupun PUT/PATCH)
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $dosen = Dosen::findOrFail($id);

        $validasi = $request->validate([
            'nama' => 'required|string|max:255',
            'nidn_nuptk' => 'nullable|string|max:100',
            'kepakaran' => 'nullable|string|max:500',
            'foto_url' => 'nullable|string|max:1000',
            'foto_file' => 'nullable|image|max:3072',
            'link_scholar' => 'nullable|string|max:1000',
            'link_sinta' => 'nullable|string|max:1000',
            'link_pddikti' => 'nullable|string|max:2000',
            'link_scopus' => 'nullable|string|max:1000',
            'urutan' => 'nullable|integer',
        ]);

        $fotoFinal = $this->prosesFoto($request, $validasi['foto_url'] ?? $dosen->foto_url);
        $namaBaru = trim($validasi['nama']);

        $dosen->update([
            'nama' => $namaBaru,
            'nama_sort' => Dosen::buatNamaSort($namaBaru),
            'nidn_nuptk' => $this->bersihkanTeks($validasi['nidn_nuptk'] ?? null),
            'kepakaran' => $this->bersihkanTeks($validasi['kepakaran'] ?? null),
            'foto_url' => $fotoFinal,
            'link_scholar' => $this->bersihkanUrl($validasi['link_scholar'] ?? null),
            'link_sinta' => $this->bersihkanUrl($validasi['link_sinta'] ?? null),
            'link_pddikti' => $this->bersihkanUrl($validasi['link_pddikti'] ?? null),
            'link_scopus' => $this->bersihkanUrl($validasi['link_scopus'] ?? null),
            'urutan' => isset($validasi['urutan']) ? (int) $validasi['urutan'] : $dosen->urutan,
        ]);

        return response()->json([
            'pesan' => 'Data dosen berhasil diperbarui.',
            'data' => $dosen->fresh(),
        ]);
    }

    /**
     * Hapus data dosen
     */
    public function destroy(int $id): JsonResponse
    {
        $dosen = Dosen::findOrFail($id);
        $dosen->delete();

        return response()->json([
            'pesan' => 'Data dosen berhasil dihapus.',
        ]);
    }

    /**
     * Impor data dosen dari file CSV hasil export spreadsheet
     */
    public function importCsv(Request $request): JsonResponse
    {
        $request->validate([
            'file_csv' => 'required|file|mimes:csv,txt|max:5120',
        ]);

        $path = $request->file('file_csv')->getRealPath();
        $handle = fopen($path, 'r');
        if ($handle === false) {
            return response()->json(['pesan' => 'Gagal membaca file CSV.'], 422);
        }

        // Deteksi delimiter koma (,) atau titik koma (;)
        $barisPertama = fgets($handle);
        rewind($handle);
        $delimiter = (substr_count((string) $barisPertama, ';') > substr_count((string) $barisPertama, ','))
            ? ';'
            : ',';

        $barisKe = 0;
        $diimpor = 0;

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $barisKe++;

            // Lewati baris kosong atau baris header
            $joined = trim(implode('', $row));
            if ($joined === '') {
                continue;
            }
            if ($barisKe === 1 && preg_match('/\bnama\b/i', (string) ($row[1] ?? $row[0] ?? ''))) {
                continue;
            }

            // Asumsi kolom spreadsheet:
            // [0] No/Urutan, [1] Nama, [2] NIDN/NUPTK, [3] Kepakaran, [4] Foto, [5] Scholar, [6] Sinta, [7] PDDikti, [8] Scopus
            $hasNoCol = is_numeric(trim((string) ($row[0] ?? '')));
            $offset = $hasNoCol ? 1 : 0;

            $nama = $this->bersihkanTeks($row[$offset] ?? null);
            if ($nama === null) {
                continue;
            }

            $nidn = $this->bersihkanTeks($row[$offset + 1] ?? null);
            $kepakaran = $this->bersihkanTeks($row[$offset + 2] ?? null);
            $fotoRaw = $this->bersihkanTeks($row[$offset + 3] ?? null);
            $scholarRaw = $this->bersihkanTeks($row[$offset + 4] ?? null);
            $sintaRaw = $this->bersihkanTeks($row[$offset + 5] ?? null);
            $pddiktiRaw = $this->bersihkanTeks($row[$offset + 6] ?? null);
            $scopusRaw = $this->bersihkanTeks($row[$offset + 7] ?? null);

            Dosen::updateOrCreate(
                ['nama' => $nama],
                [
                    'nama_sort' => Dosen::buatNamaSort($nama),
                    'nidn_nuptk' => $nidn,
                    'kepakaran' => $kepakaran,
                    'foto_url' => $this->konversiFotoUrl($fotoRaw),
                    'link_scholar' => $this->bersihkanUrl($scholarRaw),
                    'link_sinta' => $this->bersihkanUrl($sintaRaw),
                    'link_pddikti' => $this->bersihkanUrl($pddiktiRaw),
                    'link_scopus' => $this->bersihkanUrl($scopusRaw),
                    'urutan' => $hasNoCol ? (int) trim((string) $row[0]) : ($diimpor + 1),
                ]
            );

            $diimpor++;
        }

        fclose($handle);

        return response()->json([
            'pesan' => "Berhasil mengimpor {$diimpor} data dosen.",
            'total' => $diimpor,
        ]);
    }

    /**
     * Sinkronisasi ulang nama_sort dan normalisasi URL seluruh data dosen
     */
    public function sinkronSort(): JsonResponse
    {
        $total = 0;

        Dosen::orderBy('id')->chunk(100, function ($items) use (&$total) {
            foreach ($items as $dosen) {
                $dosen->update([
                    'nama_sort' => Dosen::buatNamaSort((string) $dosen->nama),
                    'link_scholar' => $this->bersihkanUrl($dosen->link_scholar),
                    'link_sinta' => $this->bersihkanUrl($dosen->link_sinta),
                    'link_pddikti' => $this->bersihkanUrl($dosen->link_pddikti),
                    'link_scopus' => $this->bersihkanUrl($dosen->link_scopus),
                ]);
                $total++;
            }
        });

        return response()->json([
            'pesan' => "Berhasil menyinkronkan {$total} data dosen.",
            'total' => $total,
        ]);
    }

    private function prosesFoto(Request $request, ?string $fotoUrl): ?string
    {
        if ($request->hasFile('foto_file')) {
            $file = $request->file('foto_file');
            $namaFile = 'dosen/' . Str::uuid() . '.' . $file->getClientOriginalExtension();

            try {
                Storage::disk('s3')->put($namaFile, file_get_contents($file->getRealPath()), 'public');
                return Storage::disk('s3')->url($namaFile);
            } catch (\Throwable $e) {
                $lokal = $file->store('dosen', 'public');
                return asset('storage/' . $lokal);
            }
        }

        return $this->konversiFotoUrl($this->bersihkanTeks($fotoUrl));
    }

    private function konversiFotoUrl(?string $url): ?string
    {
        if ($url === null) {
            return null;
        }

        if (preg_match('#/file/d/([a-zA-Z0-9_-]+)#', $url, $matches)) {
            return "https://drive.google.com/thumbnail?id={$matches[1]}&sz=w600";
        }

        if (preg_match('#[?&]id=([a-zA-Z0-9_-]+)#', $url, $matches) && str_contains($url, 'drive.google.com')) {
            return "https://drive.google.com/thumbnail?id={$matches[1]}&sz=w600";
        }

        return filter_var($url, FILTER_VALIDATE_URL) ? $url : null;
    }

    private function bersihkanTeks(?string $nilai): ?string
    {
        if ($nilai === null) {
            return null;
        }
        $bersih = trim(preg_replace('/\s+/', ' ', $nilai));
        if ($bersih === '' || in_array(mb_strtolower($bersih), ['-', 'n/a', 'null', 'tidak ada'], true)) {
            return null;
        }
        return $bersih;
    }

    private function bersihkanUrl(?string $raw): ?string
    {
        $bersih = $this->bersihkanTeks($raw);
        if ($bersih === null) {
            return null;
        }

        $kandidat = trim(explode('|', $bersih)[0]);
        return filter_var($kandidat, FILTER_VALIDATE_URL) ? $kandidat : null;
    }
}