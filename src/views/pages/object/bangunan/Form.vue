<script setup>
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import swal from 'sweetalert2';
import { onBeforeMount, ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';

import { storeSchema } from './schema.js';

const router = useRouter();
const route = useRoute();
const jsonFields = [
    {
        key: 'luas_nama_pintu_jendela',
        label: 'Luas Nama Pintu Jendela',
        options: [
            { id: 1, name: 'Kaca Geser' },
            { id: 2, name: 'Kayu Solid' }
        ]
    },
    {
        key: 'luas_bobot_pintu_jendela',
        label: 'Luas Bobot Pintu Jendela',
        options: [
            { id: 1, name: 'Ringan' },
            { id: 2, name: 'Sedang' },
            { id: 3, name: 'Berat' }
        ]
    },
    {
        key: 'luas_nama_dinding',
        label: 'Luas Nama Dinding',
        options: [
            { id: 1, name: 'Bata Merah' },
            { id: 2, name: 'Batako' }
        ]
    },
    {
        key: 'luas_bobot_dinding',
        label: 'Luas Bobot Dinding',
        options: [
            { id: 1, name: 'Tipis' },
            { id: 2, name: 'Tebal' }
        ]
    },
    {
        key: 'luas_nama_rangka_atap_datar',
        label: 'Luas Nama Rangka Atap Datar',
        options: [
            { id: 1, name: 'Besi Hollow' },
            { id: 2, name: 'Kayu Jati' }
        ]
    },
    {
        key: 'luas_bobot_rangka_atap_datar',
        label: 'Luas Bobot Rangka Atap Datar',
        options: [
            { id: 1, name: 'Ringan' },
            { id: 2, name: 'Sedang' },
            { id: 3, name: 'Berat' }
        ]
    },
    {
        key: 'luas_nama_atap_datar',
        label: 'Luas Nama Atap Datar',
        options: [
            { id: 1, name: 'Galvalum' },
            { id: 2, name: 'Dak Beton' }
        ]
    },
    {
        key: 'luas_bobot_atap_datar',
        label: 'Luas Bobot Atap Datar',
        options: [
            { id: 1, name: 'Ringan' },
            { id: 2, name: 'Berat' }
        ]
    },
    {
        key: 'tipe_pondasi_existing',
        label: 'Tipe Pondasi Existing',
        options: [
            { id: 1, name: 'Batu Kali' },
            { id: 2, name: 'Pancang Beton' }
        ]
    },
    {
        key: 'bobot_tipe_pondasi_existing',
        label: 'Bobot Tipe Pondasi Existing',
        options: [
            { id: 1, name: 'Rendah' },
            { id: 2, name: 'Tinggi' }
        ]
    },
    {
        key: 'tipe_struktur_existing',
        label: 'Tipe Struktur Existing',
        options: [
            { id: 1, name: 'Beton Bertulang' },
            { id: 2, name: 'Baja Ringan' }
        ]
    },
    {
        key: 'bobot_tipe_struktur_existing',
        label: 'Bobot Tipe Struktur Existing',
        options: [
            { id: 1, name: 'Kuat' },
            { id: 2, name: 'Sedang' }
        ]
    },
    {
        key: 'tipe_rangka_atap_existing',
        label: 'Tipe Rangka Atap Existing',
        options: [
            { id: 1, name: 'Kayu' },
            { id: 2, name: 'Besi Hollow' }
        ]
    },
    {
        key: 'bobot_rangka_atap_existing',
        label: 'Bobot Rangka Atap Existing',
        options: [
            { id: 1, name: 'Ringan' },
            { id: 2, name: 'Sedang' }
        ]
    },
    {
        key: 'tipe_penutup_atap_existing',
        label: 'Tipe Penutup Atap Existing',
        options: [
            { id: 1, name: 'Genteng' },
            { id: 2, name: 'Asbes' }
        ]
    },
    {
        key: 'bobot_penutup_atap_existing',
        label: 'Bobot Penutup Atap Existing',
        options: [
            { id: 1, name: 'Sedang' },
            { id: 2, name: 'Berat' }
        ]
    },
    {
        key: 'tipe_tipe_dinding_existing',
        label: 'Tipe Tipe Dinding Existing',
        options: [
            { id: 1, name: 'Hebel' },
            { id: 2, name: 'Gypsum' }
        ]
    },
    {
        key: 'bobot_tipe_dinding_existing',
        label: 'Bobot Tipe Dinding Existing',
        options: [
            { id: 1, name: 'Tebal' },
            { id: 2, name: 'Tipis' }
        ]
    },
    {
        key: 'tipe_tipe_pelapis_dinding_existing',
        label: 'Tipe Pelapis Dinding Existing',
        options: [
            { id: 1, name: 'Cat' },
            { id: 2, name: 'Wallpaper' }
        ]
    },
    {
        key: 'bobot_tipe_pelapis_dinding_existing',
        label: 'Bobot Pelapis Dinding Existing',
        options: [
            { id: 1, name: 'Ringan' },
            { id: 2, name: 'Berat' }
        ]
    },
    {
        key: 'tipe_tipe_pintu_jendela_existing',
        label: 'Tipe Pintu Jendela Existing',
        options: [
            { id: 1, name: 'Aluminium' },
            { id: 2, name: 'Kayu' }
        ]
    },
    {
        key: 'bobot_tipe_pintu_jendela_existing',
        label: 'Bobot Pintu Jendela Existing',
        options: [
            { id: 1, name: 'Ringan' },
            { id: 2, name: 'Sedang' },
            { id: 3, name: 'Berat' }
        ]
    },
    {
        key: 'tipe_tipe_lantai_existing',
        label: 'Tipe Lantai Existing',
        options: [
            { id: 1, name: 'Keramik' },
            { id: 2, name: 'Granit' },
            { id: 3, name: 'Vinyl' }
        ]
    },
    {
        key: 'bobot_tipe_lantai_existing',
        label: 'Bobot Lantai Existing',
        options: [
            { id: 1, name: 'Ringan' },
            { id: 2, name: 'Berat' }
        ]
    }
];


const form = ref({
    data: {
        nama_bangunan: '',
        foto_depan: null,
        foto_sisi_kiri: null,
        foto_sisi_kanan: null,
        judul_foto: '',
        foto_lainnya: [], // JSON array of files or URLs
        bentuk_bangunan: '',
        grade_gudang: '',
        jumlah_lantai: null,
        basement: null,
        konstruksi_bangunan: '',
        konstruksi_lantai: '',
        konstruksi_dinding: '',
        konstruksi_atap: '',
        konstruksi_pondasi: '',
        versi_btb: null,
        tipe_spek: null,
        canvas_data: null, // JSON
        jenis_bangunan: '',
        jenis_bangunan_detail: '',
        jenis_bangunan_indeks_lantai: '',
        tahun_dibangun: null,
        keterangan_tahun_dibangun: '',
        tahun_renovasi: null,
        keterangan_tahun_direnovasi: '',
        jenis_renovasi: '',
        bobot_renovasi: null,
        kondisi_visual: '',
        catatan_khusus: '',
        luas_bangunan_terpotong: null,
        luas_bangunan_imb: null,
        luas_nama_pintu_jendela: null, // JSON
        luas_bobot_pintu_jendela: null, // JSON
        luas_nama_dinding: null, // JSON
        luas_bobot_dinding: null, // JSON
        luas_nama_rangka_atap_datar: null, // JSON
        luas_bobot_rangka_atap_datar: null, // JSON
        luas_nama_atap_datar: null, // JSON
        luas_bobot_atap_datar: null, // JSON
        tipe_pondasi_existing: null, // JSON
        bobot_tipe_pondasi_existing: null, // JSON
        tipe_struktur_existing: null, // JSON
        bobot_tipe_struktur_existing: null, // JSON
        tipe_rangka_atap_existing: null, // JSON
        bobot_rangka_atap_existing: null, // JSON
        tipe_penutup_atap_existing: null, // JSON
        bobot_penutup_atap_existing: null, // JSON
        tipe_tipe_dinding_existing: null, // JSON
        bobot_tipe_dinding_existing: null, // JSON
        tipe_tipe_pelapis_dinding_existing: null, // JSON
        bobot_tipe_pelapis_dinding_existing: null, // JSON
        // tahun_pemakaian_pondasi: null,
        // tahun_pemakaian_struktur: null,
        // tahun_pemakaian_rangka_atap: null,
        // tahun_pemakaian_penutup_atap: null,
        // bobot_tahun_pemakaian_pondasi: null,
        // bobot_tahun_pemakaian_struktur: null,
        // bobot_tahun_pemakaian_rangka_atap: null,
        // bobot_tahun_pemakaian_penutup_atap: null,
        // bobot_bangunan: null,
        status_data: 'draft',
    },
    errors: {},
    assign: (data = {}) => {
        for (const key in data) {
            if (key in form.value.data) {
                form.value.data[key] = data[key];
            }
        }
    },
    loading: false,
});

// Fungsi untuk file change, hanya untuk 3 foto utama
const onFileChange = (event, fieldName) => {
    const files = event.target.files;
    if (files.length) {
        form.value.data[fieldName] = files[0];
    } else {
        form.value.data[fieldName] = null;
    }
};
const save = async () => {
    form.value.loading = true;
    form.value.errors = {};

    const isEdit = !!route.params.id;
    const url = isEdit ? `bangunan/${route.params.id}/object` : 'bangunan/object';
    const method = isEdit ? 'put' : 'post';

    try {
        // Validasi schema
        storeSchema.parse(form.value.data);

        const formData = new FormData();

        // Append field biasa
        for (const key in form.value.data) {
            const value = form.value.data[key];

            // Skip foto_lainnya karena ditangani terpisah di bawah
            if (key === 'foto_lainnya') continue;

            // Handle File khusus (foto_depan, sisi_kiri, sisi_kanan)
            if (
                ['foto_depan', 'foto_sisi_kiri', 'foto_sisi_kanan'].includes(key) &&
                value instanceof File
            ) {
                formData.append(key, value);
            } else if (typeof value === 'object') {
                formData.append(key, JSON.stringify(value)); // misalnya canvas_data atau json
            } else if (value !== null && value !== undefined) {
                formData.append(key, value.toString());
            }
        }

        // Tangani foto_lainnya (array file dan keterangan)
        form.value.data.foto_lainnya.forEach((item, index) => {
            if (item.file) {
                formData.append('foto_lainnya', item.file);
            }
            if (item.keterangan) {
                formData.append(`foto_lainnya[${index}]`, item.keterangan);
            }
        });

        // Kirim ke backend
        const response = await AuthApi.client()({
            url,
            method,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if (response.data.success) {
            swal.fire({
                title: 'Success',
                text: `Data Bangunan berhasil ${isEdit ? 'diperbarui' : 'disimpan'}`,
                icon: 'success'
            });
            router.push({ name: 'Bangunan List' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            error.errors.forEach(err => {
                form.value.errors[err.path[0]] = err.message;
            });
        } else {
            console.error(error);
            swal.fire({
                title: 'Error',
                text: 'Terjadi kesalahan saat menyimpan data',
                icon: 'error'
            });
        }
    } finally {
        form.value.loading = false;
    }
};



// Initialize with one empty photo if array is empty
if (form.value.data.foto_lainnya.length === 0) {
    form.value.data.foto_lainnya.push({ file: null, keterangan: '', url: '' });
}

function getPreviewUrl(file) {
    return file ? URL.createObjectURL(file) : '';
}

function handleFileChange(event, index) {
    if (event.target.files.length > 0) {
        form.value.data.foto_lainnya[index].file = event.target.files[0];
        form.value.data.foto_lainnya[index].url = getPreviewUrl(event.target.files[0]);
    }
}

function addPhoto() {
    form.value.data.foto_lainnya.push({ file: null, keterangan: '', url: '' });
}

function removePhoto(index) {
    if (form.value.data.foto_lainnya.length > 1) {
        form.value.data.foto_lainnya.splice(index, 1);
    }
}


const statusOptions = [
    { name: 'Draft', id: 'draft' },
    { name: 'Publish', id: 'publish' }
]
onBeforeMount(async () => {
    if (route.params.id) {
        const data = await Helper.getDataById('bangunan', route.params.id);
        if (data) {
            // Set old_ untuk semua foto
            const fotoFields = ['foto_depan', 'foto_sisi_kiri', 'foto_sisi_kanan'];
            fotoFields.forEach(field => {
                if (field in data) {
                    data[`old_${field}`] = data[field];
                }
            });

            // Jika keterangan_foto_lainnya ada dan berupa string JSON, parse ke foto_lainnya
            if (data.foto_lainnya) {
                try {
                    const parsed = JSON.parse(data.foto_lainnya);
                    if (Array.isArray(parsed)) {
                        data.foto_lainnya = parsed.map(item => ({
                            url: item.path || '',   // URL preview
                            keterangan: item.keterangan || '',
                            file: null              // untuk deteksi apakah file baru diupload
                        }));
                    }
                } catch (err) {
                    console.error('Gagal parse foto_lainnya:', err.message);
                }
            }

            // Fallback jika tidak ada data foto_lainnya
            if (!Array.isArray(data.foto_lainnya) || data.foto_lainnya.length === 0) {
                data.foto_lainnya = [{
                    url: '',
                    keterangan: '',
                    file: null
                }];
            }

            form.value.assign(data);
        }
    }
});


const goBack = () => {
    router.push('/pages/object/bangunan');
};
</script>

<template>
    <form @submit.prevent="save" class="space-y-6">
        <!-- nama_bangunan -->
        <div>
            <!-- nama_bangunan -->
            <Label for="nama_bangunan" class="block font-medium">Nama Bangunan</Label>
            <InputText id="nama_bangunan" v-model="form.data.nama_bangunan" class="w-full border rounded p-2"
                :invalid="!!form.errors.nama_bangunan" />
            <InputError :message="form.errors.nama_bangunan" />
        </div>

        <div>
            <Label for="foto_depan" class="block font-medium">Foto Depan</Label>
            <InputText id="foto_depan" type="file" @change="e => onFileChange(e, 'foto_depan')" accept="image/*"
                class="w-full" />
            <p v-if="form.errors.foto_depan" class="text-red-600 text-sm">{{ form.errors.foto_depan }}</p>
        </div>

        <!-- foto_sisi_kiri -->
        <div>
            <Label for="foto_sisi_kiri" class="block font-medium">Foto Sisi Kiri</Label>
            <InputText id="foto_sisi_kiri" type="file" @change="e => onFileChange(e, 'foto_sisi_kiri')" accept="image/*"
                class="w-full" />
            <p v-if="form.errors.foto_sisi_kiri" class="text-red-600 text-sm">{{ form.errors.foto_sisi_kiri }}</p>
        </div>

        <!-- foto_sisi_kanan -->
        <div>
            <Label for="foto_sisi_kanan" class="block font-medium">Foto Sisi Kanan</Label>
            <InputText id="foto_sisi_kanan" type="file" @change="e => onFileChange(e, 'foto_sisi_kanan')"
                accept="image/*" class="w-full" />
            <p v-if="form.errors.foto_sisi_kanan" class="text-red-600 text-sm">{{ form.errors.foto_sisi_kanan }}</p>
        </div>

        <!-- judul_foto -->
        <div>
            <Label for="judul_foto" class="block font-medium">Judul Foto</Label>
            <textarea id="judul_foto" v-model="form.data.judul_foto" class="w-full border rounded p-2"></textarea>
            <p v-if="form.errors.judul_foto" class="text-red-600 text-sm">{{ form.errors.judul_foto }}</p>
        </div>

        <!-- foto_lainnya -->
        <div>
            <Label class="block font-medium">Foto Lainnya</Label>

            <div v-for="(photo, index) in form.data.foto_lainnya" :key="index" class="mb-4 flex items-center gap-2">
                <div class="flex-1">
                    <InputText type="file" @change="e => handleFileChange(e, index)" class="w-full" accept="image/*" />
                    <InputText type="text" v-model="photo.keterangan" placeholder="Keterangan foto"
                        class="w-full mt-2 border rounded p-2" />
                    <!-- Preview for existing images -->
                    <img v-if="photo.url && !photo.file" :src="photo.url" class="mt-2 h-20 object-cover" />
                    <!-- Preview for newly uploaded images -->
                    <img v-if="photo.file" :src="getPreviewUrl(photo.file)" class="mt-2 h-20 object-cover" />
                </div>

                <div class="flex flex-col space-y-2">
                    <button type="button" @click="addPhoto"
                        class="text-blue-600 hover:text-blue-800 text-2xl font-bold">
                        +
                    </button>
                    <button type="button" @click="removePhoto(index)"
                        class="text-red-600 hover:text-red-800 text-2xl font-bold"
                        :disabled="form.data.foto_lainnya.length <= 1">
                        -
                    </button>
                </div>


            </div>



            <p v-if="form.errors.foto_lainnya" class="text-red-600 text-sm">
                {{ form.errors.foto_lainnya }}
            </p>
        </div>

        <!-- bentuk_bangunan -->
        <div>
            <Label for="bentuk_bangunan" class="block font-medium">Bentuk Bangunan</Label>
            <InputText id="bentuk_bangunan" v-model="form.data.bentuk_bangunan" class="w-full border rounded p-2"
                :invalid="!!form.errors.bentuk_bangunan" />
            <InputError :message="form.errors.bentuk_bangunan" />
        </div>

        <!-- grade_gudang -->
        <div>
            <Label for="grade_gudang" class="block font-medium">Grade Gudang</Label>
            <InputText id="grade_gudang" v-model="form.data.grade_gudang" class="w-full border rounded p-2"
                :invalid="!!form.errors.grade_gudang" />
            <InputError :message="form.errors.grade_gudang" />
        </div>

        <!-- jumlah_lantai -->
        <div>
            <Label for="jumlah_lantai" class="block font-medium">Jumlah Lantai</Label>
            <InputText id="jumlah_lantai" v-model.number="form.data.jumlah_lantai" type="number" min="0"
                class="w-full border rounded p-2" :invalid="!!form.errors.jumlah_lantai" />
            <InputError :message="form.errors.jumlah_lantai" />
        </div>

        <!-- basement -->
        <div>
            <Label for="basement" class="block font-medium">Basement</Label>
            <InputText id="basement" v-model.number="form.data.basement" type="number" min="0"
                class="w-full border rounded p-2" :invalid="!!form.errors.basement" />
            <InputError :message="form.errors.basement" />
        </div>

        <!-- konstruksi_bangunan -->
        <div>
            <Label for="konstruksi_bangunan" class="block font-medium">Konstruksi Bangunan</Label>
            <InputText id="konstruksi_bangunan" v-model="form.data.konstruksi_bangunan"
                class="w-full border rounded p-2" :invalid="!!form.errors.konstruksi_bangunan" />
            <InputError :message="form.errors.konstruksi_bangunan" />
        </div>

        <!-- konstruksi_lantai -->
        <div>
            <Label for="konstruksi_lantai" class="block font-medium">Konstruksi Lantai</Label>
            <InputText id="konstruksi_lantai" v-model="form.data.konstruksi_lantai" class="w-full border rounded p-2"
                :invalid="!!form.errors.konstruksi_lantai" />
            <InputError :message="form.errors.konstruksi_lantai" />
        </div>

        <!-- konstruksi_dinding -->
        <div>
            <Label for="konstruksi_dinding" class="block font-medium">Konstruksi Dinding</Label>
            <InputText id="konstruksi_dinding" v-model="form.data.konstruksi_dinding" class="w-full border rounded p-2"
                :invalid="!!form.errors.konstruksi_dinding" />
            <InputError :message="form.errors.konstruksi_dinding" />
        </div>

        <!-- konstruksi_atap -->
        <div>
            <Label for="konstruksi_atap" class="block font-medium">Konstruksi Atap</Label>
            <InputText id="konstruksi_atap" v-model="form.data.konstruksi_atap" class="w-full border rounded p-2"
                :invalid="!!form.errors.konstruksi_atap" />
            <InputError :message="form.errors.konstruksi_atap" />
        </div>

        <!-- konstruksi_pondasi -->
        <div>
            <Label for="konstruksi_pondasi" class="block font-medium">Konstruksi Pondasi</Label>
            <InputText id="konstruksi_pondasi" v-model="form.data.konstruksi_pondasi" class="w-full border rounded p-2"
                :invalid="!!form.errors.konstruksi_pondasi" />
            <InputError :message="form.errors.konstruksi_pondasi" />
        </div>

        <!-- versi_btb -->
        <div>
            <Label for="versi_btb" class="block font-medium">Versi BTB</Label>
            <InputText id="versi_btb" v-model.number="form.data.versi_btb" type="number" min="0"
                class="w-full border rounded p-2" :invalid="!!form.errors.versi_btb" />
            <InputError :message="form.errors.versi_btb" />
        </div>

        <!-- tipe_spek -->
        <div>
            <Label for="tipe_spek" class="block font-medium">Tipe Spek</Label>
            <InputText id="tipe_spek" v-model.number="form.data.tipe_spek" type="number" min="0"
                class="w-full border rounded p-2" :invalid="!!form.errors.tipe_spek" />
            <InputError :message="form.errors.tipe_spek" />
        </div>

        <!-- canvas_data -->
        <div>
            <Label for="canvas_data" class="block font-medium">Canvas Data (JSON)</Label>
            <Textarea id="canvas_data" v-model="form.data.canvas_data" placeholder='Contoh: {"shapes": [...]}'
                class="w-full border rounded p-2" rows="4"></Textarea>
            <p v-if="form.errors.canvas_data" class="text-red-600 text-sm">{{ form.errors.canvas_data }}</p>
        </div>

        <!-- jenis_bangunan -->
        <div>
            <Label for="jenis_bangunan" class="block font-medium">Jenis Bangunan</Label>
            <InputText id="jenis_bangunan" v-model="form.data.jenis_bangunan" class="w-full border rounded p-2"
                :invalid="!!form.errors.jenis_bangunan" />
            <InputError :message="form.errors.jenis_bangunan" />
        </div>

        <!-- jenis_bangunan_detail -->
        <div>
            <Label for="jenis_bangunan_detail" class="block font-medium">Jenis Bangunan Detail</Label>
            <InputText id="jenis_bangunan_detail" v-model="form.data.jenis_bangunan_detail"
                class="w-full border rounded p-2" :invalid="!!form.errors.jenis_bangunan_detail" />
            <InputError :message="form.errors.jenis_bangunan_detail" />
        </div>

        <!-- jenis_bangunan_indeks_lantai -->
        <div>
            <Label for="jenis_bangunan_indeks_lantai" class="block font-medium">Jenis Bangunan Indeks Lantai</Label>
            <InputText id="jenis_bangunan_indeks_lantai" v-model="form.data.jenis_bangunan_indeks_lantai"
                class="w-full border rounded p-2" :invalid="!!form.errors.jenis_bangunan_indeks_lantai" />
            <InputError :message="form.errors.jenis_bangunan_indeks_lantai" />
        </div>

        <!-- tahun_dibangun -->
        <div>
            <Label for="tahun_dibangun" class="block font-medium">Tahun Dibangun</Label>
            <InputText id="tahun_dibangun" v-model.number="form.data.tahun_dibangun" type="number" min="0"
                class="w-full border rounded p-2" :invalid="!!form.errors.tahun_dibangun" />
            <InputError :message="form.errors.tahun_dibangun" />
        </div>

        <!-- keterangan_tahun_dibangun -->
        <div>
            <Label for="keterangan_tahun_dibangun" class="block font-medium">Keterangan Tahun Dibangun</Label>
            <Textarea id="keterangan_tahun_dibangun" v-model="form.data.keterangan_tahun_dibangun"
                class="w-full border rounded p-2"></Textarea>
            <p v-if="form.errors.keterangan_tahun_dibangun" class="text-red-600 text-sm">{{
                form.errors.keterangan_tahun_dibangun }}</p>
        </div>

        <!-- tahun_renovasi -->
        <div>
            <Label for="tahun_renovasi" class="block font-medium">Tahun Renovasi</Label>
            <InputText id="tahun_renovasi" v-model.number="form.data.tahun_renovasi" type="number" min="0"
                class="w-full border rounded p-2" :invalid="!!form.errors.tahun_renovasi" />
            <InputError :message="form.errors.tahun_renovasi" />
        </div>

        <!-- keterangan_tahun_direnovasi -->
        <div>
            <Label for="keterangan_tahun_direnovasi" class="block font-medium">Keterangan Tahun Direnovasi</Label>
            <Textarea id="keterangan_tahun_direnovasi" v-model="form.data.keterangan_tahun_direnovasi"
                class="w-full border rounded p-2"></Textarea>
            <p v-if="form.errors.keterangan_tahun_direnovasi" class="text-red-600 text-sm">{{
                form.errors.keterangan_tahun_direnovasi }}</p>
        </div>

        <!-- jenis_renovasi -->
        <div>
            <Label for="jenis_renovasi" class="block font-medium">Jenis Renovasi</Label>
            <Textarea id="jenis_renovasi" v-model="form.data.jenis_renovasi"
                class="w-full border rounded p-2"></Textarea>
            <InputError :message="form.errors.jenis_renovasi" />
        </div>

        <div>
            <Label for="bobot_renovasi" class="block font-medium">Bobot Renovasi</Label>
            <InputText id="bobot_renovasi" v-model.number="form.data.bobot_renovasi" type="number" min="0"
                class="w-full border rounded p-2" :invalid="!!form.errors.bobot_renovasi" />
            <InputError :message="form.errors.bobot_renovasi" />
        </div>

        <div>
            <Label for="kondisi_visual" class="block font-medium">Kondisi Visual</Label>
            <Textarea id="kondisi_visual" v-model="form.data.kondisi_visual"
                class="w-full border rounded p-2"></Textarea>
            <InputError :message="form.errors.kondisi_visual" />
        </div>

        <div>
            <Label for="catatan_khusus" class="block font-medium">Catatan Khusus</Label>
            <Textarea id="catatan_khusus" v-model="form.data.catatan_khusus"
                class="w-full border rounded p-2"></Textarea>
            <InputError :message="form.errors.catatan_khusus" />
        </div>

        <div>
            <Label for="luas_bangunan_terpotong" class="block font-medium">Luas Bangunan Terpotong</Label>
            <InputText id="luas_bangunan_terpotong" v-model.number="form.data.luas_bangunan_terpotong" type="number"
                step="0.01" min="0" class="w-full border rounded p-2"
                :invalid="!!form.errors.luas_bangunan_terpotong" />
            <InputError :message="form.errors.luas_bangunan_terpotong" />
        </div>

        <div>
            <Label for="luas_bangunan_imb" class="block font-medium">Luas Bangunan IMB</Label>
            <InputText id="luas_bangunan_imb" v-model.number="form.data.luas_bangunan_imb" type="number" step="0.01"
                min="0" class="w-full border rounded p-2" :invalid="!!form.errors.luas_bangunan_imb" />
            <InputError :message="form.errors.luas_bangunan_imb" />
        </div>

        <div v-for="field in jsonFields" :key="field.key">
            <Label :for="field.key" class="block font-medium">{{ field.label }}</Label>
            <Select v-model="form.data[field.key]" :options="field.options" show-clear option-label="name"
                option-value="id" filter :virtualScrollerOptions="{ itemSize: 38 }"
                :placeholder="`Pilih ${field.label}`" class="w-full" :invalid="!!form.errors[field.key]" />
            <InputError :message="form.errors[field.key]" />
        </div>


        <div>
            <Label for="jumlah_lantai_rumah_tinggal" class="block font-medium">Jumlah Lantai Rumah Tinggal</Label>
            <InputText id="jumlah_lantai_rumah_tinggal" v-model.number="form.data.jumlah_lantai_rumah_tinggal"
                type="number" min="0" step="1" class="w-full border rounded p-2"
                :invalid="!!form.errors.jumlah_lantai_rumah_tinggal" />
            <InputError :message="form.errors.jumlah_lantai_rumah_tinggal" />
        </div>

        <div>
            <Label for="penggunaan_bangunan" class="block font-medium">Penggunaan Bangunan</Label>
            <InputText id="penggunaan_bangunan" v-model="form.data.penggunaan_bangunan" type="text" maxlength="100"
                class="w-full border rounded p-2" :invalid="!!form.errors.penggunaan_bangunan" />
            <InputError :message="form.errors.penggunaan_bangunan" />
        </div>

        <div>
            <Label for="perlengkapan_bangunan" class="block font-medium">Perlengkapan Bangunan</Label>
            <Textarea id="perlengkapan_bangunan" v-model="form.data.perlengkapan_bangunan" rows="4"
                :invalid="!!form.errors.perlengkapan_bangunan" class="w-full border rounded p-2" />
            <InputError :message="form.errors.perlengkapan_bangunan" />
        </div>

        <div>
            <Label for="progres_pembangunan" class="block font-medium">Progres Pembangunan</Label>
            <InputText id="progres_pembangunan" v-model.number="form.data.progres_pembangunan" type="number" min="0"
                step="1" class="w-full border rounded p-2" :invalid="!!form.errors.progres_pembangunan" />
            <InputError :message="form.errors.progres_pembangunan" />
        </div>

        <div>
            <Label for="kondisi_bangunan" class="block font-medium">Kondisi Bangunan</Label>
            <Textarea id="kondisi_bangunan" v-model="form.data.kondisi_bangunan" rows="3"
                class="w-full border rounded p-2"></Textarea>
            <InputError :message="form.errors.kondisi_bangunan" />
        </div>

        <!-- status_data -->
        <div>
            <Select v-model="form.data.status_data" :options="statusOptions" option-label="name" option-value="id"
                show-clear filter placeholder="Select a status" class="w-full" :invalid="!!form.errors.status_data" />
            <InputError :message="form.errors.status_data" />
        </div>

        <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>