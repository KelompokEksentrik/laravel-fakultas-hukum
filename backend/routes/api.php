<?php

use App\Http\Controllers\Api\AutentikasiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DosenController;

Route::prefix('v1')->group(function () {
    Route::post('/masuk', [AutentikasiController::class, 'masuk']);

    Route::get('/publik/dosen', [DosenController::class, 'publik']);


    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profil', [AutentikasiController::class, 'profil']);
        Route::post('/keluar', [AutentikasiController::class, 'keluar']);
    
    // Manajemen Dosen
        Route::get('/dosen', [DosenController::class, 'index']);
        Route::post('/dosen', [DosenController::class, 'store']);
        Route::post('/dosen/{id}', [DosenController::class, 'update']); // pakai POST agar support multipart upload foto
        Route::delete('/dosen/{id}', [DosenController::class, 'destroy']);
        Route::post('/dosen-import', [DosenController::class, 'importCsv']);
    
    });
});