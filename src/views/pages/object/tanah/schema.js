import { z } from 'zod';

export const storeSchema = z.object({
    judul_penilaian: z.string().max(255).optional().nullable(),
    nama_entitas: z.string().max(255).optional().nullable(),
    // tanggal_inspeksi: z.string().datetime({ offset: true }).optional().nullable(), // tipe date, di-format ISO string
    // tanggal_penilaian: z.string().datetime({ offset: true }).optional().nullable(),
    penilai_surveyor: z.string().max(255).optional().nullable(),
    // foto_foto: z.string().optional().nullable(), // text
    batas_utara: z.string().max(255).optional().nullable(),
    batas_selatan: z.string().max(255).optional().nullable(),
    batas_timur: z.string().max(255).optional().nullable(),
    batas_barat: z.string().max(255).optional().nullable(),
    jenis_aset: z.string().max(255).optional().nullable(),
    alamat_aset: z.string().optional().nullable(), // text
    koordinat: z.string().max(100).optional().nullable(),
    hak_kepemilikan: z.string().max(255).optional().nullable(),
    // luas_tanah_m2: z.number().optional().nullable(),
    // row_jalan_m: z.number().optional().nullable(),
    // perkerasan_jalan: z.string().max(100).optional().nullable(),
    // posisi_aset: z.string().max(100).optional().nullable(),
    // bentuk_tanah: z.string().max(100).optional().nullable(),
    // lebar_muka_m: z.number().optional().nullable(),
    // elevasi_terhadap_jalan_m: z.number().optional().nullable(),
    // topografi: z.string().max(100).optional().nullable(),
    // orientasi: z.string().max(100).optional().nullable(),
    // peruntukan: z.string().max(100).optional().nullable(),
    jarak_terhadap_pusat_kota: z.string().max(255).optional().nullable(),
    aksesibilitas_lokasi: z.string().optional().nullable(), // text
    kondisi_lingkungan: z.string().optional().nullable(), // text
    kabupaten: z.string().max(255).optional().nullable(),
});
