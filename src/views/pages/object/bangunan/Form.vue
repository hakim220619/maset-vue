<script setup>
import { AuthApi } from '@/service/Api';
import swal from 'sweetalert2';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeSchema } from './schema.js';

const router = useRouter();
const route = useRoute();

const jsonFields = [
    { key: 'luas_nama_pintu_jendela', label: 'Luas Nama Pintu Jendela' },
    { key: 'luas_bobot_pintu_jendela', label: 'Luas Bobot Pintu Jendela' },
    { key: 'luas_nama_dinding', label: 'Luas Nama Dinding' },
    { key: 'luas_bobot_dinding', label: 'Luas Bobot Dinding' },
    { key: 'luas_nama_rangka_atap_datar', label: 'Luas Nama Rangka Atap Datar' },
    { key: 'luas_bobot_rangka_atap_datar', label: 'Luas Bobot Rangka Atap Datar' },
    { key: 'luas_nama_atap_datar', label: 'Luas Nama Atap Datar' },
    { key: 'luas_bobot_atap_datar', label: 'Luas Bobot Atap Datar' },
    { key: 'tipe_pondasi_existing', label: 'Tipe Pondasi Existing' },
    { key: 'bobot_tipe_pondasi_existing', label: 'Bobot Tipe Pondasi Existing' },
    { key: 'tipe_struktur_existing', label: 'Tipe Struktur Existing' },
    { key: 'bobot_tipe_struktur_existing', label: 'Bobot Tipe Struktur Existing' },
    { key: 'tipe_rangka_atap_existing', label: 'Tipe Rangka Atap Existing' },
    { key: 'bobot_rangka_atap_existing', label: 'Bobot Rangka Atap Existing' },
    { key: 'tipe_penutup_atap_existing', label: 'Tipe Penutup Atap Existing' },
    { key: 'bobot_penutup_atap_existing', label: 'Bobot Penutup Atap Existing' },
    { key: 'tipe_tipe_dinding_existing', label: 'Tipe Tipe Dinding Existing' },
    { key: 'bobot_tipe_dinding_existing', label: 'Bobot Tipe Dinding Existing' },
    { key: 'tipe_tipe_pelapis_dinding_existing', label: 'Tipe Pelapis Dinding Existing' },
    { key: 'bobot_tipe_pelapis_dinding_existing', label: 'Bobot Pelapis Dinding Existing' },
    { key: 'tipe_tipe_pintu_jendela_existing', label: 'Tipe Pintu Jendela Existing' },
    { key: 'bobot_tipe_pintu_jendela_existing', label: 'Bobot Pintu Jendela Existing' },
    { key: 'tipe_tipe_lantai_existing', label: 'Tipe Lantai Existing' },
    { key: 'bobot_tipe_lantai_existing', label: 'Bobot Lantai Existing' },
]

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
        tahun_pemakaian_pondasi: null,
        tahun_pemakaian_struktur: null,
        tahun_pemakaian_rangka_atap: null,
        tahun_pemakaian_penutup_atap: null,
        bobot_tahun_pemakaian_pondasi: null,
        bobot_tahun_pemakaian_struktur: null,
        bobot_tahun_pemakaian_rangka_atap: null,
        bobot_tahun_pemakaian_penutup_atap: null,
        bobot_bangunan: null,
        status_data: 'draft',
    },
    errors: {},
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

    try {
        storeSchema.parse(form.value.data);

        const formData = new FormData();

        // Append text/number/json (stringify JSON where needed)
        Object.entries(form.value.data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (
                    ['foto_depan', 'foto_sisi_kiri', 'foto_sisi_kanan'].includes(key) &&
                    value instanceof File
                ) {
                    // handled separately
                    return;
                }

                // JSON stringify for JSON fields (arrays or objects)
                if (
                    [
                        'foto_lainnya', 'canvas_data',
                        'luas_nama_pintu_jendela', 'luas_bobot_pintu_jendela',
                        'luas_nama_dinding', 'luas_bobot_dinding',
                        'luas_nama_rangka_atap_datar', 'luas_bobot_rangka_atap_datar',
                        'luas_nama_atap_datar', 'luas_bobot_atap_datar',
                        'tipe_pondasi_existing', 'bobot_tipe_pondasi_existing',
                        'tipe_struktur_existing', 'bobot_tipe_struktur_existing',
                        'tipe_rangka_atap_existing', 'bobot_rangka_atap_existing',
                        'tipe_penutup_atap_existing', 'bobot_penutup_atap_existing',
                        'tipe_tipe_dinding_existing', 'bobot_tipe_dinding_existing',
                        'tipe_tipe_pelapis_dinding_existing', 'bobot_tipe_pelapis_dinding_existing',
                    ].includes(key)
                ) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        // Append files
        ['foto_depan', 'foto_sisi_kiri', 'foto_sisi_kanan'].forEach((field) => {
            const file = form.value.data[field];
            if (file instanceof File) {
                formData.append(field, file);
            }
        });

        // Kirim ke backend (ganti URL sesuai endpoint)
        const url = '/api/bangunan'; // contoh endpoint
        const res = await AuthApi.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        swal.fire('Berhasil', 'Data bangunan berhasil disimpan', 'success');
        router.push('/bangunan');
    } catch (e) {
        if (e.errors) {
            // dari zod
            const errors = {};
            for (const issue of e.errors) {
                errors[issue.path[0]] = issue.message;
            }
            form.value.errors = errors;
        } else {
            swal.fire('Error', e.message || 'Terjadi kesalahan', 'error');
        }
    } finally {
        form.value.loading = false;
    }
};
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

        <!-- foto_depan -->
        <div>
            <Label for="foto_depan" class="block font-medium">Foto Depan</Label>
            <InputText id="foto_depan" type="file" @change="e => onFileChange(e, 'foto_depan')" accept="image/*"
                class="w-full" />
            <p v-if="form.errors.foto_depan" class="text-red-600 text-sm">{{ form.errors.foto_depan }}</p>
        </div>

        <!-- foto_sisi_kiri -->
        <div>
            <Label for="foto_sisi_kiri" class="block font-medium">Foto Sisi Kiri</Label>
            <input id="foto_sisi_kiri" type="file" @change="e => onFileChange(e, 'foto_sisi_kiri')" accept="image/*"
                class="w-full" />
            <p v-if="form.errors.foto_sisi_kiri" class="text-red-600 text-sm">{{ form.errors.foto_sisi_kiri }}</p>
        </div>

        <!-- foto_sisi_kanan -->
        <div>
            <Label for="foto_sisi_kanan" class="block font-medium">Foto Sisi Kanan</Label>
            <input id="foto_sisi_kanan" type="file" @change="e => onFileChange(e, 'foto_sisi_kanan')" accept="image/*"
                class="w-full" />
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
            <Label for="foto_lainnya" class="block font-medium">Foto Lainnya (JSON)</Label>
            <textarea id="foto_lainnya" v-model="form.data.foto_lainnya"
                placeholder='Contoh: [{"url":"...","keterangan":"..."}]' class="w-full border rounded p-2"
                rows="4"></textarea>
            <p v-if="form.errors.foto_lainnya" class="text-red-600 text-sm">{{ form.errors.foto_lainnya }}</p>
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
            <Select v-model="form.data[field.key]" :options="statusOptions" show-clear option-label="name" filter
                option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" :placeholder="`Select ${field.label}`"
                class="w-full" :invalid="!!form.errors[field.key]" />
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
                :invalid="!!form.errors.perlengkapan_bangunan" class="w-full border rounded p-2"
                @blur="validateJsonField('perlengkapan_bangunan')" />
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
            <Label for="status_data" class="block font-medium">Status Data</Label>
            <Select v-model="form.data.status_data" id="status_data" class="w-full border rounded p-2">
                <option value="draft">Draft</option>
                <option value="publish">Publish</option>
            </Select>
        </div>

        <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>