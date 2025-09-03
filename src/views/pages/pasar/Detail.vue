<script setup>
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const data = ref({
    pasar: [],
    object: [],
    pembanding: [],
    pembandings: [],
    tanahs: [],
    elemen_perbandingan: [],
    lokasi: [],
    karakter_fisik: [],
    summary: [],
    conclusions: {},
    final_summary: {},

});
var judulPenilaianDataAsset = ref(null);
var judulPenilaianDataPembanding1 = ref(null);
var judulPenilaianDataPembanding2 = ref(null);
var judulPenilaianDataPembanding3 = ref(null);

const dataEstimasiBangunan = ref([]);
const informasiUmumFields = ref([]);
const dataPropertiFields = ref([]);
const dataTransaksiFields = ref([]);
const dataUnitPerbandinganField = ref([]);
const dataUmurEkonomis = ref([])
const dataJenisBangunan = ref([])
const bangunanOptions = ref([])
const pembandingOptions = ref([])

const defaultUmurEkonomis = ref(10)

async function onPersenInput(raw_persen, label, pembanding_id, type = 'elemen_perbandingan') {
    const PasarId = route.params.id;   // 👈 get it here
    try {
        const url = type === 'elemen_perbandingan' ? `/pasar/${PasarId}/penyesuaian/elemen-perbandingan` : `/pasar/${PasarId}/penyesuaian/karakter-fisik`;
        await AuthApi.client().put(url, {
            label,
            raw_persen,
            pembanding_id
        });
        // this.$toast.success("Tersimpan!");
    } catch (err) {
        console.error("Failed to save persen:", err);
        // Optional user feedback
        // this.$toast.error("Gagal menyimpan…");
    } finally {
        // Optionally, you can reload the data or show a success message
        this.loadPasarDetail(PasarId);
    }
}

function getValue(obj, key) {
    return obj?.[key] ?? '-'
}


const route = useRoute();

async function loadPasarDetail(id) {
    const res = await AuthApi.client().get(`/pasar/${id}`)

    if (res.data.success) {
        const resData = res.data.data
        judulPenilaianDataAsset = resData.tanahs?.[0]?.judul_penilaian
        judulPenilaianDataPembanding1 = resData.pembandings?.[0]?.jenis_property
        judulPenilaianDataPembanding2 = resData.pembandings?.[1]?.jenis_property
        judulPenilaianDataPembanding3 = resData.pembandings?.[2]?.jenis_property

        data.value = {
            object: [
                1
            ],
            pasar: resData.pasar || [],
            pembanding: resData.pembandings || [],
            pembandings: resData.pembandings || [],
            tanahs: resData.tanahs || [],
            elemen_perbandingan: resData.elemen_perbandingan || [],
            lokasi: resData.lokasi || [],
            karakter_fisik: resData.karakter_fisik || [],
            summary: resData.summary || [],
            conclusions: resData.conclusions || {},
            final_summary: resData.final_summary || {}
        }
    }
}


async function getMasterJenisBangunan() {
    const res = await AuthApi.client().get(`/getMasterJenisBangunan`)
    dataJenisBangunan.value = res.data.data

    // Grouping berdasarkan type
    const grouped = {}
    dataJenisBangunan.value.forEach(item => {
        if (!grouped[item.type]) {
            grouped[item.type] = {
                label: item.type,
                code: item.type, // bisa juga bikin kode singkat kalau mau
                items: []
            }
        }
        grouped[item.type].items.push({
            label: item.name,
            value: item.id,
            tahun: item.tahun
        })
    })

    pembandingOptions.value = Object.values(grouped)
}
const selectedTahun = ref([]);
const kondisiFisikValues = ref([]);
const keusanganFungsionalValues = ref([]);
const keusanganEkonomisValues = ref([]);

const onDataChange = async (fieldKey, selectedValue, idx, pbId) => {
    try {
        if (fieldKey === "jenis_bangunan") {
            let tahun = null;
            for (const group of pembandingOptions.value) {
                const found = group.items.find(i => i.value === selectedValue);
                if (found) {
                    tahun = found.tahun;
                    break;
                }
            }

            selectedTahun.value[idx] = tahun || null;

            dataEstimasiBangunan.value.forEach(field => {
                if (!field.items[0]) field.items[0] = {};
                if (field.label === "Jenis Bangunan") {
                    field.items[0]['pembandingjbangunan' + (idx + 1)] = selectedValue;
                }
                if (field.label === "Umur Ekonomis") {
                    field.items[0]['umur_ekonomis' + (idx + 1)] = tahun || '-';
                }
            });

        } else if (fieldKey === "kondisi_fisik_bangunan") {
            let value = parseFloat(selectedValue.value) || 0;
            if (value > 100) value = 100;
            if (value < 0) value = 0;
            kondisiFisikValues.value[idx] = value;

        } else if (fieldKey === "keusangan_fungsional") {
            let value = parseFloat(selectedValue.value) || 0;
            if (value > 100) value = 100;
            if (value < 0) value = 0;
            keusanganFungsionalValues.value[idx] = value;

        } else if (fieldKey === "keusangan_ekonomis") {
            let value = parseFloat(selectedValue.value) || 0;
            if (value > 100) value = 100;
            if (value < 0) value = 0;
            keusanganEkonomisValues.value[idx] = value;
        }

        // bikin query dinamis untuk API
        const PasarId = route.params.id;
        const query = data.value.pembandings
            .map((pb, i) => {
                const tahun = selectedTahun.value[i] ?? null;
                const kfisik = kondisiFisikValues.value[i] ?? null;
                const kfungsional = keusanganFungsionalValues.value[i] ?? null;
                const kekonomis = keusanganEkonomisValues.value[i] ?? null;

                if (pb?.id && (tahun !== null || kfisik !== null || kfungsional !== null || kekonomis !== null)) {
                    return `pembanding_id=${pb.id}&tahun=${tahun ?? ""}&kfisik=${kfisik ?? ""}&kfungsional=${kfungsional ?? ""}&kekonomis=${kekonomis ?? ""}&list_data=${i + 1}`;
                }
                return null;
            })
            .filter(Boolean)
            .join("&");


        if (query) {
            const res = await AuthApi.client().get(
                `/getDataEstimasiBangunanPasar/${PasarId}?${query}`
            );

            if (res.data.success) {
                const newData = res.data.data;
                dataEstimasiBangunan.value = newData.map((newField, i) => {
                    const oldField = dataEstimasiBangunan.value[i] || { items: [{}] };
                    return {
                        ...newField,
                        items: [{
                            ...oldField.items?.[0],
                            ...newField.items?.[0],
                        }]
                    };
                });
            }
        }

    } catch (err) {
        console.error("Error load data estimasi bangunan:", err);
    }
};


onMounted(async () => {

    if (route.params.id) {
        await getMasterJenisBangunan();
        await loadPasarDetail(route.params.id);
        if (data.value.pembandings && data.value.pembandings.length > 0) {
            selectedTahun.value = Array(data.value.pembandings.length).fill(null);
        }

        const dataUnitPerbandingan = await Helper.getDataById('getDataUnitPerbandinganPasar', route.params.id);
        const dataTransaksi = await Helper.getDataById('getDataTransaksiPasar', route.params.id);
        const dataInformasiUmum = await Helper.getDataById('getInformasiUmumPasar', route.params.id);
        const dataProperti = await Helper.getDataById('getDataPropertiPasar', route.params.id);
        const EstimasiBangunan = await Helper.getDataById(
            'getDataEstimasiBangunanPasar',
            route.params.id,
            selectedTahun.value ? { tahun_id: selectedTahun.value } : {}
        );

        informasiUmumFields.value = dataInformasiUmum;
        dataTransaksiFields.value = dataTransaksi;
        dataPropertiFields.value = dataProperti;
        dataUnitPerbandinganField.value = dataUnitPerbandingan;
        dataEstimasiBangunan.value = EstimasiBangunan;

        // ✅ Set default value setelah pembandingOptions sudah ada
        dataEstimasiBangunan.value.forEach(field => {
            if (!field.items[0]) field.items[0] = {};
            data.value.pembandings.forEach((_, idx) => {
                const key = 'pembanding' + (idx + 1);
                if (!(key in field.items[0])) {
                    field.items[0][key] = null;  // set default supaya reactive
                }
            });
        });

    }
});

function formatDate(dateStr) {
    if (!dateStr) return '-'
    const options = { day: '2-digit', month: 'long', year: 'numeric' }
    return new Date(dateStr).toLocaleDateString('id-ID', options)
}


watch(
    [() => pembandingOptions.value, () => dataEstimasiBangunan.value],
    ([newOptions, newEstimasi]) => {
        if (!newEstimasi || newOptions.length === 0) return;

        newEstimasi.forEach((field) => {
            // Hanya untuk field tertentu
            if (
                ["Keusangan Fungsional", "Keusangan Ekonomis", "Kondisi Fisik Bangunan (Visual)"].includes(field.label)
            ) {
                if (field.items?.[0]) {
                    data.value.pembandings.forEach((_, idxx) => {
                        const key = "pembandings" + (idxx + 1);

                        // default dari pembandingOptions atau 0
                        if (!field.items[0][key]) {
                            field.items[0][key] = newOptions[0]?.value ?? 0;
                        }
                    });
                }
            }
        });
    },
    { deep: true, immediate: true }
);



</script>

<template>
    <div class="max-w-3xl ml-0 space-y-6">
        <!-- Card 1 -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 space-y-4 w-96">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">Jenis Penilaian</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300">Nilai Pasar</p>

            <div class="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
                <!-- ID Data Aset -->
                <p v-if="data.tanahs.length" class="text-sm text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Nomor ID Data Aset:</span> {{ data.tanahs[0].judul_penilaian }}
                </p>

                <!-- Loop ID Data Pembanding -->
                <p v-for="(pembanding, index) in data.pembandings" :key="pembanding.id"
                    class="text-sm text-gray-700 dark:text-gray-300">
                    <span class="font-medium">
                        Nomor ID Data Pembanding {{ index + 1 }}:
                    </span>
                    {{ pembanding.jenis_property }}
                </p>
            </div>
        </div>



        <!-- Card 2 -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 space-y-5">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Judul Penilaian</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">
                Penilaian Nilai Pasar Tempat Usaha
            </p>

            <div class="border-t border-gray-200 dark:border-gray-600 pt-5 space-y-3" v-if="data.tanahs.length">
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Nama Entitas:</span> {{ data.tanahs[0].nama_entitas }}
                </p>
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Tanggal Inspeksi:</span> {{ formatDate(data.tanahs[0].tanggal_inspeksi) }}
                </p>
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Tanggal Penilaian:</span> {{ formatDate(data.tanahs[0].tanggal_penilaian)
                    }}
                </p>
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Penilai / Surveyor:</span> {{ data.tanahs[0].penilai }}
                </p>
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Tahun Penilaian:</span> {{ data.tanahs[0].tahun_penilaian }}
                </p>
            </div>
        </div>

    </div>
    <br><br>
    <div class="overflow-auto">

        <table class="min-w-full border border-gray-300 text-sm dark:border-gray-600">
            <thead>
                <tr class="h-32 text-center">
                    <td class="border p-2  dark:border-gray-600 dark:text-white">Foto</td>
                    <template v-for="(obj, i) in data.tanahs" :key="'foto-object-' + i">
                        <td colspan="3" class="border p-2 dark:border-gray-600">
                            <img :src="obj?.foto_foto" class="h-24 mx-auto" />
                        </td>
                    </template>
                    <template v-for="(pb, i) in data.pembanding" :key="'foto-pembanding-' + i">
                        <td colspan="4" class="border p-2 dark:border-gray-600">
                            <img :src="pb?.foto" class="h-24 mx-auto" />
                        </td>
                    </template>
                </tr>

            </thead>

            <tbody>
                <!-- Baris Foto -->
                <!-- <tr class="h-32 text-center">
                    <td class="border p-2  dark:border-gray-600 dark:text-white">Foto</td>
                    <template v-for="(obj, i) in data.tanahs" :key="'foto-object-' + i">
                        <td colspan="3" class="border p-2 dark:border-gray-600">
                            <img :src="obj?.foto_foto" class="h-24 mx-auto" />
                        </td>
                    </template>
                    <template v-for="(pb, i) in data.pembanding" :key="'foto-pembanding-' + i">
                        <td colspan="4" class="border p-2 dark:border-gray-600">
                            <img :src="pb?.foto" class="h-24 mx-auto" />
                        </td>
                    </template>
                </tr> -->

                <!-- INFORMASI UMUM -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="5 + (data.object.tanahs * 2) + (data.pembanding.length * 3)">
                        INFORMASI UMUM
                    </td>
                </tr>
                <tr v-for="field in informasiUmumFields" :key="'inf-' + field.key">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <template v-for="(pb, idx) in data.tanahs" :key="'info-tanah-' + field.key + '-' + idx">
                        <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                            <div v-if="field.items?.[0]">
                                {{ getValue(pb, field.key) || '-' }}
                            </div>
                            <div v-else>-</div>
                        </td>
                    </template>
                    <template v-for="(pb, idx) in data.pembanding" :key="'info-pb-' + field.key + '-' + idx">
                        <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                            <div v-if="field.items?.[0]">
                                {{ field.items[0][`pembanding${idx + 1}`] || '-' }}
                            </div>
                            <div v-else>-</div>
                        </td>
                    </template>
                </tr>

                <!-- DATA PROPERTI -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="5 + (data.object.length * 2) + (data.pembanding.length * 3)">
                        DATA TRANSAKSI
                    </td>
                </tr>
                <tr v-for="field in dataTransaksiFields" :key="'prop-' + field.key">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <template v-for="(pb, idx) in data.tanahs" :key="'tanah-pb-' + field.key + '-' + idx">
                        <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ getValue(pb, field.key) || '-' }}
                        </td>
                    </template>
                    <template v-for="(pb, idx) in data.pembanding" :key="'prop-pb-' + field.key + '-' + idx">
                        <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ field.items?.[0]?.[`pembanding${idx + 1}`] || '-' }}
                        </td>
                    </template>
                </tr>
                <!-- DATA PROPERTI -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="5 + (data.object.length * 2) + (data.pembanding.length * 3)">
                        DATA PROPERTI
                    </td>
                </tr>
                <tr v-for="field in dataPropertiFields" :key="'prop-' + field.key">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <template v-for="(pb, idx) in data.tanahs" :key="'tanah-pb-' + field.key + '-' + idx">
                        <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ getValue(pb, field.key) || '-' }}
                        </td>
                    </template>
                    <template v-for="(pb, idx) in data.pembanding" :key="'prop-pb-' + field.key + '-' + idx">
                        <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ field.items?.[0]?.[`pembanding${idx + 1}`] || '-' }}
                        </td>
                    </template>
                </tr>
                <!-- UNIT PERBANDINGAN -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="5 + (data.object.length * 2) + (data.pembanding.length * 3)">
                        UNIT PERBANDINGAN
                    </td>
                </tr>
                <tr v-for="(field, index) in dataUnitPerbandinganField" :key="'unit-field-' + index">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <!-- Data objek tanah/bangunan -->
                    <template v-for="(item, idx) in field.items" :key="'obj-' + index + '-' + idx">
                        <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ item.object || '-' }}
                        </td>
                    </template>

                    <!-- Data pembanding -->
                    <template v-for="(pb, idx) in data.pembandings" :key="'pb-' + index + '-' + idx">
                        <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ field.items[0]['pembanding' + (idx + 1)] || '-' }}
                        </td>
                    </template>
                </tr>


                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="5 + (data.object.length * 2) + (data.pembanding.length * 3)">
                        ESTIMASI BANGUNAN
                    </td>
                </tr>
                <tr v-for="(field, index) in dataEstimasiBangunan" :key="'unit-field-' + index">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <!-- Loop tanah -->
                    <template v-for="(pb, idx) in data.tanahs" :key="'unit-pb-' + field.key + '-' + idx">
                        <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">

                            <template>
                                {{ getValue(pb, field.key) || '-' }}
                            </template>
                        </td>
                    </template>

                    <!-- Loop pembanding -->
                    <template v-for="(pb, idx) in data.pembandings" :key="'pb-' + idx">
                        <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                            <!-- Jenis Bangunan -->
                            <template v-if="field.label === 'Jenis Bangunan'">
                                <Select v-model="field.items[0]['pembandingjbangunan' + (idx + 1)]"
                                    :options="pembandingOptions" optionGroupLabel="label" optionGroupChildren="items"
                                    optionLabel="label" optionValue="value" placeholder="Pilih Jenis Bangunan"
                                    class="w-full" @change="e => onDataChange('jenis_bangunan', e.value, idx, pb.id)" />
                            </template>

                            <!-- Umur Ekonomis -->
                            <template v-else-if="field.label === 'Umur Ekonomis'">
                                {{ field.items[0]?.['umur_ekonomis' + (idx + 1)] || '-' }}
                            </template>

                            <!-- Kondisi Fisik Bangunan (Visual) -->
                            <template v-else-if="field.label === 'Kondisi Fisik Bangunan (Visual)'">
                                <InputNumber v-model="field.items[0]['kondisi_fisik_bangunan' + (idx + 1)]"
                                    class="w-full" :min="0" :max="100" :useGrouping="false" placeholder="Isi angka (%)"
                                    @input="val => onDataChange('kondisi_fisik_bangunan', val, idx, pb.id)" />
                            </template>


                            <!-- Keusangan Fungsional -->
                            <template v-else-if="field.label === 'Keusangan Fungsional'">
                                <InputNumber v-model="field.items[0]['pembandings' + (idx + 1)]" class="w-full" :min="0"
                                    :max="100" :useGrouping="false" placeholder="Isi angka (%)"
                                    @input="val => onDataChange('keusangan_fungsional', val, idx, pb.id)" />
                            </template>

                            <!-- Keusangan Ekonomis -->
                            <template v-else-if="field.label === 'Keusangan Ekonomis'">
                                <InputNumber v-model="field.items[0]['pembandings' + (idx + 1)]" class="w-full" :min="0"
                                    :max="100" :useGrouping="false" placeholder="Isi angka (%)"
                                    @input="val => onDataChange('keusangan_ekonomis', val, idx, pb.id)" />
                            </template>

                            <!-- Default fallback -->
                            <template v-else>
                                {{ field.items[0]?.['pembanding' + (idx + 1)] || '-' }}
                            </template>
                        </td>
                    </template>




                </tr>



                <!-- Table Header -->

                <!-- Header Elemen Perbandingan -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="1 + (data.object.length * 0) + (data.pembanding.length * 0)">
                        ELEMEN PERBANDINGAN
                    </td>
                    <!-- Dynamic Object Headers (2 columns each) -->
                    <template v-for="(_, objIdx) in data.elemen_perbandingan?.[0]?.items?.[0]?.objects || []"
                        :key="'obj-head-' + objIdx">
                        <th class="p-2 border dark:border-gray-600 dark:text-white">Keterangan</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">Deskripsi</th>
                    </template>

                    <!-- Dynamic Pembanding Headers (3 columns each) -->
                    <template v-for="(_, pbIdx) in data.elemen_perbandingan?.[0]?.items?.[0]?.pembanding || []"
                        :key="'pb-head-' + pbIdx">
                        <th class="p-2 border dark:border-gray-600 dark:text-white" colspan="1">Deskripsi</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white" colspan="1">(%)</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">+/- Penyesuaian (Rp)
                        </th>
                    </template>
                </tr>

                <template v-for="group in data.elemen_perbandingan" :key="group.kategori">
                    <template v-for="item in group.items" :key="item.label">
                        <!-- Baris utama -->
                        <tr>
                            <!-- Label -->
                            <td class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ item.label }}
                            </td>

                            <!-- Objects -->
                            <template v-for="(obj, objIdx) in item.objects" :key="'obj-' + objIdx">
                                <td class="p-2 border dark:border-gray-600 dark:text-white">
                                    {{ obj.keterangan }}
                                </td>
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ obj.deskripsi }}
                                </td>
                            </template>

                            <!-- Pembanding -->
                            <template v-for="(pb, pbIdx) in item.pembanding" :key="'pb-' + pbIdx">
                                <!-- Kiri -->
                                <td class="p-2 border dark:border-gray-600 dark:text-white">
                                    {{ pb.deskripsi || '-' }}
                                </td>

                                <!-- Input angka -->
                                <td class="p-2 border dark:border-gray-600">
                                    <input type="number" step="0.01" class="w-full border rounded p-1"
                                        v-model.number="pb.raw_persen"
                                        @input="onPersenInput(pb.raw_persen, item.label, pb.pembanding_id, 'karakter_fisik')" />
                                </td>

                                <!-- Kanan -->
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ pb.penyesuaian || '-' }}
                                </td>
                            </template>
                        </tr>

                        <!-- Baris tambahan dengan sekat lurus -->
                        <tr>
                            <!-- Label kosong -->
                            <td class="p-2 border dark:border-gray-600 dark:text-white">&nbsp;</td>

                            <!-- Objects kosong -->
                            <template v-for="(obj, objIdx) in item.objects" :key="'obj-empty-' + objIdx">
                                <td class="p-2 border dark:border-gray-600 dark:text-white">&nbsp;</td>
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">&nbsp;</td>
                            </template>

                            <!-- Pembanding kosong -->
                            <template v-for="(pb, pbIdx) in item.pembanding" :key="'pb-empty-' + pbIdx">
                                <td class="p-2 border dark:border-gray-600 dark:text-white">&nbsp;</td>
                                <td class="p-2 border dark:border-gray-600">&nbsp;</td>
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">&nbsp;</td>
                            </template>
                        </tr>
                    </template>
                </template>

                <!-- Table Header -->
                <template v-for="k in data.lokasi" :key="k.kategori">
                    <!-- Header kategori -->
                    <tr class="bg-gray-200 dark:bg-gray-700 font-semibold">
                        <td :colspan="5 + (k.items[0].objects.length * 2) + (k.items[0].pembanding.length * 3)"
                            class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ k.kategori }}
                        </td>
                    </tr>

                    <!-- Baris isi -->
                    <template v-for="item in k.items" :key="item.label">
                        <!-- Baris utama -->
                        <tr>
                            <!-- Label -->
                            <td class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ item.label }}
                            </td>

                            <!-- Objects -->
                            <template v-for="(obj, objIdx) in item.objects" :key="'obj-' + objIdx">
                                <td class="p-2 border dark:border-gray-600 dark:text-white">
                                    {{ obj.keterangan }}
                                </td>
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ obj.deskripsi }}
                                </td>
                            </template>

                            <!-- Pembanding -->
                            <template v-for="(pb, pbIdx) in item.pembanding" :key="'pb-' + pbIdx">
                                <!-- kiri 2 kolom -->
                                <td class="p-2 border dark:border-gray-600 dark:text-white">
                                    {{ pb.deskripsi || '-' }}
                                </td>
                                <td class="p-2 border dark:border-gray-600 dark:text-white text-center">
                                    <input type="number" step="0.01" class="w-full border rounded p-1"
                                        v-model.number="pb.raw_persen"
                                        @input="onPersenInput(pb.raw_persen, item.label, pb.pembanding_id, 'karakter_fisik')" />
                                </td>


                                <!-- kanan 2 kolom -->
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ pb.penyesuaian || '-' }}
                                </td>
                            </template>
                        </tr>

                        <!-- Baris input -->
                        <tr>
                            <!-- Label kosong -->
                            <td class="p-2 border dark:border-gray-600 dark:text-white">&nbsp;</td>

                            <!-- Objects kosong -->
                            <template v-for="(obj, objIdx) in item.objects" :key="'obj-empty-' + objIdx">
                                <td class="p-2 border dark:border-gray-600 dark:text-white">&nbsp;</td>
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">&nbsp;</td>
                            </template>

                            <!-- Pembanding input -->
                            <template v-for="(pb, pbIdx) in item.pembanding" :key="'pb-input-' + pbIdx">
                                <td class="p-2 border dark:border-gray-600 dark:text-white">&nbsp;</td>
                                <!-- tengah 1 kolom -->
                                <td class="p-2 border dark:border-gray-600 dark:text-white text-center">
                                    {{ pb.persen || '-' }}
                                </td>
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">&nbsp;</td>
                            </template>
                        </tr>
                    </template>
                </template>

            </tbody>
        </table>

        <br><br>
        <table class="min-w-full border border-gray-300 text-sm dark:border-gray-600">
            <thead>
                <tr class="bg-gray-100 dark:bg-gray-800 text-left">
                    <th class="p-2 border dark:border-gray-600 dark:text-white">DESKRIPSI</th>

                    <!-- Kolom dinamis untuk OBJEK PENILAIAN -->
                    <th v-for="(obj, index) in data.object" :key="'object-' + index"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        OBJEK PENILAIAN {{ index + 1 }}
                    </th>


                    <!-- Kolom dinamis untuk DATA PEMBANDING -->
                    <th v-for="(pb, index) in data.pembandings" :key="'pembanding-' + index"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        DATA PEMBANDING {{ index + 1 }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <!-- <tr v-for="(row, index) in dataPerhitungan" :key="'row-' + index">
                    <td class="border p-2 dark:border-gray-600 dark:text-white font-semibold"
                        :class="{ 'font-semibold': row.isBold }">
                        {{ row.label }}
                    </td>

                    <td v-for="(cell, i) in row.values" :key="'val-' + i"
                        class="border p-2 dark:border-gray-600 text-center" :class="{ 'font-semibold': row.isBold }"
                        v-html="cell.value">
                    </td>
                </tr> -->
                <template v-for="group in data.summary" :key="group.kategori">
                    <tr v-for="item in group.items" :key="item.label">
                        <td class="border p-2 dark:border-gray-600 dark:text-white font-semibold">{{ item.label }}
                        </td>
                        <td v-for="(cell, i) in item.objects" :key="'val-' + i"
                            class="border p-2 dark:border-gray-600 text-center">
                            <div>
                                <span class="block">{{ cell.penyesuaian }}</span>
                                <span class="block" v-if="cell.persen != ''">{{ cell.persen }}</span>
                            </div>
                        </td>
                        <td v-for="(cell, i) in item.pembanding" :key="'val-' + i"
                            class="border p-2 dark:border-gray-600 text-center">
                            <div>
                                <span class="block">{{ cell.penyesuaian }}</span>
                                <span class="block" v-if="cell.persen != ''">{{ cell.persen }}</span>
                            </div>
                        </td>
                    </tr>
                </template>

            </tbody>

        </table>

        <table class="min-w-full mt-6 border border-gray-300 text-sm dark:border-gray-600">
            <thead>
                <tr class="bg-gray-100 dark:bg-gray-800">
                    <th colspan="3" class="p-2 border text-center font-semibold dark:border-gray-600 dark:text-white">
                        Kesimpulan Nilai
                    </th>
                </tr>
                <tr class="bg-gray-100 text-center dark:bg-gray-800 text-left">
                    <th class="p-2 border dark:border-gray-600 dark:text-white">Data Pembanding</th>
                    <th class="p-2 border dark:border-gray-600 dark:text-white">Bobot</th>
                    <th class="p-2 border dark:border-gray-600 dark:text-white">Nilai</th>
                </tr>
            </thead>
            <tbody v-if="data.conclusions">
                <tr v-for="(item, index) in data.conclusions?.items?.pembanding" :key="'kesimpulan-' + index">
                    <td class="border p-2 dark:border-gray-600 dark:text-white">{{ item.label }}</td>
                    <td class="border p-2 dark:border-gray-600 text-center">{{ item.bobot }}</td>
                    <td class="border p-2 dark:border-gray-600 text-right">{{ item.value }}</td>
                </tr>

                <tr class="bg-gray-50 dark:bg-gray-700 font-semibold">
                    <td class="border p-2 dark:border-gray-600 dark:text-white" colspan="2">
                        Indikasi Nilai Sewa Pasar / m²
                    </td>
                    <td class="border p-2 dark:border-gray-600 text-right">
                        {{ data.conclusions?.indikasi_nilai_m2 }}
                    </td>
                </tr>
                <tr class="bg-gray-50 dark:bg-gray-700 font-semibold">
                    <td class="border p-2 dark:border-gray-600 dark:text-white" colspan="2">
                        Indikasi Nilai Sewa Pasar
                    </td>
                    <td class="border p-2 dark:border-gray-600 text-right">
                        {{ data.conclusions?.indikasi_nilai }}
                    </td>
                </tr>

            </tbody>
        </table>

        <br>
        <table v-if="data.final_summary" class="min-w-full border border-gray-300 text-sm mt-4 text-center">
            <tbody>
                <tr>
                    <td class="border p-2 text-left font-semibold dark:text-white">Deviasi:</td>
                    <td class="border p-2 dark:text-white font-semibold">{{ data.final_summary.deviasi }}</td>
                    <td class="border p-2 font-bold align-middle dark:text-white" rowspan="3">
                        {{ data.final_summary.status }}
                    </td>
                </tr>
                <tr>
                    <td class="border p-2 text-left dark:text-white">Min</td>
                    <td class="border p-2">{{ data.final_summary.min }}</td>
                </tr>
                <tr>
                    <td class="border p-2 text-left">Max</td>
                    <td class="border p-2">{{ data.final_summary.max }}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>
