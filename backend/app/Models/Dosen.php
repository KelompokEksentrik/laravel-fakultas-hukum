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

        // 2. Hapus gelar depan (termasuk variasi kurung seperti Dr (C)., Dr. (Cand)., Prof. (Hc)., Assoc., dll.)
        $polaGelarDepan = '/^(?:' .
            '(?:assoc|prof|dr|drs|dra|ir|kh|ust|ustadz|raden|rm|tb|h|hj)\.?\s*(?:\([^)]+\)\.?\s*)?' .
            '|\([^)]+\)\.?\s*' .
        ')+/i';

        $hasil = trim($tanpaGelarBelakang);
        $hasil = preg_replace($polaGelarDepan, '', $hasil);

        // 3. Bersihkan spasi ganda & tanda baca di ujung, lalu ubah ke huruf kecil
        $hasil = preg_replace('/\s+/', ' ', (string) $hasil);
        $hasilBersih = trim((string) $hasil, " \t\n\r\0\x0B.,()-");

        return mb_strtolower($hasilBersih !== '' ? $hasilBersih : $namaLengkap, 'UTF-8');
    }
}