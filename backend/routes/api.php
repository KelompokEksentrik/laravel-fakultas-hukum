<?php

use App\Http\Controllers\Api\AutentikasiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/masuk', [AutentikasiController::class, 'masuk']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profil', [AutentikasiController::class, 'profil']);
        Route::post('/keluar', [AutentikasiController::class, 'keluar']);
    });
});