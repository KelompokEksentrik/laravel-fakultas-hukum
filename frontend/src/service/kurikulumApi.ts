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
    "https://fakultas-hukum-unpam.onrender.com";

const getAdminHeaders = (): HeadersInit => {
    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        "token_fh";

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
        const res = await fetch(`${API_BASE}/api/v1/kurikulum`, {
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
        const res = await fetch(`${API_BASE}/api/v1/kurikulum/${id}`, {
            method: "PUT",
            headers: getAdminHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal memperbarui profil lulusan.");
        const json = await res.json();
        return json.data;
    },

    async deleteProfil(id: number): Promise<void> {
        const res = await fetch(`${API_BASE}/api/v1/kurikulum/${id}`, {
            method: "DELETE",
            headers: getAdminHeaders(),
        });
        if (!res.ok) throw new Error("Gagal menghapus profil lulusan.");
    },

    async createCpl(
        profilId: number,
        payload: { kode_cpl: string; deskripsi: string; urutan?: number }
    ): Promise<KurikulumCpl> {
        const res = await fetch(`${API_BASE}/api/v1/kurikulum/${profilId}/cpl`, {
            method: "POST",
            headers: getAdminHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal menambah CPL.");
        const json = await res.json();
        return json.data;
    },

    async updateCpl(
        cplId: number,
        payload: { kode_cpl: string; deskripsi: string; urutan?: number }
    ): Promise<KurikulumCpl> {
        const res = await fetch(`${API_BASE}/api/v1/kurikulum/cpl/${cplId}`, {
            method: "PUT",
            headers: getAdminHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal memperbarui CPL.");
        const json = await res.json();
        return json.data;
    },

    async deleteCpl(cplId: number): Promise<void> {
        const res = await fetch(`${API_BASE}/api/v1/kurikulum/cpl/${cplId}`, {
            method: "DELETE",
            headers: getAdminHeaders(),
        });
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
            `${API_BASE}/api/v1/kurikulum/${profilId}/mata-kuliah`,
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
            `${API_BASE}/api/v1/kurikulum/mata-kuliah/${mkId}`,
            {
                method: "PUT",
                headers: getAdminHeaders(),
                body: JSON.stringify(payload),
            }
        );
        if (!res.ok) throw new Error("Gagal memperbarui mata kuliah.");
        const json = await res.json();
        return json.data;
    },

    async deleteMataKuliah(mkId: number): Promise<void> {
        const res = await fetch(
            `${API_BASE}/api/v1/kurikulum/mata-kuliah/${mkId}`,
            {
                method: "DELETE",
                headers: getAdminHeaders(),
            }
        );
        if (!res.ok) throw new Error("Gagal menghapus mata kuliah.");
    },
};