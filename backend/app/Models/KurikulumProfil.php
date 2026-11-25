<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KurikulumProfil extends Model
{
    protected $table = 'kurikulum_profils';

    protected $fillable = [
        'judul',
        'subjudul',
        'deskripsi',
        'ringkasan_keterhubungan',
        'urutan',
    ];

    public function cpls(): HasMany
    {
        return $this->hasMany(KurikulumCpl::class, 'kurikulum_profil_id')
            ->orderBy('urutan', 'asc')
            ->orderBy('id', 'asc');
    }

    public function mataKuliahs(): HasMany
    {
        return $this->hasMany(KurikulumMataKuliah::class, 'kurikulum_profil_id')
            ->orderBy('urutan', 'asc')
            ->orderBy('id', 'asc');
    }
}