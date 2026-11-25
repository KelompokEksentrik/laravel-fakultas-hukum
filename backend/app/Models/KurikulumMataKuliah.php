<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KurikulumMataKuliah extends Model
{
    protected $table = 'kurikulum_mata_kuliahs';

    protected $fillable = [
        'kurikulum_profil_id',
        'kode_mk',
        'nama_mk',
        'sks',
        'semester',
        'urutan',
    ];

    public function profil(): BelongsTo
    {
        return $this->belongsTo(KurikulumProfil::class, 'kurikulum_profil_id');
    }
}