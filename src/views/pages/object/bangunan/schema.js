import { z } from 'zod';

export const storeSchema = z.object({
    nama_bangunan: z.string().min(1, 'Nama Bangunan wajib diisi'),
    // foto_depan: z.union([z.instanceof(File), z.null()]).optional(),
    // foto_sisi_kiri: z.union([z.instanceof(File), z.null()]).optional(),
    // foto_sisi_kanan: z.union([z.instanceof(File), z.null()]).optional(),

    judul_foto: z.string().optional().nullable(),
    foto_lainnya: z.array(z.any()).optional().nullable(), // no deep validation for JSON here
    bentuk_bangunan: z.string().optional().nullable(),
    grade_gudang: z.string().optional().nullable(),
    jumlah_lantai: z.number().int().min(0).optional().nullable(),
    basement: z.number().int().min(0).optional().nullable(),
    konstruksi_bangunan: z.string().optional().nullable(),
    konstruksi_lantai: z.string().optional().nullable(),
    konstruksi_dinding: z.string().optional().nullable(),
    konstruksi_atap: z.string().optional().nullable(),
    konstruksi_pondasi: z.string().optional().nullable(),
    versi_btb: z.number().int().optional().nullable(),
    tipe_spek: z.number().int().optional().nullable(),
    canvas_data: z.any().optional().nullable(),
    jenis_bangunan: z.string().optional().nullable(),
    jenis_bangunan_detail: z.string().optional().nullable(),
    jenis_bangunan_indeks_lantai: z.string().optional().nullable(),
    // tahun_dibangun: z.number().int().min(1800).max(currentYear).optional().nullable(),
    keterangan_tahun_dibangun: z.string().optional().nullable(),
    // tahun_renovasi: z.number().int().min(1800).max(currentYear).optional().nullable(),
    keterangan_tahun_direnovasi: z.string().optional().nullable(),
    jenis_renovasi: z.string().optional().nullable(),
    bobot_renovasi: z.number().int().optional().nullable(),
    kondisi_visual: z.string().optional().nullable(),
    catatan_khusus: z.string().optional().nullable(),
    luas_bangunan_terpotong: z
        .string()
        .regex(/^-?\d+(\.\d+)?$/, 'Harus berupa angka desimal')
        .optional()
        .nullable(),

    luas_bangunan_imb: z.string()
        .regex(/^-?\d+(\.\d+)?$/, 'Harus berupa angka desimal')
        .optional()
        .nullable(),
    luas_nama_pintu_jendela: z.any().optional().nullable(),
    luas_bobot_pintu_jendela: z.any().optional().nullable(),
    luas_nama_dinding: z.any().optional().nullable(),
    luas_bobot_dinding: z.any().optional().nullable(),
    luas_nama_rangka_atap_datar: z.any().optional().nullable(),
    luas_bobot_rangka_atap_datar: z.any().optional().nullable(),
    luas_nama_atap_datar: z.any().optional().nullable(),
    luas_bobot_atap_datar: z.any().optional().nullable(),
    tipe_pondasi_existing: z.any().optional().nullable(),
    bobot_tipe_pondasi_existing: z.any().optional().nullable(),
    tipe_struktur_existing: z.any().optional().nullable(),
    bobot_tipe_struktur_existing: z.any().optional().nullable(),
    tipe_rangka_atap_existing: z.any().optional().nullable(),
    bobot_rangka_atap_existing: z.any().optional().nullable(),
    tipe_penutup_atap_existing: z.any().optional().nullable(),
    bobot_penutup_atap_existing: z.any().optional().nullable(),
    tipe_tipe_dinding_existing: z.any().optional().nullable(),
    bobot_tipe_dinding_existing: z.any().optional().nullable(),
    tipe_tipe_pelapis_dinding_existing: z.any().optional().nullable(),
    bobot_tipe_pelapis_dinding_existing: z.any().optional().nullable(),
    tahun_pemakaian_pondasi: z.number().int().optional().nullable(),
    tahun_pemakaian_struktur: z.number().int().optional().nullable(),
    tahun_pemakaian_rangka_atap: z.number().int().optional().nullable(),
    tahun_pemakaian_penutup_atap: z.number().int().optional().nullable(),
    bobot_tahun_pemakaian_pondasi: z.number().optional().nullable(),
    bobot_tahun_pemakaian_struktur: z.number().optional().nullable(),
    bobot_tahun_pemakaian_rangka_atap: z.number().optional().nullable(),
    bobot_tahun_pemakaian_penutup_atap: z.number().optional().nullable(),
    bobot_bangunan: z.number().optional().nullable(),
    status_data: z.enum(['draft', 'publish']),
});
