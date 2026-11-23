import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '../service/api';

export interface Pengguna {
    id: number;
    nama: string;
    email: string;
}   

interface NilaiKonteksAutentikasi {
    pengguna: Pengguna | null;
    sudahMasuk: boolean;
    memuat: boolean;
    masuk: (email: string, password: string) => Promise<void>;
    keluar: () => Promise<void>;
}

const KonteksAutentikasi = createContext<NilaiKonteksAutentikasi | undefined>(undefined);

export function PenyediaAutentikasi({ children }: { children: ReactNode }) {
    const [pengguna, setPengguna] = useState<Pengguna | null>(() => {
        const tersimpan = localStorage.getItem('pengguna_fh');
        return tersimpan ? (JSON.parse(tersimpan) as Pengguna) : null;
    });
    const [memuat, setMemuat] = useState<boolean>(true);

    useEffect(() => {
        const cekProfil = async () => {
            const token = localStorage.getItem('token_fh');
            if (!token) {
                setMemuat(false);
                return;
            }

            try {
                const res = await api.get('/profil');
                setPengguna(res.data.pengguna);
                localStorage.setItem('pengguna_fh', JSON.stringify(res.data.pengguna));
            } catch {
                localStorage.removeItem('token_fh');
                localStorage.removeItem('pengguna_fh');
                setPengguna(null);
            } finally {
                setMemuat(false);
            }
        };

        void cekProfil();
    }, []);

    const masuk = async (email: string, password: string) => {
        const res = await api.post('/masuk', { email, password });
        const { token, pengguna: dataPengguna } = res.data;

        localStorage.setItem('token_fh', token);
        localStorage.setItem('pengguna_fh', JSON.stringify(dataPengguna));
        setPengguna(dataPengguna);
    };

    const keluar = async () => {
        try {
            await api.post('/keluar');
        } catch {
            // Tetap bersihkan sesi lokal meskipun token sudah tidak berlaku di server
        } finally {
            localStorage.removeItem('token_fh');
            localStorage.removeItem('pengguna_fh');
            setPengguna(null);
        }
    };

    return (
        <KonteksAutentikasi.Provider
            value={{
                pengguna,
                sudahMasuk: Boolean(pengguna),
                memuat,
                masuk,
                keluar,
            }}
        >
            {children}
        </KonteksAutentikasi.Provider>
    );
}

export function gunakanAutentikasi() {
    const konteks = useContext(KonteksAutentikasi);
    if (!konteks) {
        throw new Error('gunakanAutentikasi harus dipakai di dalam PenyediaAutentikasi');
    }
    return konteks;
}