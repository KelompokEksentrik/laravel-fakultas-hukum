<?php

use App\Http\Controllers\Api\AutentikasiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DosenController;
use App\Http\Controllers\Api\KurikulumController;

Route::prefix('v1')->group(function () {
    Route::post('/masuk', [AutentikasiController::class, 'masuk']);

    Route::get('/publik/dosen', [DosenController::class, 'publik']);
    Route::get('/publik/kurikulum-peta', [KurikulumController::class, 'publik']);


    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profil', [AutentikasiController::class, 'profil']);
        Route::post('/keluar', [AutentikasiController::class, 'keluar']);
        Route::post('/dosen-sinkron-sort', [DosenController::class, 'sinkronSort']);
    
    // Manajemen Dosen
        Route::get('/dosen', [DosenController::class, 'index']);
        Route::post('/dosen', [DosenController::class, 'store']);
        Route::post('/dosen/{id}', [DosenController::class, 'update']); // pakai POST agar support multipart upload foto
        Route::delete('/dosen/{id}', [DosenController::class, 'destroy']);
        Route::post('/dosen-import', [DosenController::class, 'importCsv']);
    

    //Kurikulum
    Route::get('/kurikulum-peta', [KurikulumController::class, 'index']);
    Route::post('/kurikulum-peta', [KurikulumController::class, 'storeProfil']);
    Route::post('/kurikulum-peta/{id}', [KurikulumController::class, 'updateProfil']);
    Route::delete('/kurikulum-peta/{id}', [KurikulumController::class, 'destroyProfil']);
    Route::post('/kurikulum-peta/{id}/cpl', [KurikulumController::class, 'storeCpl']);
    Route::post('/kurikulum-peta/{id}/cpl/{cplId}', [KurikulumController::class, 'updateCpl']);
    Route::delete('/kurikulum-peta/{id}/cpl/{cplId}', [KurikulumController::class, 'destroyCpl']);
    Route::post('/kurikulum-peta/{id}/mata-kuliah', [KurikulumController::class, 'storeMataKuliah']);
    Route::post('/kurikulum-peta/{id}/mata-kuliah/{mkId}', [KurikulumController::class, 'updateMataKuliah']);
    Route::delete('/kurikulum-peta/{id}/mata-kuliah/{mkId}', [KurikulumController::class, 'destroyMataKuliah']);
    Route::post('/kurikulum-peta/seed-default', [KurikulumController::class, 'seedDefault']);
    });
});