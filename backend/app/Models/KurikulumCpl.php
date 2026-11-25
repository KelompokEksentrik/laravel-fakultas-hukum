<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KurikulumCpl extends Model
{
    protected $table = 'kurikulum_cpls';

    protected $fillable = [
        'kurikulum_profil_id',
        'kode_cpl',
        'deskripsi',
        'urutan',
    ];

    public function profil(): BelongsTo
    {
        return $this->belongsTo(KurikulumProfil::class, 'kurikulum_profil_id');
    }
}