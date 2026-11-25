<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dosens', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('nidn_nuptk')->nullable();
            $table->text('kepakaran')->nullable();
            $table->text('foto_url')->nullable();
            $table->text('link_scholar')->nullable();
            $table->text('link_sinta')->nullable();
            $table->text('link_pddikti')->nullable();
            $table->text('link_scopus')->nullable();
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dosens');
    }
};  