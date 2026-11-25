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
}