import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { gunakanAutentikasi } from '../../konteks/KonteksAutentikasi';

export default function HalamanMasuk() {
    const { masuk } = gunakanAutentikasi();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pesanError, setPesanError] = useState<string | null>(null);
    const [sedangProses, setSedangProses] = useState(false);

    const tanganiSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setPesanError(null);
        setSedangProses(true);

        try {
            await masuk(email, password);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setPesanError(
                    err.response?.data?.pesan || 'Gagal masuk. Periksa kembali email dan kata sandi.'
                );
            } else {
                setPesanError('Terjadi kesalahan tak terduga.');
            }
        } finally {
            setSedangProses(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex flex-col items-center text-center mb-7">
                    <div className="w-12 h-12 rounded-xl bg-amber-950 text-amber-300 flex items-center justify-center mb-3">
                        <Scale className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">Dashboard Fakultas Hukum</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Masuk untuk mengelola Dosen, Kurikulum, dan Kalender Akademik
                    </p>
                </div>

                {pesanError && (
                    <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-200 p-3.5 text-sm text-red-700">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{pesanError}</span>
                    </div>
                )}

                <form onSubmit={tanganiSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Alamat Email
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@fh.ac.id"
                                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={sedangProses}
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-950 hover:bg-amber-900 disabled:opacity-60 text-white font-medium py-2.5 px-4 text-sm transition-colors cursor-pointer"
                    >
                        {sedangProses && <Loader2 className="w-4 h-4 animate-spin" />}
                        {sedangProses ? 'Memproses...' : 'Masuk ke Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}