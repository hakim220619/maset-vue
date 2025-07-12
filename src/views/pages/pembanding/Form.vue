<script setup>
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import swal from 'sweetalert2';
import { onBeforeMount, ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';

import { storeSchema } from './schema.js';

import InputError from '@/components/InputError.vue';

// Import PrimeVue components

const router = useRouter();
const route = useRoute();

const folderName = 'pembanding';

const form = ref({
    data: {
        jenis_property: '',
        foto: [], // JSON array of files or URLs
        sumber_informasi: '',
        kategori_sumber_informasi: '',
        no_hp: '',
        jenis_data: '',
        tgl_penawaran: null, // Changed to null for date input
        harga_penawaran: '',
        diskon: '',
        alamat_aset: '',
        koordinat: '',
        hak_kepemilikan: '',
        luas_tanah: '',
        luas_bangunan: '',
        tahun_dibangun: '',
        tahun_renovasi: '',
        tipe_bangunan: '',
        jumlah_lantai: '',
        kondisi_bangunan: '',
        row_jalan: '',
        perkerasan_jalan: '',
        posisi_aset: '',
        bentuk_tanah: '',
        lebar_muka: '', // New field
        elevasi_terhadap_jalan: '', // New field
        topografi: '', // New field
        orientasi: '', // New field
        peruntukan: '', // New field
        jarak_thd_pusat_kota: '', // New field
        aksesibilitas_lokasi: '', // New field
        kondisi_lingkungan: '', // New field
        syarat_pembiayaan: '', // New field
        kondisi_penjualan: '', // New field
        pengeluaran_setelah_pembelian: '', // New field
        kondisi_pasar: '', // New field
        status_data: 'draft'
    },
    errors: {},

    assign: (data = {}) => {
        for (const key in data) {
            if (key in form.value.data) {
                // Special handling for date fields if needed, assuming backend sends ISO string
                if (key === 'tgl_penawaran' && data[key]) {
                    form.value.data[key] = new Date(data[key]);
                } else {
                    form.value.data[key] = data[key];
                }
            }
        }
    },
    loading: false
});

// Fungsi untuk file change, hanya untuk 3 foto utama (These seem to be commented out or not directly used for the 'foto' array)
// const onFileChange = (event, fieldName) => {
//     const files = event.target.files;
//     if (files.length) {
//         form.value.data[fieldName] = files[0];
//     } else {
//         form.value.data[fieldName] = null;
//     }
// };

const save = async () => {
    form.value.loading = true;
    const url = route.params.id ? `pembanding/${route.params.id}/${folderName}` : `pembanding/${folderName}`;

    try {
        storeSchema.parse(form.value.data);

        const formData = new FormData();
        for (const key in form.value.data) {
            formData.append(key, form.value.data[key]);
        }

        const response = await AuthApi.client()({
            url,
            method: route.params.id ? 'put' : 'post',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.success) {
            swal.fire({
                title: 'Success',
                text: 'Data Pembanding berhasil disimpan',
                icon: 'success'
            });
            router.push({ name: 'Pembanding List' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Gagal menyimpan data Pembanding',
                icon: 'error'
            });
        }
    }

    form.value.loading = false;
};

// Initialize with one empty photo if array is empty
if (form.value.data.foto.length === 0) {
    form.value.data.foto.push({ file: null, keterangan: '', url: '' });
}

function getPreviewUrl(file) {
    return file ? URL.createObjectURL(file) : '';
}

function handleFileChange(event, index) {
    if (event.target.files.length > 0) {
        form.value.data.foto[index].file = event.target.files[0];
        form.value.data.foto[index].url = getPreviewUrl(event.target.files[0]);
    }
}

function addPhoto() {
    form.value.data.foto.push({ file: null, keterangan: '', url: '' });
}

function removePhoto(index) {
    if (form.value.data.foto.length > 1) {
        form.value.data.foto.splice(index, 1);
    }
}

const statusOptions = [
    { name: 'Draft', id: 'draft' },
    { name: 'Publish', id: 'publish' }
];

const jenisDataOptions = [
    { name: 'Penawaran', id: 'penawaran' },
    { name: 'Transaksi', id: 'transaksi' }
];

// New options for dropdowns
const kategoriSumberInformasiOptions = [
    { name: 'Pemilik', id: 'pemilik' },
    { name: 'Perantara', id: 'perantara' },
    { name: 'Agen', id: 'agen' }
];

const tipeBangunanOptions = [
    { name: 'Bertingkat', id: 'bertingkat' },
    { name: 'Tidak bertingkat', id: 'tidak_bertingkat' }
];

const kondisiBangunanOptions = [
    { name: 'Terawat', id: 'terawat' },
    { name: 'Tidak terawat', id: 'tidak_terawat' }
];

const perkerasanJalanOptions = [
    { name: 'Aspal', id: 'aspal' },
    { name: 'Beton', id: 'beton' },
    { name: 'Paving block', id: 'paving_block' },
    { name: 'Tanah', id: 'tanah' },
    { name: 'Sirtu', id: 'sirtu' }
];

const posisiAsetOptions = [
    { name: 'Hook', id: 'hook' },
    { name: 'Interior', id: 'interior' },
    { name: 'Tusuk sate', id: 'tusuk_sate' },
    { name: 'Sudut', id: 'sudut' }
];

const bentukTanahOptions = [
    { name: 'Beraturan', id: 'beraturan' },
    { name: 'Tidak beraturan', id: 'tidak_beraturan' },
    { name: 'Letter L', id: 'letter_l' },
    { name: 'Trapesium', id: 'trapesium' }
];

const topografiOptions = [
    { name: 'Datar', id: 'datar' },
    { name: 'Bergelombang', id: 'bergelombang' },
    { name: 'Bukit', id: 'bukit' },
    { name: 'Jurang', id: 'jurang' },
    { name: 'Kombinasi', id: 'kombinasi' }
];

const orientasiOptions = [
    { name: 'Utara', id: 'utara' },
    { name: 'Selatan', id: 'selatan' },
    { name: 'Barat', id: 'barat' },
    { name: 'Timur', id: 'timur' }
];

const peruntukanOptions = [
    { name: 'Permukiman', id: 'permukiman' },
    { name: 'Perkantoran', id: 'perkantoran' },
    { name: 'Perdagangan & Jasa', id: 'perdagangan_jasa' },
    { name: 'Komersial', id: 'komersial' },
    { name: 'Pertanian', id: 'pertanian' },
    { name: 'Perkebunan', id: 'perkebunan' },
    { name: 'Industri', id: 'industri' },
    { name: 'Campuran', id: 'campuran' }
];

onBeforeMount(async () => {
    if (route.params.id) {
        const data = await Helper.getDataById('pembanding', route.params.id);
        if (data) {
            // Jika keterangan_foto_lainnya ada dan berupa string JSON, parse ke foto_lainnya
            if (data.foto) {
                try {
                    const parsed = JSON.parse(data.foto);
                    if (Array.isArray(parsed)) {
                        data.foto = parsed.map((item) => ({
                            url: item.path || '', // URL preview
                            keterangan: item.keterangan || '',
                            file: null // untuk deteksi apakah file baru diupload
                        }));
                    }
                } catch (err) {
                    console.error('Gagal parse foto:', err.message);
                }
            }

            // Fallback jika tidak ada data foto
            if (!Array.isArray(data.foto) || data.foto.length === 0) {
                data.foto = [
                    {
                        url: '',
                        keterangan: '',
                        file: null
                    }
                ];
            }

            form.value.assign(data);
        }
    }
});

const goBack = () => {
    router.push('/pages/pembanding');
};
</script>

<template>
    <form @submit.prevent="save" class="space-y-6">
        <div>
            <Label for="jenis_property" class="block font-medium">Jenis Properti</Label>
            <InputText id="jenis_property" v-model="form.data.jenis_property" class="w-full border rounded p-2"
                :invalid="!!form.errors.jenis_property" />
            <InputError :message="form.errors.jenis_property" />
        </div>

        <div>
            <Label class="block font-medium">Foto-foto</Label>
            <div v-for="(photo, index) in form.data.foto" :key="index" class="mb-4 flex items-center gap-2">
                <div class="flex-1">
                    <InputText type="file" @change="(e) => handleFileChange(e, index)" class="w-full"
                        accept="image/*" />
                    <img v-if="photo.url && !photo.file" :src="photo.url" class="mt-2 h-20 object-cover" />
                    <img v-if="photo.file" :src="getPreviewUrl(photo.file)" class="mt-2 h-20 object-cover" />
                </div>
                <div class="flex flex-col space-y-2">
                    <button type="button" @click="addPhoto"
                        class="text-blue-600 hover:text-blue-800 text-2xl font-bold">+</button>
                    <button type="button" @click="removePhoto(index)"
                        class="text-red-600 hover:text-red-800 text-2xl font-bold"
                        :disabled="form.data.foto.length <= 1">-</button>
                </div>
            </div>
            <InputError :message="form.errors.foto" />
        </div>

        <div>
            <Label for="sumber_informasi" class="block font-medium">Sumber Informasi</Label>
            <InputText id="sumber_informasi" v-model="form.data.sumber_informasi" class="w-full border rounded p-2"
                :invalid="!!form.errors.sumber_informasi" />
            <InputError :message="form.errors.sumber_informasi" />
        </div>

        <div>
            <Label for="kategori_sumber_informasi" class="block font-medium">Kategori Sumber Informasi</Label>
            <Select v-model="form.data.kategori_sumber_informasi" :options="kategoriSumberInformasiOptions" show-clear
                option-label="name" option-value="id" filter :placeholder="`Pilih Kategori Sumber Informasi`"
                class="w-full" :invalid="!!form.errors.kategori_sumber_informasi" />
            <InputError :message="form.errors.kategori_sumber_informasi" />
        </div>

        <div>
            <Label for="no_hp" class="block font-medium">Nomor HP</Label>
            <InputText id="no_hp" v-model.number="form.data.no_hp" type="number" min="0"
                class="w-full border rounded p-2" :invalid="!!form.errors.no_hp" />
            <InputError :message="form.errors.no_hp" />
        </div>

        <div>
            <Label for="jenis_data" class="block font-medium">Jenis Data</Label>
            <Select v-model="form.data.jenis_data" :options="jenisDataOptions" show-clear option-label="name"
                option-value="id" filter :virtualScrollerOptions="{ itemSize: 38 }" :placeholder="`Pilih Jenis Data`"
                class="w-full" :invalid="!!form.errors.jenis_data" />
            <InputError :message="form.errors.jenis_data" />
        </div>

        <div>
            <Label for="tgl_penawaran" class="block font-medium">Tanggal Penawaran / Transaksi</Label>
            <Calendar id="tgl_penawaran" v-model="form.data.tgl_penawaran" dateFormat="yy-mm-dd"
                class="w-full border rounded p-2" :invalid="!!form.errors.tgl_penawaran" showIcon />
            <InputError :message="form.errors.tgl_penawaran" />
        </div>

        <div>
            <Label for="harga_penawaran" class="block font-medium">Harga Penawaran / Transaksi</Label>
            <InputText id="harga_penawaran" v-model.number="form.data.harga_penawaran" type="number" min="0"
                class="w-full border rounded p-2" :invalid="!!form.errors.harga_penawaran" />
            <InputError :message="form.errors.harga_penawaran" />
        </div>

        <div>
            <Label for="diskon" class="block font-medium">Diskon</Label>
            <InputText id="diskon" v-model.number="form.data.diskon" type="number" min="0"
                class="w-full border rounded p-2" :invalid="!!form.errors.diskon" />
            <InputError :message="form.errors.diskon" />
        </div>

        <div>
            <Label for="alamat_aset" class="block font-medium">Alamat Aset</Label>
            <InputText id="alamat_aset" v-model="form.data.alamat_aset" class="w-full border rounded p-2"
                :invalid="!!form.errors.alamat_aset" />
            <InputError :message="form.errors.alamat_aset" />
        </div>

        <div>
            <Label for="koordinat" class="block font-medium">Koordinat</Label>
            <InputText id="koordinat" v-model="form.data.koordinat" class="w-full border rounded p-2"
                :invalid="!!form.errors.koordinat" />
            <InputError :message="form.errors.koordinat" />
        </div>

        <div>
            <Label for="hak_kepemilikan" class="block font-medium">Hak Kepemilikan</Label>
            <InputText id="hak_kepemilikan" v-model="form.data.hak_kepemilikan" class="w-full border rounded p-2"
                :invalid="!!form.errors.hak_kepemilikan" />
            <InputError :message="form.errors.hak_kepemilikan" />
        </div>

        <div>
            <Label for="luas_tanah" class="block font-medium">Luas Tanah (m2)</Label>
            <InputText id="luas_tanah" v-model.number="form.data.luas_tanah" type="number" min="0"
                class="w-full border rounded p-2" :invalid="!!form.errors.luas_tanah" />
            <InputError :message="form.errors.luas_tanah" />
        </div>

        <div>
            <Label for="luas_bangunan" class="block font-medium">Luas Bangunan (m2)</Label>
            <InputText id="luas_bangunan" v-model.number="form.data.luas_bangunan" type="number" min="0"
                class="w-full border rounded p-2" :invalid="!!form.errors.luas_bangunan" />
            <InputError :message="form.errors.luas_bangunan" />
        </div>

        <div>
            <Label for="tahun_dibangun" class="block font-medium">Tahun dibangun</Label>
            <InputText id="tahun_dibangun" v-model.number="form.data.tahun_dibangun" type="number" min="1900"
                :max="new Date().getFullYear()" class="w-full border rounded p-2"
                :invalid="!!form.errors.tahun_dibangun" />
            <InputError :message="form.errors.tahun_dibangun" />
        </div>

        <div>
            <Label for="tahun_renovasi" class="block font-medium">Tahun direnovasi</Label>
            <InputText id="tahun_renovasi" v-model.number="form.data.tahun_renovasi" type="number" min="1900"
                :max="new Date().getFullYear()" class="w-full border rounded p-2"
                :invalid="!!form.errors.tahun_renovasi" />
            <InputError :message="form.errors.tahun_renovasi" />
        </div>

        <div>
            <Label for="tipe_bangunan" class="block font-medium">Tipe Bangunan</Label>
            <Select v-model="form.data.tipe_bangunan" :options="tipeBangunanOptions" show-clear option-label="name"
                option-value="id" filter :placeholder="`Pilih Tipe Bangunan`" class="w-full"
                :invalid="!!form.errors.tipe_bangunan" />
            <InputError :message="form.errors.tipe_bangunan" />
        </div>

        <div>
            <Label for="jumlah_lantai" class="block font-medium">Jumlah Lantai</Label>
            <InputText id="jumlah_lantai" v-model.number="form.data.jumlah_lantai" type="number" min="1"
                class="w-full border rounded p-2" :invalid="!!form.errors.jumlah_lantai" />
            <InputError :message="form.errors.jumlah_lantai" />
        </div>

        <div>
            <Label for="kondisi_bangunan" class="block font-medium">Kondisi Bangunan</Label>
            <Select v-model="form.data.kondisi_bangunan" :options="kondisiBangunanOptions" show-clear
                option-label="name" option-value="id" filter :placeholder="`Pilih Kondisi Bangunan`" class="w-full"
                :invalid="!!form.errors.kondisi_bangunan" />
            <InputError :message="form.errors.kondisi_bangunan" />
        </div>

        <div>
            <Label for="row_jalan" class="block font-medium">Row Jalan (m)</Label>
            <InputText id="row_jalan" v-model.number="form.data.row_jalan" type="number" min="0" step="0.1"
                class="w-full border rounded p-2" :invalid="!!form.errors.row_jalan" />
            <InputError :message="form.errors.row_jalan" />
        </div>

        <div>
            <Label for="perkerasan_jalan" class="block font-medium">Perkerasan Jalan</Label>
            <Select v-model="form.data.perkerasan_jalan" :options="perkerasanJalanOptions" show-clear
                option-label="name" option-value="id" filter :placeholder="`Pilih Perkerasan Jalan`" class="w-full"
                :invalid="!!form.errors.perkerasan_jalan" />
            <InputError :message="form.errors.perkerasan_jalan" />
        </div>

        <div>
            <Label for="posisi_aset" class="block font-medium">Posisi Aset</Label>
            <Select v-model="form.data.posisi_aset" :options="posisiAsetOptions" show-clear option-label="name"
                option-value="id" filter :placeholder="`Pilih Posisi Aset`" class="w-full"
                :invalid="!!form.errors.posisi_aset" />
            <InputError :message="form.errors.posisi_aset" />
        </div>

        <div>
            <Label for="bentuk_tanah" class="block font-medium">Bentuk Tanah</Label>
            <Select v-model="form.data.bentuk_tanah" :options="bentukTanahOptions" show-clear option-label="name"
                option-value="id" filter :placeholder="`Pilih Bentuk Tanah`" class="w-full"
                :invalid="!!form.errors.bentuk_tanah" />
            <InputError :message="form.errors.bentuk_tanah" />
        </div>

        <div>
            <Label for="lebar_muka" class="block font-medium">Lebar Muka (m)</Label>
            <InputText id="lebar_muka" v-model.number="form.data.lebar_muka" type="number" min="0" step="0.1"
                class="w-full border rounded p-2" :invalid="!!form.errors.lebar_muka" />
            <InputError :message="form.errors.lebar_muka" />
        </div>

        <div>
            <Label for="elevasi_terhadap_jalan" class="block font-medium">Elevasi terhadap jalan (m)</Label>
            <InputText id="elevasi_terhadap_jalan" v-model.number="form.data.elevasi_terhadap_jalan" type="number"
                step="0.1" class="w-full border rounded p-2" :invalid="!!form.errors.elevasi_terhadap_jalan" />
            <InputError :message="form.errors.elevasi_terhadap_jalan" />
        </div>

        <div>
            <Label for="topografi" class="block font-medium">Topografi</Label>
            <Select v-model="form.data.topografi" :options="topografiOptions" show-clear option-label="name"
                option-value="id" filter :placeholder="`Pilih Topografi`" class="w-full"
                :invalid="!!form.errors.topografi" />
            <InputError :message="form.errors.topografi" />
        </div>

        <div>
            <Label for="orientasi" class="block font-medium">Orientasi</Label>
            <Select v-model="form.data.orientasi" :options="orientasiOptions" show-clear option-label="name"
                option-value="id" filter :placeholder="`Pilih Orientasi`" class="w-full"
                :invalid="!!form.errors.orientasi" />
            <InputError :message="form.errors.orientasi" />
        </div>

        <div>
            <Label for="peruntukan" class="block font-medium">Peruntukan</Label>
            <Select v-model="form.data.peruntukan" :options="peruntukanOptions" show-clear option-label="name"
                option-value="id" filter :placeholder="`Pilih Peruntukan`" class="w-full"
                :invalid="!!form.errors.peruntukan" />
            <InputError :message="form.errors.peruntukan" />
        </div>

        <div>
            <Label for="jarak_thd_pusat_kota" class="block font-medium">Jarak terhadap pusat kota</Label>
            <InputText id="jarak_thd_pusat_kota" v-model="form.data.jarak_thd_pusat_kota"
                class="w-full border rounded p-2" :invalid="!!form.errors.jarak_thd_pusat_kota" />
            <InputError :message="form.errors.jarak_thd_pusat_kota" />
        </div>

        <div>
            <Label for="aksesibilitas_lokasi" class="block font-medium">Aksesibilitas & Lokasi</Label>
            <InputText id="aksesibilitas_lokasi" v-model="form.data.aksesibilitas_lokasi"
                class="w-full border rounded p-2" :invalid="!!form.errors.aksesibilitas_lokasi" />
            <InputError :message="form.errors.aksesibilitas_lokasi" />
        </div>

        <div>
            <Label for="kondisi_lingkungan" class="block font-medium">Kondisi Lingkungan</Label>
            <InputText id="kondisi_lingkungan" v-model="form.data.kondisi_lingkungan" class="w-full border rounded p-2"
                :invalid="!!form.errors.kondisi_lingkungan" />
            <InputError :message="form.errors.kondisi_lingkungan" />
        </div>

        <div>
            <Label for="syarat_pembiayaan" class="block font-medium">Syarat Pembiayaan</Label>
            <InputText id="syarat_pembiayaan" v-model="form.data.syarat_pembiayaan" class="w-full border rounded p-2"
                :invalid="!!form.errors.syarat_pembiayaan" />
            <InputError :message="form.errors.syarat_pembiayaan" />
        </div>

        <div>
            <Label for="kondisi_penjualan" class="block font-medium">Kondisi Penjualan</Label>
            <InputText id="kondisi_penjualan" v-model="form.data.kondisi_penjualan" class="w-full border rounded p-2"
                :invalid="!!form.errors.kondisi_penjualan" />
            <InputError :message="form.errors.kondisi_penjualan" />
        </div>

        <div>
            <Label for="pengeluaran_setelah_pembelian" class="block font-medium">Pengeluaran Yang Dilakukan Segera
                Setelah Pembelian</Label>
            <InputText id="pengeluaran_setelah_pembelian" v-model="form.data.pengeluaran_setelah_pembelian"
                class="w-full border rounded p-2" :invalid="!!form.errors.pengeluaran_setelah_pembelian" />
            <InputError :message="form.errors.pengeluaran_setelah_pembelian" />
        </div>

        <div>
            <Label for="kondisi_pasar" class="block font-medium">Kondisi Pasar</Label>
            <InputText id="kondisi_pasar" v-model="form.data.kondisi_pasar" class="w-full border rounded p-2"
                :invalid="!!form.errors.kondisi_pasar" />
            <InputError :message="form.errors.kondisi_pasar" />
        </div>

        <div>
            <Label for="status_data" class="block font-medium">Status Data</Label>
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
