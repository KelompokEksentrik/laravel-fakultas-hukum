<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dosen extends Model
{
    protected $table = 'dosens';

    protected $fillable = [
        'nama',
        'nama_sort',
        'nidn_nuptk',
        'kepakaran',
        'foto_url',
        'link_scholar',
        'link_sinta',
        'link_pddikti',
        'link_scopus',
        'urutan',
    ];

protected static function booted(): void
    {
        static::saving(function (Dosen $dosen) {
            if ($dosen->isDirty('nama') || empty($dosen->nama_sort)) {
                $dosen->nama_sort = self::buatNamaSort((string) $dosen->nama);
            }
        });
    }

    public static function buatNamaSort(string $namaLengkap): string
    {
        // 1. Potong gelar belakang setelah koma pertama (misal: ", S.H., M.H.")
        $tanpaGelarBelakang = explode(',', $namaLengkap)[0];

        // 2. Hapus gelar depan berulang (Assoc., Prof., Dr., dr., Dr (C)., H., Hj., Ir., Drs., Dra., dll.)
        $polaGelarDepan = '/^(?:assoc\.?|prof\.?|dr\.?|drs\.?|dra\.?|ir\.?|h\.?|hj\.?|kh\.?|ust\.?|ustadz\.?|raden\.?|rm\.?|tb\.?|dr\s*\(c\)\.?|prof\s*\(emeritus\)\.?)\s+/i';

        $hasil = trim($tanpaGelarBelakang);
        while (preg_match($polaGelarDepan, $hasil)) {
            $hasil = preg_replace($polaGelarDepan, '', $hasil);
            $hasil = trim((string) $hasil);
        }

        // 3. Bersihkan spasi ganda, tanda baca ujung, lalu lowercase untuk sorting A-Z
        $hasil = preg_replace('/\s+/', ' ', $hasil);
        $hasilBersih = trim((string) $hasil, " \t\n\r\0\x0B.,");

        return mb_strtolower($hasilBersih !== '' ? $hasilBersih : $namaLengkap, 'UTF-8');
    }
}