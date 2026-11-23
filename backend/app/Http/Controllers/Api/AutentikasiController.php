<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AutentikasiController extends Controller
{
    public function masuk(Request $request): JsonResponse
    {
        $validasi = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $pengguna = User::where('email', $validasi['email'])->first();

        if (! $pengguna || ! Hash::check($validasi['password'], $pengguna->password)) {
            return response()->json([
                'pesan' => 'Email atau kata sandi tidak sesuai.',
            ], 401);
        }

        $pengguna->tokens()->delete();

        $token = $pengguna->createToken('token-dashboard-fh')->plainTextToken;

        return response()->json([
            'pesan' => 'Berhasil masuk.',
            'token' => $token,
            'pengguna' => [
                'id' => $pengguna->id,
                'nama' => $pengguna->name,
                'email' => $pengguna->email,
            ],
        ]);
    }

    public function profil(Request $request): JsonResponse
    {
        $pengguna = $request->user();

        return response()->json([
            'pengguna' => [
                'id' => $pengguna->id,
                'nama' => $pengguna->name,
                'email' => $pengguna->email,
            ],
        ]);
    }

    public function keluar(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'pesan' => 'Berhasil keluar.',
        ]);
    }
}