<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kurikulum_profils', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('subjudul')->nullable();
            $table->text('deskripsi');
            $table->text('ringkasan_keterhubungan');
            $table->unsignedInteger('urutan')->default(0);
            $table->timestamps();
        });

        Schema::create('kurikulum_cpls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kurikulum_profil_id')
                ->constrained('kurikulum_profils')
                ->cascadeOnDelete();
            $table->string('kode_cpl');
            $table->text('deskripsi');
            $table->unsignedInteger('urutan')->default(0);
            $table->timestamps();
        });

        Schema::create('kurikulum_mata_kuliahs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kurikulum_profil_id')
                ->constrained('kurikulum_profils')
                ->cascadeOnDelete();
            $table->string('kode_mk', 50);
            $table->string('nama_mk');
            $table->unsignedTinyInteger('sks')->default(2);
            $table->unsignedTinyInteger('semester')->default(1);
            $table->unsignedInteger('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kurikulum_mata_kuliahs');
        Schema::dropIfExists('kurikulum_cpls');
        Schema::dropIfExists('kurikulum_profils');
    }
};