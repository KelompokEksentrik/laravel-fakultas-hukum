<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DosenController extends Controller
{
    /**
     * Endpoint Publik: daftar dosen dengan pencarian & pagination 12/halaman
     */
    public function publik(Request $request): JsonResponse
    {
        $perHalaman = (int) $request->input('per_page', 12);
        $cari = trim((string) $request->input('search', ''));

        $query = Dosen::query()
            ->orderBy('urutan', 'asc')
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
     * Endpoint Admin: daftar semua dosen (untuk tabel dashboard)
     */
    public function index(Request $request): JsonResponse
    {
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

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    /**
     * Endpoint Admin: tambah dosen baru
     */
    public function store(Request $request): JsonResponse
    {
        $validasi = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'nidn_nuptk' => ['nullable', 'string', 'max:100'],
            'kepakaran' => ['nullable', 'string'],
            'foto_url' => ['nullable', 'string'],
            'foto_file' => ['nullable', 'image', 'max:3072'],
            'link_scholar' => ['nullable', 'string'],
            'link_sinta' => ['nullable', 'string'],
            'link_pddikti' => ['nullable', 'string'],
            'link_scopus' => ['nullable', 'string'],
            'urutan' => ['nullable', 'integer'],
        ]);

        $fotoUrl = $this->normalisasiFotoUrl($validasi['foto_url'] ?? null);

        if ($request->hasFile('foto_file')) {
            $path = $request->file('foto_file')->store('dosen', 's3');
            $fotoUrl = Storage::disk('s3')->url($path);
        }

        $dosen = Dosen::create([
            'nama' => $validasi['nama'],
            'nidn_nuptk' => $validasi['nidn_nuptk'] ?? null,
            'kepakaran' => $validasi['kepakaran'] ?? null,
            'foto_url' => $fotoUrl,
            'link_scholar' => $this->bersihkanUrl($validasi['link_scholar'] ?? null),
            'link_sinta' => $this->bersihkanUrl($validasi['link_sinta'] ?? null),
            'link_pddikti' => $this->bersihkanUrl($validasi['link_pddikti'] ?? null),
            'link_scopus' => $this->bersihkanUrl($validasi['link_scopus'] ?? null),
            'urutan' => $validasi['urutan'] ?? (Dosen::max('urutan') + 1),
        ]);

        return response()->json([
            'pesan' => 'Data dosen berhasil ditambahkan.',
            'data' => $dosen,
        ], 201);
    }

    /**
     * Endpoint Admin: perbarui data dosen
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $dosen = Dosen::findOrFail($id);

        $validasi = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'nidn_nuptk' => ['nullable', 'string', 'max:100'],
            'kepakaran' => ['nullable', 'string'],
            'foto_url' => ['nullable', 'string'],
            'foto_file' => ['nullable', 'image', 'max:3072'],
            'link_scholar' => ['nullable', 'string'],
            'link_sinta' => ['nullable', 'string'],
            'link_pddikti' => ['nullable', 'string'],
            'link_scopus' => ['nullable', 'string'],
            'urutan' => ['nullable', 'integer'],
        ]);

        $fotoUrl = $this->normalisasiFotoUrl($validasi['foto_url'] ?? $dosen->foto_url);

        if ($request->hasFile('foto_file')) {
            $path = $request->file('foto_file')->store('dosen', 's3');
            $fotoUrl = Storage::disk('s3')->url($path);
        }

        $dosen->update([
            'nama' => $validasi['nama'],
            'nidn_nuptk' => $validasi['nidn_nuptk'] ?? null,
            'kepakaran' => $validasi['kepakaran'] ?? null,
            'foto_url' => $fotoUrl,
            'link_scholar' => $this->bersihkanUrl($validasi['link_scholar'] ?? null),
            'link_sinta' => $this->bersihkanUrl($validasi['link_sinta'] ?? null),
            'link_pddikti' => $this->bersihkanUrl($validasi['link_pddikti'] ?? null),
            'link_scopus' => $this->bersihkanUrl($validasi['link_scopus'] ?? null),
            'urutan' => $validasi['urutan'] ?? $dosen->urutan,
        ]);

        return response()->json([
            'pesan' => 'Data dosen berhasil diperbarui.',
            'data' => $dosen,
        ]);
    }

    /**
     * Endpoint Admin: hapus dosen
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
     * Endpoint Admin: Import CSV langsung dari Google Sheets / Excel (140+ data sekaligus)
     */
    public function importCsv(Request $request): JsonResponse
    {
        $request->validate([
            'file_csv' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ]);

        $file = $request->file('file_csv');
        $handle = fopen($file->getRealPath(), 'r');

        if (! $handle) {
            return response()->json(['pesan' => 'Gagal membaca file CSV.'], 422);
        }

        // Deteksi delimiter otomatis (, atau ; atau tab)
        $barisPertama = fgets($handle);
        rewind($handle);
        $delimiter = ',';
        if (substr_count($barisPertama, ';') > substr_count($barisPertama, ',')) {
            $delimiter = ';';
        } elseif (substr_count($barisPertama, "\t") > substr_count($barisPertama, ',')) {
            $delimiter = "\t";
        }

        $header = fgetcsv($handle, 0, $delimiter); // Lewati baris header
        $berhasil = 0;
        $urutan = (int) Dosen::max('urutan');

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $nama = trim((string) ($row[0] ?? ''));
            if ($nama === '') {
                continue;
            }

            $urutan++;
            $kepakaran   = trim((string) ($row[1] ?? '')) ?: null;
            $linkScholar = $this->bersihkanUrl($row[2] ?? null);
            $linkSinta   = $this->bersihkanUrl($row[3] ?? null);
            $linkPddikti = $this->bersihkanUrl($row[4] ?? null);
            $nidn        = trim((string) ($row[5] ?? '')) ?: null;
            $fotoUrl     = $this->normalisasiFotoUrl($row[6] ?? null);
            $linkScopus  = $this->bersihkanUrl($row[7] ?? null);

            Dosen::updateOrCreate(
                ['nama' => $nama],
                [
                    'nidn_nuptk'   => $nidn,
                    'kepakaran'    => $kepakaran,
                    'foto_url'     => $fotoUrl,
                    'link_scholar' => $linkScholar,
                    'link_sinta'   => $linkSinta,
                    'link_pddikti' => $linkPddikti,
                    'link_scopus'  => $linkScopus,
                    'urutan'       => $urutan,
                ]
            );

            $berhasil++;
        }

        fclose($handle);

        return response()->json([
            'pesan' => "Berhasil mengimpor {$berhasil} data dosen dari spreadsheet.",
            'total_impor' => $berhasil,
        ]);
    }

    /**
     * Ubah link Google Drive /file/d/ID/view menjadi direct thumbnail agar tampil di <img>
     */
    private function normalisasiFotoUrl(?string $url): ?string
    {
        $url = trim((string) $url);
        if ($url === '') {
            return null;
        }

        if (preg_match('/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/', $url, $match)) {
            return "https://drive.google.com/thumbnail?id={$match[1]}&sz=w600";
        }

        if (preg_match('/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/', $url, $match)) {
            return "https://drive.google.com/thumbnail?id={$match[1]}&sz=w600";
        }

        return $url;
    }

    /**
     * Ambil URL bersih pertama (mengatasi sel seperti "https://scholar... | ORCID: ...")
     */
    private function bersihkanUrl(?string $raw): ?string
    {
        $raw = trim((string) $raw);
        if ($raw === '') {
            return null;
        }

        $bagianPertama = trim(explode('|', $raw)[0]);
        return filter_var($bagianPertama, FILTER_VALIDATE_URL) ? $bagianPertama : $bagianPertama;
    }
    /**
 * Mengambil nama inti saja tanpa gelar depan maupun gelar belakang untuk sorting A-Z
 */
    private function ekstrakNamaInti(string $namaLengkap): string
    {
        // 1. Ambil bagian sebelum koma pertama (menghilangkan gelar belakang seperti ", S.H., M.H.")
        $tanpaGelarBelakang = explode(',', $namaLengkap)[0];

        // 2. Bersihkan gelar depan berulang (Prof., Dr., Assoc., dr., Dr (C)., H., Hj., Ir., Drs., Dra., KH., dll.)
        $polaGelarDepan = '/^(?:assoc\.?|prof\.?|dr\.?|drs\.?|dra\.?|ir\.?|h\.?|hj\.?|kh\.?|ust\.?|ustadz\.?|raden\.?|rm\.?|tb\.?|dr\s*\(c\)\.?|prof\s*\(emeritus\)\.?)\s+/i';

        $hasil = trim($tanpaGelarBelakang);
        while (preg_match($polaGelarDepan, $hasil)) {
            $hasil = preg_replace($polaGelarDepan, '', $hasil);
            $hasil = trim((string) $hasil);
        }

        // 3. Bersihkan titik/koma berlebih di awal atau akhir lalu lowercase untuk sorting A-Z
        $hasilBersih = trim($hasil, " \t\n\r\0\x0B.,");
        return mb_strtolower($hasilBersih !== '' ? $hasilBersih : $namaLengkap, 'UTF-8');
    }
    public function sinkronSort(): JsonResponse
    {
        $total = 0;

        Dosen::orderBy('id')->chunk(100, function ($items) use (&$total) {
            foreach ($items as $dosen) {
                $dosen->nama_sort = Dosen::buatNamaSort((string) $dosen->nama);
                $dosen->save();
                $total++;
            }
        });

        return response()->json([
            'pesan' => "Berhasil memperbarui nama_sort untuk {$total} dosen.",
            'total' => $total,
        ]);
    }

}