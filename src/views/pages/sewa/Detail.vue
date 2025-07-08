<script setup>
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const data = ref({
    object: [],
    pembanding: [],
    pembandings: [],
    tanahs: [],
    elemen_perbandingan: [],
    karakter_fisik: [],
    summary: [],
    conclusions: {},
    final_summary: {},

});
const unitFieldDefinitions = [
    { key: 'unit', label: 'Unit' },
    { key: 'mata_uang', label: 'Mata Uang' },
    { key: 'harga_penawaran', label: 'Harga Penawaran / Transaksi' },
    { key: 'diskon', label: 'Diskon' },
    { key: 'indikasi_sewa_rp', label: 'Indikasi Nilai Sewa sebelum penyesuaian' },
    { key: 'indikasi_sewa_m2_rp', label: 'Indikasi Nilai Sewa sebelum penyesuaian / m²' }
];

const informasiUmumFields = ref([]);
const dataPropertiFields = ref([]);
const dataUnitPerbandinganField = ref([]);

async function onPersenInput(raw_persen, label, pembanding_id, type = 'elemen_perbandingan') {
    const sewaId = route.params.id;
    try {
        const url = type === 'elemen_perbandingan' ? `/sewa/${sewaId}/penyesuaian/elemen-perbandingan` : `/sewa/${sewaId}/penyesuaian/karakter-fisik`;
        await AuthApi.client().put(url, {
            label,
            raw_persen,
            pembanding_id
        });
    } catch (err) {
        console.error("Failed to save persen:", err);
    } finally {
        await loadSewaDetail(sewaId);
    }
}

function getValue(obj, key) {
    return obj?.[key] ?? '-'
}


const route = useRoute();

async function loadSewaDetail(id) {
    const res = await AuthApi.client().get(`/sewa/${id}`)

    if (res.data.success) {
        const resData = res.data.data
        console.log(resData.conclusions)

        data.value = {
            object: [
                1
            ],
            pembanding: resData.pembandings || [],
            pembandings: resData.pembandings || [],
            tanahs: resData.tanahs || [],
            elemen_perbandingan: resData.elemen_perbandingan || [],
            karakter_fisik: resData.karakter_fisik || [],
            summary: resData.summary || [],
            conclusions: resData.conclusions || {},
            final_summary: resData.final_summary || {}
        }
    }
}

async function loadElementPerbandingan(id) {
    const res = await AuthApi.client().get(`/findElemenPerbandingan/${id}`)

    const resData = res.data
    console.log(resData)
    data.value = {
        ...data.value,
        elemen_perbandingan: resData || [],
    }
    console.log("M", data.value.elemen_perbandingan);
}

onBeforeMount(async () => {
    if (route.params.id) {
        const dataUnitPerbandingan = await Helper.getDataById('getDataUnitPerbandingan', route.params.id);
        const dataInformasiUmum = await Helper.getDataById('getInformasiUmum', route.params.id);
        const dataProperti = await Helper.getDataById('getDataProperti', route.params.id);
        informasiUmumFields.value = dataInformasiUmum;
        dataPropertiFields.value = dataProperti;
        dataUnitPerbandinganField.value = dataUnitPerbandingan;
    }
});
onMounted(() => {
    loadSewaDetail(route.params.id)
})

</script>
<template>
    <div class="overflow-auto">
        <table class="min-w-full border border-gray-300 text-sm dark:border-gray-600">
            <thead>
                <tr class="bg-gray-100 dark:bg-gray-800 text-left">
                    <th class="p-2 border dark:border-gray-600 dark:text-white">DESKRIPSI</th>
                    <th v-for="(obj, index) in data.tanahs" :key="'object-' + index"
                        class="p-2 border dark:border-gray-600 dark:text-white" colspan="3">
                        OBJEK PENILAIAN {{ index + 1 }}
                    </th>

                    <th v-for="(pb, index) in data.pembandings" :key="'pembanding-' + index"
                        class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="4">
                        DATA PEMBANDING {{ index + 1 }}
                    </th>
                </tr>

            </thead>

            <tbody>
                <!-- Baris Foto -->
                <tr class="h-32 text-center">
                    <td class="border p-2 align-top dark:border-gray-600 dark:text-white">Foto</td>
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
                <tr v-for="(field, index) in unitFieldDefinitions" :key="'unit-field-' + index">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>
                    <template v-for="(pb, idx) in data.tanahs" :key="'unit-pb-' + field.key + '-' + idx">
                        <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ getValue(pb, field.key) || '-' }}
                        </td>
                    </template>
                    <template v-for="(pb, idx) in data.pembandings" :key="'unit-pb-' + field.key + '-' + idx">
                        <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ getValue(pb.unit_perbandingan, field.key) || '-' }}
                        </td>
                    </template>
                </tr>


                <!-- Table Header -->
                <tr class="bg-gray-200 dark:bg-gray-700 text-center text-sm">
                    <th class="p-2 border dark:border-gray-600 dark:text-white">ELEMEN PERBANDINGAN</th>

                    <!-- Dynamic Object Headers (2 columns each) -->
                    <template v-for="(_, objIdx) in data.elemen_perbandingan[0].items[0].objects"
                        :key="'obj-head-' + objIdx">
                        <th class="p-2 border dark:border-gray-600 dark:text-white">Keterangan</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">Deskripsi</th>
                    </template>

                    <!-- Dynamic Pembanding Headers (3 columns each) -->
                    <template v-for="(_, pbIdx) in data.elemen_perbandingan[0].items[0].pembanding"
                        :key="'pb-head-' + pbIdx">
                        <th class="p-2 border dark:border-gray-600 dark:text-white">Deskripsi</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white">(%)</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white">RAW</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white">+/- Penyesuaian (Rp)</th>
                    </template>
                </tr>

                <!-- Table Body -->
                <template v-for="group in data.elemen_perbandingan" :key="group.kategori">
                    <tr class="bg-gray-200 dark:bg-gray-700 font-semibold">
                        <td :colspan="4 + group.items[0].objects.length * 3 + group.items[0].pembanding.length * 3"
                            class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                            {{ group.kategori }}
                        </td>
                    </tr>

                    <tr v-for="item in group.items" :key="item.label">
                        <td class="p-2 border dark:border-gray-600 dark:text-white align-top">{{ item.label }}</td>

                        <!-- Multiple Object Columns -->
                        <template v-for="(obj, objIdx) in item.objects" :key="'obj-' + objIdx">
                            <td class="p-2 border dark:border-gray-600 dark:text-white align-top">{{ obj.keterangan }}
                            </td>
                            <td class="p-2 border dark:border-gray-600 dark:text-white align-top" colspan="2">{{
                                obj.deskripsi }}
                            </td>
                        </template>

                        <!-- Flat Pembanding Columns -->
                        <template v-for="(pb, pbIdx) in item.pembanding" :key="'pb-' + pbIdx">
                            <td class="p-2 border dark:border-gray-600 dark:text-white align-top">{{ pb.deskripsi }}
                            </td>
                            <td class="p-2 border dark:border-gray-600 dark:text-white align-top">{{ pb.persen }}</td>
                            <input type="number" step="0.01" class="w-full bg-transparent text-right outline-none"
                                v-model.number="pb.raw_persen"
                                @change="onPersenInput(pb.raw_persen, item.label, pb.pembanding_id)" />
                            <td class="p-2 border dark:border-gray-600 dark:text-white align-top">{{ pb.penyesuaian }}
                            </td>
                        </template>
                    </tr>
                </template>

                <!-- Table Header -->
                <tr class="bg-gray-200 dark:bg-gray-700 text-center text-sm">
                    <th class="p-2 border dark:border-gray-600 dark:text-white">KARAKTER FISIK</th>

                    <!-- Dynamic Object Headers (2 columns each) -->
                    <template v-for="(_, objIdx) in data.karakter_fisik[0].items[0].objects"
                        :key="'obj-head-' + objIdx">
                        <th class="p-2 border dark:border-gray-600 dark:text-white">Keterangan</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">Deskripsi</th>
                    </template>

                    <!-- Dynamic Pembanding Headers (3 columns each) -->
                    <template v-for="(_, pbIdx) in data.karakter_fisik[0].items[0].pembanding"
                        :key="'pb-head-' + pbIdx">
                        <th class="p-2 border dark:border-gray-600 dark:text-white">Deskripsi</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white">(%)</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white">RAW</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white">+/- Penyesuaian (Rp)</th>
                    </template>
                </tr>

                <!-- Table Body -->
                <template v-for="k in data.karakter_fisik" :key="k.kategori">
                    <tr class="bg-gray-200 dark:bg-gray-700 font-semibold">
                        <td :colspan="4 + k.items[0].objects.length * 3 + k.items[0].pembanding.length * 3"
                            class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                            {{ k.kategori }}
                        </td>
                    </tr>

                    <tr v-for="item in k.items" :key="item.label">
                        <td class="p-2 border dark:border-gray-600 dark:text-white align-top">{{ item.label }}</td>

                        <!-- Multiple Object Columns -->
                        <template v-for="(obj, objIdx) in item.objects" :key="'obj-' + objIdx">
                            <td class="p-2 border dark:border-gray-600 dark:text-white align-top">{{ obj.keterangan }}
                            </td>
                            <td class="p-2 border dark:border-gray-600 dark:text-white align-top" colspan="2">{{
                                obj.deskripsi }}
                            </td>
                        </template>

                        <!-- Flat Pembanding Columns -->
                        <template v-for="(pb, pbIdx) in item.pembanding" :key="'pb-' + pbIdx">
                            <td class="p-2 border dark:border-gray-600 dark:text-white align-top">{{ pb.deskripsi }}
                            </td>
                            <td class="p-2 border dark:border-gray-600 dark:text-white align-top">{{ pb.persen }}</td>
                            <!-- 🆕 Editable raw_persen field -->
                            <td class="p-2 border dark:border-gray-600 dark:text-white align-top">
                                <input type="number" step="0.01" class="w-full bg-transparent text-right outline-none"
                                    v-model.number="pb.raw_persen"
                                    @change="onPersenInput(pb.raw_persen, item.label, pb.pembanding_id, 'karakter_fisik')" />
                            </td>
                            <td class="p-2 border dark:border-gray-600 dark:text-white align-top">{{ pb.penyesuaian }}
                            </td>
                        </template>
                    </tr>
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