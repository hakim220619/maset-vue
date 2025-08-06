<script setup>
import InputDate from '@/components/InputDate.vue';
import InputError from '@/components/InputError.vue';
import MapPicker from '@/components/MapPicker.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { inject, onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import { storeSchema } from './schema.js';

const router = useRouter();
const route = useRoute();
const swal = inject('$swal');

// Form state
const form = ref({
    data: {
        judul_penilaian: '',
        nama_entitas: '',
        tanggal_inspeksi: '',
        tanggal_penilaian: '',
        penilai_surveyor: '',
        foto_foto: '',
        old_foto_foto: '',
        batas_utara: '',
        batas_selatan: '',
        batas_timur: '',
        batas_barat: '',
        jenis_aset: '',
        alamat_aset: '',
        koordinat: '',
        hak_kepemilikan: '',
        luas_tanah_m2: '',
        luas_bangunan_m2: '',
        row_jalan_m: '',
        perkerasan_jalan: '',
        posisi_aset: '',
        bentuk_tanah: '',
        lebar_muka_m: '',
        elevasi_terhadap_jalan_m: '',
        topografi: '',
        orientasi: '',
        peruntukan: '',
        jarak_terhadap_pusat_kota: '',
        aksesibilitas_lokasi: '',
        kondisi_lingkungan: '',
        kabupaten: ''
    },
    errors: {},
    assign: (data = {}) => {
        for (const key in data) {
            if (key in form.value.data) {
                form.value.data[key] = data[key];
            }
        }
    },
    loading: false
});

// Reactive dropdown options
const dropdownOptions = ref({});

// Load static dropdown options
const loadDropdownOptions = () => {
    dropdownOptions.value = {
        perkerasan_jalan: [
            { id: 1, name: 'Aspal' },
            { id: 2, name: 'Beton' },
            { id: 3, name: 'Tanah' }
        ],
        posisi_aset: [
            { id: 1, name: 'Dekat Jalan' },
            { id: 2, name: 'Tengah Tanah' }
        ],
        bentuk_tanah: [
            { id: 1, name: 'Persegi' },
            { id: 2, name: 'Persegi Panjang' },
            { id: 3, name: 'Segitiga' }
        ],
        topografi: [
            { id: 1, name: 'Datar' },
            { id: 2, name: 'Bergunung' },
            { id: 3, name: 'Berbukit' }
        ],
        orientasi: [
            { id: 1, name: 'Utara' },
            { id: 2, name: 'Selatan' },
            { id: 3, name: 'Timur' },
            { id: 4, name: 'Barat' }
        ],
        peruntukan: [
            { id: 1, name: 'Perumahan' },
            { id: 2, name: 'Komersial' },
            { id: 3, name: 'Industri' }
        ]
    };
};

// Field helpers
const isNumberField = (key) => ['luas_tanah_m2', 'luas_bangunan_m2', 'row_jalan_m', 'lebar_muka_m', 'elevasi_terhadap_jalan_m'].includes(key);

const isDateField = (key) => ['tanggal_inspeksi', 'tanggal_penilaian'].includes(key);

// Submit logic

const save = async () => {
    form.value.loading = true;
    const url = route.params.id ? `tanah/${route.params.id}/object` : 'tanah/object';

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
                text: 'Data Tanah berhasil disimpan',
                icon: 'success'
            });
            router.push({ name: 'Tanah List' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Gagal menyimpan data Tanah',
                icon: 'error'
            });
        }
    }

    form.value.loading = false;
};

// Watch for field error reset
for (const key in form.value.data) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}

// Go back
const goBack = () => {
    router.push('/pages/object/tanah');
};

// Init data
onBeforeMount(async () => {
    loadDropdownOptions();

    if (route.params.id) {
        const data = await Helper.getDataById('tanah', route.params.id);
        if (data) {
            console.log(data);
            data.old_foto_foto = data.foto_foto;

            form.value.assign(data);
        }
    }
});
</script>

<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">


            <template v-for="(value, key) in form.data" :key="key">
                <!-- Upload file khusus untuk foto_foto -->
                <div v-if="key === 'foto_foto'">
                    <Label :for="key">{{ 'Foto-foto' }}</Label>
                    <input type="file" :id="key" class="w-full border rounded p-2"
                        @change="(e) => (form.data[key] = e.target.files[0])" />
                    <InputError :message="form.errors[key]" />
                </div>
                <div v-else-if="[
                    'koordinat',
                ].includes(key)">
                    <!-- Coordinate picker (spans full width) -->
                    <div class="md:col-span-2">
                        <Label for="koordinat">KOORDINAT & ALAMAT ASET</Label>
                        <MapPicker v-model="form.data.koordinat" @address="addr => form.data.alamat_aset = addr" />
                        <small class="text-sm text-gray-500">
                            Klik pada peta untuk memilih titik. Koordinat dan alamat otomatis terisi,
                            tetapi alamat bisa Anda edit manual di bawah jika perlu.
                        </small>
                    </div>
                    <InputText v-model="form.data[key]" :id="key" class="w-full" :invalid="!!form.errors[key]" />
                </div>
                <!-- Dropdown untuk field yang membutuhkan select -->
                <div
                    v-else-if="['perkerasan_jalan', 'posisi_aset', 'bentuk_tanah', 'topografi', 'orientasi', 'peruntukan'].includes(key)">
                    <Label :for="key">{{ key.replaceAll('_', ' ').toUpperCase() }}</Label>
                    <Select v-model="form.data[key]" :options="dropdownOptions[key] || []" show-clear
                        option-label="name" option-value="id" filter placeholder="Select an option" class="w-full"
                        :invalid="!!form.errors[key]" />

                    <InputError :message="form.errors[key]" />
                </div>

                <!-- Textarea untuk alamat_aset, aksesibilitas_lokasi, kondisi_lingkungan -->
                <div v-else-if="['alamat_aset', 'aksesibilitas_lokasi', 'kondisi_lingkungan'].includes(key)">
                    <Label :for="key">{{ key.replaceAll('_', ' ').toUpperCase() }}</Label>
                    <Textarea v-model="form.data[key]" :id="key" rows="3" class="w-full"
                        :invalid="!!form.errors[key]" />
                    <InputError :message="form.errors[key]" />
                </div>

                <!-- Input Number untuk field number -->
                <div v-else-if="isNumberField(key)">
                    <Label :for="key">{{ key.replaceAll('_', ' ').toUpperCase() }}</Label>
                    <InputNumber v-model.number="form.data[key]" :id="key" class="w-full" :invalid="!!form.errors[key]"
                        inputmode="numeric" pattern="[0-9]*" mode="decimal" minFractionDigits="0"
                        maxFractionDigits="2" />
                    <InputError :message="form.errors[key]" />
                </div>

                <!-- Input text atau tanggal -->
                <div v-else>
                    <Label :for="key">{{ key.replaceAll('_', ' ').toUpperCase() }}</Label>

                    <InputDate v-if="isDateField(key)" v-model="form.data[key]" :id="key" class="w-full"
                        :invalid="!!form.errors[key]" />

                    <InputText v-else-if="isNumberField(key)" v-model="form.data[key]" :id="key" class="w-full"
                        :invalid="!!form.errors[key]" inputmode="numeric" pattern="[0-9]*" />

                    <InputText v-else v-model="form.data[key]" :id="key" class="w-full" :invalid="!!form.errors[key]" />

                    <InputError :message="form.errors[key]" />
                </div>
            </template>
        </div>

        <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>
