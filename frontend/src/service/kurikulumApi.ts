export interface KurikulumCpl {
    id: number;
    kurikulum_profil_id: number;
    kode_cpl: string;
    deskripsi: string;
    urutan: number;
}

export interface KurikulumMataKuliah {
    id: number;
    kurikulum_profil_id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
    semester: number;
    urutan: number;
}

export interface KurikulumProfil {
    id: number;
    judul: string;
    subjudul: string | null;
    deskripsi: string;
    ringkasan_keterhubungan: string;
    urutan: number;
    total_sks_terkait?: number;
    cpls: KurikulumCpl[];
    mata_kuliahs: KurikulumMataKuliah[];
}

export interface KurikulumPublikResponse {
    data: KurikulumProfil[];
    ringkasan: {
        jumlah_profil: number;
        label_capaian: string;
        total_sks_kurikulum: number;
        total_cpl_item: number;
        total_mk_terpetakan: number;
    };
}

const API_BASE =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
    "https://laravel-fakultas-hukum.onrender.com";

const getAdminHeaders = (): HeadersInit => {
    const token =
        localStorage.getItem("token_fh") ||
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        "";

    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const kurikulumApi = {
    async getPublik(search = ""): Promise<KurikulumPublikResponse> {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        const query = params.toString() ? `?${params.toString()}` : "";

        const res = await fetch(`${API_BASE}/api/v1/publik/kurikulum-peta${query}`, {
            headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Gagal memuat data peta kurikulum publik.");
        return res.json();
    },

    async getAdminList(): Promise<KurikulumProfil[]> {
        const res = await fetch(`${API_BASE}/api/v1/kurikulum-peta`, {
            headers: getAdminHeaders(),
        });
        if (!res.ok) throw new Error("Gagal memuat data kurikulum admin.");
        const json = await res.json();
        return json.data || [];
    },

    async seedDefault(): Promise<KurikulumProfil[]> {
        const res = await fetch(`${API_BASE}/api/v1/kurikulum-peta/seed-default`, {
            method: "POST",
            headers: getAdminHeaders(),
        });
        if (!res.ok) throw new Error("Gagal memuat data default OBE.");
        const json = await res.json();
        return json.data || [];
    },

    async createProfil(payload: {
        judul: string;
        subjudul?: string;
        deskripsi: string;
        ringkasan_keterhubungan: string;
        urutan?: number;
    }): Promise<KurikulumProfil> {
        const res = await fetch(`${API_BASE}/api/v1/kurikulum-peta`, {
            method: "POST",
            headers: getAdminHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal menambah profil lulusan.");
        const json = await res.json();
        return json.data;
    },

    async updateProfil(
        id: number,
        payload: {
            judul: string;
            subjudul?: string;
            deskripsi: string;
            ringkasan_keterhubungan: string;
            urutan?: number;
        }
    ): Promise<KurikulumProfil> {
        const res = await fetch(`${API_BASE}/api/v1/kurikulum-peta/${id}`, {
            method: "POST",
            headers: getAdminHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal memperbarui profil lulusan.");
        const json = await res.json();
        return json.data;
    },

    async deleteProfil(id: number): Promise<void> {
        const res = await fetch(`${API_BASE}/api/v1/kurikulum-peta/${id}`, {
            method: "DELETE",
            headers: getAdminHeaders(),
        });
        if (!res.ok) throw new Error("Gagal menghapus profil lulusan.");
    },

    async createCpl(
        profilId: number,
        payload: { kode_cpl: string; deskripsi: string; urutan?: number }
    ): Promise<KurikulumCpl> {
        const res = await fetch(`${API_BASE}/api/v1/kurikulum-peta/${profilId}/cpl`, {
            method: "POST",
            headers: getAdminHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal menambah CPL.");
        const json = await res.json();
        return json.data;
    },

    async updateCpl(
        profilId: number,
        cplId: number,
        payload: { kode_cpl: string; deskripsi: string; urutan?: number }
    ): Promise<KurikulumCpl> {
        const res = await fetch(
            `${API_BASE}/api/v1/kurikulum-peta/${profilId}/cpl/${cplId}`,
            {
                method: "POST",
                headers: getAdminHeaders(),
                body: JSON.stringify(payload),
            }
        );
        if (!res.ok) throw new Error("Gagal memperbarui CPL.");
        const json = await res.json();
        return json.data;
    },

    async deleteCpl(profilId: number, cplId: number): Promise<void> {
        const res = await fetch(
            `${API_BASE}/api/v1/kurikulum-peta/${profilId}/cpl/${cplId}`,
            {
                method: "DELETE",
                headers: getAdminHeaders(),
            }
        );
        if (!res.ok) throw new Error("Gagal menghapus CPL.");
    },

    async createMataKuliah(
        profilId: number,
        payload: {
            kode_mk: string;
            nama_mk: string;
            sks: number;
            semester: number;
            urutan?: number;
        }
    ): Promise<KurikulumMataKuliah> {
        const res = await fetch(
            `${API_BASE}/api/v1/kurikulum-peta/${profilId}/mata-kuliah`,
            {
                method: "POST",
                headers: getAdminHeaders(),
                body: JSON.stringify(payload),
            }
        );
        if (!res.ok) throw new Error("Gagal menambah mata kuliah.");
        const json = await res.json();
        return json.data;
    },

    async updateMataKuliah(
        profilId: number,
        mkId: number,
        payload: {
            kode_mk: string;
            nama_mk: string;
            sks: number;
            semester: number;
            urutan?: number;
        }
    ): Promise<KurikulumMataKuliah> {
        const res = await fetch(
            `${API_BASE}/api/v1/kurikulum-peta/${profilId}/mata-kuliah/${mkId}`,
            {
                method: "POST",
                headers: getAdminHeaders(),
                body: JSON.stringify(payload),
            }
        );
        if (!res.ok) throw new Error("Gagal memperbarui mata kuliah.");
        const json = await res.json();
        return json.data;
    },

    async deleteMataKuliah(profilId: number, mkId: number): Promise<void> {
        const res = await fetch(
            `${API_BASE}/api/v1/kurikulum-peta/${profilId}/mata-kuliah/${mkId}`,
            {
                method: "DELETE",
                headers: getAdminHeaders(),
            }
        );
        if (!res.ok) throw new Error("Gagal menghapus mata kuliah.");
    },
};