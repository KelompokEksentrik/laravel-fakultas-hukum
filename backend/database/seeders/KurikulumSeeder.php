<?php

namespace Database\Seeders;

use App\Models\KurikulumProfil;
use Illuminate\Database\Seeder;

class KurikulumSeeder extends Seeder
{
    public function run(): void
    {
        $dataProfil = [
            [
                'urutan' => 1,
                'judul' => 'Pengacara / Advokat & Praktisi Hukum',
                'subjudul' => 'Profil Lulusan #1 • Litigasi & Non-Litigasi',
                'deskripsi' => 'Profesi yang memberikan jasa hukum, advokasi perkara pidana, perdata, tata usaha negara, maupun peradilan agama, serta pendampingan negosiasi dan mediasi penyelesaian sengketa di luar pengadilan.',
                'ringkasan_keterhubungan' => 'Sebagai Pengacara / Advokat & Praktisi Hukum, lulusan dibekali pemahaman mendalam tentang prosedur peradilan dan etika advokasi (Poin 1), yang diwujudkan melalui penguasaan Capaian Pembelajaran berupa kemampuan menyusun surat hukum, teknik pembuktian, dan strategi pembelaan (Poin 2). Seluruh kompetensi ini secara terstruktur disokong oleh paket Mata Kuliah Hukum Acara, Keadvokatan, serta Praktik Litigasi dan Non-Litigasi (Poin 3).',
                'cpls' => [
                    ['kode_cpl' => 'CPL-A (Integritas Etika)', 'deskripsi' => 'Menjunjung tinggi kode etik advokat, integritas moralitas penegakan hukum, keadilan substantif, dan perlindungan hak asasi manusia.'],
                    ['kode_cpl' => 'CPL-B (Keahlian Hukum Acara)', 'deskripsi' => 'Menguasai hukum materiil (Perdata, Pidana, TUN) dan seluruh tahapan hukum formil pada lingkungan peradilan di Indonesia.'],
                    ['kode_cpl' => 'CPL-C (Keterampilan Advokasi & Litigasi)', 'deskripsi' => 'Mampu menyusun dokumen hukum persidangan (surat kuasa, gugatan, replik, pledoi, memori banding/kasasi) dan beracara di pengadilan.'],
                    ['kode_cpl' => 'CPL-D (Penyelesaian Alternatif / Non-Litigasi)', 'deskripsi' => 'Mampu melakukan teknik mediasi, negosiasi, dan konsiliasi untuk menyelesaikan perselisihan secara damai dan solutif.'],
                ],
                'mata_kuliahs' => [
                    ['kode_mk' => '22HUK0373', 'nama_mk' => 'Keadvokatan', 'sks' => 3, 'semester' => 6],
                    ['kode_mk' => '22HUK0314', 'nama_mk' => 'Hukum Acara Perdata', 'sks' => 4, 'semester' => 4],
                    ['kode_mk' => '22HUK0324', 'nama_mk' => 'Hukum Acara Pidana', 'sks' => 4, 'semester' => 4],
                    ['kode_mk' => '22HUK0102', 'nama_mk' => 'Hukum Acara Peradilan TUN', 'sks' => 2, 'semester' => 5],
                    ['kode_mk' => '22HUK0152', 'nama_mk' => 'Hukum Acara Peradilan Agama', 'sks' => 2, 'semester' => 6],
                    ['kode_mk' => '22HUK0112', 'nama_mk' => 'Hukum Pembuktian', 'sks' => 2, 'semester' => 5],
                    ['kode_mk' => '22HUK0192', 'nama_mk' => 'PLKH Perdata (Peradilan Semu)', 'sks' => 2, 'semester' => 7],
                    ['kode_mk' => '22HUK0202', 'nama_mk' => 'PLKH Pidana (Peradilan Semu)', 'sks' => 2, 'semester' => 7],
                    ['kode_mk' => '22HUK0222', 'nama_mk' => 'PLKH Non Litigasi', 'sks' => 2, 'semester' => 7],
                    ['kode_mk' => '22FHK0102', 'nama_mk' => 'Etika Profesi Hukum', 'sks' => 2, 'semester' => 7],
                ],
            ],
            [
                'urutan' => 2,
                'judul' => 'Perancang Peraturan & Kontrak (Legal Drafter)',
                'subjudul' => 'Profil Lulusan #2 • Perancangan Regulasi & Kontrak Bisnis',
                'deskripsi' => 'Profesi yang memiliki keahlian khusus dalam menganalisis, merancang naskah akademik peraturan perundang-undangan (tingkat nasional dan daerah), serta menyusun dan menelaah kontrak bisnis (contract drafting) secara cermat dan bebas risiko celah hukum.',
                'ringkasan_keterhubungan' => 'Sebagai Perancang Peraturan & Kontrak (Legal Drafter) (Poin 1), lulusan dilatih memiliki kepekaan logika yuridis untuk menyusun norma hukum yang presisi dan mengikat (Poin 2). Capaian tersebut ditopang oleh Mata Kuliah Ilmu Perundang-undangan, Hukum Perikatan, Perjanjian Internasional, serta Hukum Kelembagaan Negara (Poin 3).',
                'cpls' => [
                    ['kode_cpl' => 'CPL-A (Penalaran & Logika Perundang-undangan)', 'deskripsi' => 'Menguasai teori hierarki peraturan perundang-undangan, asas-asas pembentukan peraturan yang baik, dan logika perancangan hukum.'],
                    ['kode_cpl' => 'CPL-B (Keahlian Contract Drafting)', 'deskripsi' => 'Mampu merumuskan klausul kontrak komersial, addendum, jaminan, serta mengidentifikasi risiko hukum dalam transaksi bisnis.'],
                    ['kode_cpl' => 'CPL-C (Penyusunan Naskah Akademik)', 'deskripsi' => 'Mampu melakukan harmonisasi hukum dan menyusun draf rancangan undang-undang serta peraturan daerah yang partisipatif dan implementatif.'],
                ],
                'mata_kuliahs' => [
                    ['kode_mk' => '22HUK0352', 'nama_mk' => 'Ilmu Perundang-undangan', 'sks' => 2, 'semester' => 4],
                    ['kode_mk' => '22HUK0332', 'nama_mk' => 'Hukum Perikatan', 'sks' => 2, 'semester' => 4],
                    ['kode_mk' => '22FHK0022', 'nama_mk' => 'Logika dan Penalaran Hukum', 'sks' => 2, 'semester' => 1],
                    ['kode_mk' => '22HUK0342', 'nama_mk' => 'Hukum Pemerintahan Daerah', 'sks' => 2, 'semester' => 4],
                    ['kode_mk' => '22HUK1033', 'nama_mk' => 'Hukum Kelembagaan Negara', 'sks' => 3, 'semester' => 5],
                    ['kode_mk' => '22HUK3032', 'nama_mk' => 'Hak Uji Materil', 'sks' => 2, 'semester' => 7],
                    ['kode_mk' => '22HUK3012', 'nama_mk' => 'Hukum Jaminan', 'sks' => 2, 'semester' => 7],
                    ['kode_mk' => '22HUK2042', 'nama_mk' => 'Hukum Perjanjian Internasional', 'sks' => 2, 'semester' => 6],
                ],
            ],
            [
                'urutan' => 3,
                'judul' => 'Konsultan Hukum Bisnis / In-House Counsel',
                'subjudul' => 'Profil Lulusan #3 • Hukum Bisnis & Kepatuhan Perusahaan',
                'deskripsi' => 'Pakar hukum internal perusahaan yang bertugas memberikan nasihat hukum (legal opinion/advice), mengawal kepatuhan regulasi (regulatory compliance), menangani perizinan bisnis, merger dan akuisisi, kepailitan, dan sengketa hubungan industrial.',
                'ringkasan_keterhubungan' => 'Sebagai Konsultan Hukum Bisnis / In-House Counsel (Poin 1), lulusan memiliki kompetensi mengawal legalitas bisnis dan mitigasi risiko operasional perusahaan (Poin 2). Mata Kuliah spesifik seperti Hukum Dagang, Perbankan, Kepailitan, HAKI, Pajak, dan Hubungan Industrial menjadi pilar utama pembentukan profil ini (Poin 3).',
                'cpls' => [
                    ['kode_cpl' => 'CPL-A (Penguasaan Hukum Korporasi & Komersial)', 'deskripsi' => 'Menguasai regulasi hukum perseroan terbatas, perbankan, pasar modal, hak kekayaan intelektual, kepailitan, dan perpajakan.'],
                    ['kode_cpl' => 'CPL-B (Legal Due Diligence & Audit)', 'deskripsi' => 'Mampu melaksanakan uji tuntas hukum (legal audit) dan menyusun pendapat hukum (legal opinion) yang akurat dan komprehensif.'],
                    ['kode_cpl' => 'CPL-C (Pencegahan & Mitigasi Risiko Bisnis)', 'deskripsi' => 'Mampu merancang strategi pencegahan perselisihan komersial dan menangani sengketa hubungan industrial secara profesional.'],
                ],
                'mata_kuliahs' => [
                    ['kode_mk' => '22HUK0363', 'nama_mk' => 'Hukum Dagang', 'sks' => 3, 'semester' => 5],
                    ['kode_mk' => '22HUK0412', 'nama_mk' => 'Hukum Perbankan', 'sks' => 2, 'semester' => 7],
                    ['kode_mk' => '22HUK2012', 'nama_mk' => 'Hukum Kepailitan dan Penundaan Pembayaran Hutang', 'sks' => 2, 'semester' => 6],
                    ['kode_mk' => '22HUK0402', 'nama_mk' => 'Hak Atas Kekayaan Intelektual (HAKI)', 'sks' => 2, 'semester' => 6],
                    ['kode_mk' => '22HUK0392', 'nama_mk' => 'Hukum Ketenagakerjaan', 'sks' => 2, 'semester' => 6],
                    ['kode_mk' => '22HUK0163', 'nama_mk' => 'Hukum Penyelesaian Perselisihan Hubungan Industrial', 'sks' => 3, 'semester' => 6],
                    ['kode_mk' => '22HUK0132', 'nama_mk' => 'Hukum Pajak', 'sks' => 2, 'semester' => 6],
                    ['kode_mk' => '22HUK0182', 'nama_mk' => 'Hukum Asuransi', 'sks' => 2, 'semester' => 7],
                    ['kode_mk' => '22HUK4012', 'nama_mk' => 'Hukum Surat Berharga', 'sks' => 2, 'semester' => 8],
                    ['kode_mk' => '22HUK0052', 'nama_mk' => 'Hukum Perlindungan Konsumen', 'sks' => 2, 'semester' => 3],
                ],
            ],
            [
                'urutan' => 4,
                'judul' => 'Aparatur Penegak Hukum Publik (Hakim, Jaksa, Penyidik)',
                'subjudul' => 'Profil Lulusan #4 • Penegakan Keadilan & Hukum Publik',
                'deskripsi' => 'Aparatur negara yang berwenang menegakkan hukum pidana dan peradilan umum, melakukan penyelidikan, penyidikan, penuntutan perkara, serta mengadili perkara demi tercapainya kepastian hukum dan rasa keadilan di tengah masyarakat.',
                'ringkasan_keterhubungan' => 'Sebagai Aparatur Penegak Hukum Publik (Hakim, Jaksa, Penyidik) (Poin 1), lulusan dituntut memiliki ketajaman analisis tindak pidana dan integritas yudisial tinggi (Poin 2). Mata Kuliah inti Hukum Pidana, Hukum Pembuktian, Pidana Khusus, Kriminologi, Anti Korupsi, dan Peradilan Semu Pidana secara terpadu membangun keahlian ini (Poin 3).',
                'cpls' => [
                    ['kode_cpl' => 'CPL-A (Integritas Yudisial & Keadilan)', 'deskripsi' => 'Menjunjung integritas aparatur penegak hukum yang bersih, bebas intervensi, adil, dan berorientasi pada kepastian hukum yang bermartabat.'],
                    ['kode_cpl' => 'CPL-B (Keahlian Investigasi & Pembuktian Yuridis)', 'deskripsi' => 'Mampu menguji alat bukti, mengonstruksikan fakta hukum perkara, dan menerapkan pasal-pasal pidana materiil secara objektif.'],
                    ['kode_cpl' => 'CPL-C (Penyusunan Berkas Perkara & Putusan)', 'deskripsi' => 'Mampu menyusun Berita Acara Pemeriksaan (BAP), surat dakwaan, surat tuntutan, dan pertimbangan putusan hukum yang bernalar logis.'],
                ],
                'mata_kuliahs' => [
                    ['kode_mk' => '22FHK0063', 'nama_mk' => 'Hukum Pidana', 'sks' => 3, 'semester' => 2],
                    ['kode_mk' => '22HUK0324', 'nama_mk' => 'Hukum Acara Pidana', 'sks' => 4, 'semester' => 4],
                    ['kode_mk' => '22HUK0112', 'nama_mk' => 'Hukum Pembuktian', 'sks' => 2, 'semester' => 5],
                    ['kode_mk' => '22HUK2022', 'nama_mk' => 'Hukum Pidana Khusus (Tipikor, Narkotika, dll)', 'sks' => 2, 'semester' => 6],
                    ['kode_mk' => '22HUK0142', 'nama_mk' => 'Kriminologi', 'sks' => 2, 'semester' => 6],
                    ['kode_mk' => '22HUK1023', 'nama_mk' => 'Penologi', 'sks' => 3, 'semester' => 5],
                    ['kode_mk' => '22HUK4022', 'nama_mk' => 'Victimologi', 'sks' => 2, 'semester' => 8],
                    ['kode_mk' => '22HUK0172', 'nama_mk' => 'Hukum Pidana Internasional', 'sks' => 2, 'semester' => 7],
                    ['kode_mk' => '22FHK0042', 'nama_mk' => 'Pendidikan Anti Korupsi', 'sks' => 2, 'semester' => 1],
                    ['kode_mk' => '22HUK3022', 'nama_mk' => 'Hukum Perlindungan Perempuan dan Anak', 'sks' => 2, 'semester' => 7],
                    ['kode_mk' => '22HUK0202', 'nama_mk' => 'PLKH Pidana (Peradilan Semu)', 'sks' => 2, 'semester' => 7],
                ],
            ],
            [
                'urutan' => 5,
                'judul' => 'Akademisi / Peneliti & Analis Kebijakan Hukum',
                'subjudul' => 'Profil Lulusan #5 • Riset Ilmiah & Kajian Hukum',
                'deskripsi' => 'Profesi yang mendedikasikan keahlian dalam riset hukum doktrinal maupun empiris (sosio-legal), menghasilkan naskah publikasi ilmiah, serta merumuskan rekomendasi pembaruan hukum nasional dan kebijakan publik.',
                'ringkasan_keterhubungan' => 'Sebagai Akademisi / Peneliti & Analis Kebijakan Hukum (Poin 1), lulusan dipersiapkan dengan kemampuan berpikir filosofis, kritis, dan metodologis (Poin 2). Mata Kuliah Metode Penelitian Hukum, Filsafat Hukum, Sosiologi Hukum, Politik Hukum, dan Skripsi menjadi fondasi utama dalam menghasilkan riset hukum berkualitas (Poin 3).',
                'cpls' => [
                    ['kode_cpl' => 'CPL-A (Penguasaan Teori & Filsafat Hukum)', 'deskripsi' => 'Menguasai secara komparatif aliran-aliran filsafat hukum, teori keadilan, sosiologi hukum, dan politik hukum nasional.'],
                    ['kode_cpl' => 'CPL-B (Keahlian Metodologi Penelitian Hukum)', 'deskripsi' => 'Mampu merancang dan melaksanakan riset hukum dengan metodologi ilmiah yang valid, kritis, dan berstandar akademik tinggi.'],
                    ['kode_cpl' => 'CPL-C (Publikasi Ilmiah & Policy Brief)', 'deskripsi' => 'Mampu menulis artikel ilmiah bereputasi serta merumuskan policy brief untuk penyempurnaan sistem hukum nasional.'],
                ],
                'mata_kuliahs' => [
                    ['kode_mk' => '22HUK0023', 'nama_mk' => 'Metode Penelitian dan Penulisan Hukum', 'sks' => 3, 'semester' => 5],
                    ['kode_mk' => '22FHK0112', 'nama_mk' => 'Filsafat Hukum', 'sks' => 2, 'semester' => 8],
                    ['kode_mk' => '22FHK0014', 'nama_mk' => 'Pengantar Ilmu Hukum', 'sks' => 4, 'semester' => 1],
                    ['kode_mk' => '22HUK0232', 'nama_mk' => 'Sosiologi Hukum', 'sks' => 2, 'semester' => 1],
                    ['kode_mk' => '22HUK0252', 'nama_mk' => 'Politik Hukum', 'sks' => 2, 'semester' => 2],
                    ['kode_mk' => '22HUK0382', 'nama_mk' => 'Perbandingan Hukum', 'sks' => 2, 'semester' => 6],
                    ['kode_mk' => '22HUK5016', 'nama_mk' => 'Skripsi (Tugas Akhir Mandiri)', 'sks' => 6, 'semester' => 8],
                ],
            ],
        ];

        foreach ($dataProfil as $item) {
            $profil = KurikulumProfil::firstOrCreate(
                ['judul' => $item['judul']],
                [
                    'subjudul' => $item['subjudul'],
                    'deskripsi' => $item['deskripsi'],
                    'ringkasan_keterhubungan' => $item['ringkasan_keterhubungan'],
                    'urutan' => $item['urutan'],
                ]
            );

            if ($profil->cpls()->count() === 0) {
                foreach ($item['cpls'] as $idx => $cpl) {
                    $profil->cpls()->create([
                        'kode_cpl' => $cpl['kode_cpl'],
                        'deskripsi' => $cpl['deskripsi'],
                        'urutan' => $idx + 1,
                    ]);
                }
            }

            if ($profil->mataKuliahs()->count() === 0) {
                foreach ($item['mata_kuliahs'] as $idx => $mk) {
                    $profil->mataKuliahs()->create([
                        'kode_mk' => $mk['kode_mk'],
                        'nama_mk' => $mk['nama_mk'],
                        'sks' => $mk['sks'],
                        'semester' => $mk['semester'],
                        'urutan' => $idx + 1,
                    ]);
                }
            }
        }
    }
}