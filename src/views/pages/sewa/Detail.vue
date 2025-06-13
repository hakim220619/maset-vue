<script setup>
import { AuthApi } from '@/service/Api';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';


const data = ref({
    object: null,
    pembanding: null
})
const informasiUmumFields = [
    {
        label: 'Alamat',
        key: 'alamat',
        items: [
            {
                keterangan: 'Lokasi strategis',
                object: 'Jl. Sudirman No. 1',
                pembanding1: 'Jl. Melati No. 2',
                pembanding2: 'Jl. Kenanga No. 3'
            }
        ]
    },
    {
        label: 'Koordinat',
        key: 'koordinat',
        items: [
            {
                keterangan: 'GPS',
                object: '-6.200, 106.816',
                pembanding1: '-6.201, 106.817',
                pembanding2: '-6.202, 106.818'
            }
        ]
    },
    {
        label: 'Sumber Informasi',
        key: 'sumber_informasi',
        items: [
            {
                keterangan: 'Informasi agen',
                object: 'Bpk. Agus',
                pembanding1: 'Ibu Rina',
                pembanding2: 'Pak Hadi'
            }
        ]
    },
    // Tambahkan field lain sesuai kebutuhan
]


const dataPropertiFields = [
    {
        label: 'Tahun Bangun',
        key: 'tahun_bangun',
        items: [
            {
                keterangan: 'Tahun dibangunnya properti',
                object: '2015',
                pembanding1: '2010',
                pembanding2: '2012'
            }
        ]
    },
    {
        label: 'Tahun Renovasi',
        key: 'tahun_renovasi',
        items: [
            {
                keterangan: 'Tahun terakhir renovasi',
                object: '2020',
                pembanding1: '2018',
                pembanding2: '2019'
            }
        ]
    },
    // ... lanjutkan field lainnya
]

const unitPerbandinganFields = [
    {
        label: 'Unit',
        key: 'unit',
        items: [
            {
                keterangan: 'Jenis unit properti',
                object: 'Ruko',
                pembanding1: 'Ruko',
                pembanding2: 'Ruko'
            }
        ]
    },
    {
        label: 'Mata Uang',
        key: 'mata_uang',
        items: [
            {
                keterangan: 'Jenis mata uang yang digunakan',
                object: 'IDR',
                pembanding1: 'IDR',
                pembanding2: 'IDR'
            }
        ]
    },
    {
        label: 'Harga Penawaran / Transaksi',
        key: 'tipe_penawaran',
        items: [
            {
                keterangan: 'Harga sebelum negosiasi',
                object: 'Rp 1.000.000',
                pembanding1: 'Rp 950.000',
                pembanding2: 'Rp 975.000'
            }
        ]
    },
    {
        label: 'Diskon',
        key: 'diskon',
        items: [
            {
                keterangan: 'Potongan harga sewa',
                object: '10%',
                pembanding1: '5%',
                pembanding2: '7%'
            }
        ]
    },
    {
        label: 'Indikasi Nilai Sewa sebelum penyesuaian',
        key: 'bentuk',
        items: [
            {
                keterangan: 'Nilai sebelum faktor koreksi',
                object: 'Rp 900.000',
                pembanding1: 'Rp 902.000',
                pembanding2: 'Rp 895.000'
            }
        ]
    },
    {
        label: 'Indikasi Nilai Sewa sebelum penyesuaian / m²',
        key: 'elevasi',
        items: [
            {
                keterangan: 'Nilai sewa per meter persegi',
                object: 'Rp 90.000/m²',
                pembanding1: 'Rp 88.000/m²',
                pembanding2: 'Rp 89.500/m²'
            }
        ]
    },
]

const elemenPerbandinganFields = [
    {
        kategori: 'Faktor Lokasi',
        items: [
            {
                label: 'Akses Jalan',
                keterangan: 'Akses utama',
                object: 'Dekat jalan raya',
                pembanding1: {
                    deskripsi: 'Gang kecil',
                    persen: '-5%',
                    penyesuaian: '-Rp 10.000'
                },
                pembanding2: {
                    deskripsi: 'Dekat jalan besar',
                    persen: '0%',
                    penyesuaian: 'Rp 0'
                }
            },
            {
                label: 'Lingkungan',
                keterangan: 'Kawasan perumahan',
                object: 'Asri dan tenang',
                pembanding1: {
                    deskripsi: 'Dekat pasar',
                    persen: '-3%',
                    penyesuaian: '-Rp 5.000'
                },
                pembanding2: {
                    deskripsi: 'Tenang dan aman',
                    persen: '0%',
                    penyesuaian: 'Rp 0'
                }
            }
        ]
    },
    {
        kategori: 'Faktor Fisik',
        items: [
            {
                label: 'Kondisi Bangunan',
                keterangan: 'Bagus',
                object: 'Bangunan baru',
                pembanding1: {
                    deskripsi: 'Perlu renovasi',
                    persen: '-10%',
                    penyesuaian: '-Rp 15.000'
                },
                pembanding2: {
                    deskripsi: 'Layak huni',
                    persen: '-2%',
                    penyesuaian: '-Rp 3.000'
                }
            }
        ]
    }
]

const dataPerhitungan = [
    {
        label: 'Jumlah Penyesuaian',
        values: [
            { value: '4,50%<br>Rp28.500' }, // Object
            { value: '-3,67%<br>-Rp23.294' },
            { value: '-4,00%<br>-Rp26.667' },
        ]
    },
    {
        label: 'Indikasi Nilai Sewa Pasar setelah penyesuaian / m²',
        values: [
            { value: 'Rp661.833' },
            { value: 'Rp612.000' },
            { value: 'Rp640.000' }
        ]
    },
    {
        label: 'Total Bobot Absolut',
        values: [
            { value: '4,50%' },
            { value: '3,67%' },
            { value: '4,00%' }
        ]
    },
    {
        label: 'Proporsi',
        values: [
            { value: '37%' },
            { value: '30%' },
            { value: '33%' }
        ]
    },
    {
        label: 'Inverse',
        values: [
            { value: '63%' },
            { value: '70%' },
            { value: '67%' }
        ]
    },
    {
        label: 'Pembobotan Akhir',
        isBold: true,
        values: [
            { value: '32%' },
            { value: '35%' },
            { value: '34%' }
        ]
    }
];

const kesimpulanSewa = {
    pembanding: [
        { label: 'Data 1', bobot: '32%', nilai: 'Rp208.523' },
        { label: 'Data 2', bobot: '35%', nilai: 'Rp213.781' },
        { label: 'Data 3', bobot: '34%', nilai: 'Rp214.795' },
    ],
    hasil: {
        nilaiPerMeter: 'Rp637.098',
        total: 'Rp95.564.726'
    }
}



const route = useRoute();

async function loadSewaDetail(id) {
    const res = await AuthApi.client().get(`/sewa/${id}`)

    if (res.data.success) {
        const resData = res.data.data
        // console.log(resData);

        data.value = {
            object: [
                ...(Array.isArray(resData.tanah_id) ? resData.tanah_id : [resData.tanah_id]).filter(Boolean),
                ...(Array.isArray(resData.bangunan_id) ? resData.bangunan_id : [resData.bangunan_id]).filter(Boolean)
            ],
            pembanding: Array.isArray(resData.pembanding_id)
                ? resData.pembanding_id
                : [resData.pembanding_id].filter(Boolean),
        }

        // console.log(data);
    }
}


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

                    <!-- Kolom dinamis untuk OBJEK PENILAIAN -->
                    <th v-for="(obj, index) in data.object" :key="'object-' + index"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        OBJEK PENILAIAN {{ index + 1 }}
                    </th>

                    <!-- Kolom dinamis untuk DATA PEMBANDING -->
                    <th v-for="(pb, index) in data.pembanding" :key="'pembanding-' + index"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        DATA PEMBANDING {{ index + 1 }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <!-- Baris Foto -->
                <tr class="h-32 text-center">
                    <td class="border p-2 align-top dark:border-gray-600 dark:text-white">Foto</td>

                    <td v-for="(obj, i) in data.object" :key="'foto-object-' + i"
                        class="border p-2 dark:border-gray-600">
                        <img :src="obj?.foto" class="h-24 mx-auto" />
                    </td>

                    <td v-for="(pb, i) in data.pembanding" :key="'foto-pembanding-' + i"
                        class="border p-2 dark:border-gray-600">
                        <img :src="pb?.foto" class="h-24 mx-auto" />
                    </td>
                </tr>

                <!-- INFORMASI UMUM -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="1 + (data.object?.length || 0) + (data.pembanding?.length || 0)">
                        INFORMASI UMUM
                    </td>
                </tr>

                <tr v-for="field in informasiUmumFields" :key="'inf-' + field.key">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <!-- Kolom objek -->
                    <td v-for="(obj, idx) in data.object" :key="'info-obj-' + field.key + '-' + idx"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        <div v-if="field.items?.[0]">
                            <div class="font-medium">{{ field.items[0].keterangan }}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                                {{ field.items[0].object || '-' }}
                            </div>
                        </div>
                        <div v-else>-</div>
                    </td>

                    <!-- Kolom pembanding -->
                    <td v-for="(pb, idx) in data.pembanding" :key="'info-pb-' + field.key + '-' + idx"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        <div v-if="field.items?.[0]">
                            {{ field.items[0][`pembanding${idx + 1}`] || '-' }}
                        </div>
                        <div v-else>-</div>
                    </td>
                </tr>


                <!-- DATA PROPERTI -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="1 + (data.object?.length || 0) + (data.pembanding?.length || 0)">
                        DATA PROPERTI
                    </td>
                </tr>

                <tr v-for="field in dataPropertiFields" :key="'prop-' + field.key">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <!-- Kolom objek -->
                    <td v-for="(obj, idx) in data.object" :key="'prop-obj-' + field.key + '-' + idx"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        <div class="font-medium">{{ field.items?.[0]?.keterangan || '-' }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">{{ field.items?.[0]?.object || '-' }}
                        </div>
                    </td>

                    <!-- Kolom pembanding -->
                    <td v-for="(pb, idx) in data.pembanding" :key="'prop-pb-' + field.key + '-' + idx"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        {{ field.items?.[0]?.[`pembanding${idx + 1}`] || '-' }}
                    </td>
                </tr>

                <!-- UNIT PERBANDINGAN -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="1 + (data.object?.length || 0) + (data.pembanding?.length || 0)">
                        UNIT PERBANDINGAN
                    </td>
                </tr>

                <tr v-for="field in unitPerbandinganFields" :key="'prop-' + field.key">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <!-- Kolom objek -->
                    <td v-for="(obj, idx) in data.object" :key="'prop-obj-' + field.key + '-' + idx"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        <div class="font-medium">{{ field.items?.[0]?.keterangan || '-' }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">{{ field.items?.[0]?.object || '-' }}
                        </div>
                    </td>

                    <!-- Kolom pembanding -->
                    <td v-for="(pb, idx) in data.pembanding" :key="'prop-pb-' + field.key + '-' + idx"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        {{ field.items?.[0]?.[`pembanding${idx + 1}`] || '-' }}
                    </td>
                </tr>
                <!-- ELEMEN PERBANDINGAN -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold text-sm">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">ELEMEN PERBANDINGAN</td>

                    <!-- Header Objek Penilaian -->
                    <td v-for="(obj, i) in data.object" :key="'elemen-obj-header-' + i"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        Objek Penilaian {{ i + 1 }}:<br />
                        <span class="text-gray-400 dark:text-gray-300 font-normal">Keterangan, Deskripsi</span>
                    </td>

                    <!-- Header Pembanding -->
                    <td v-for="(pb, i) in data.pembanding" :key="'elemen-pb-header-' + i"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        Data Pembanding {{ i + 1 }}:<br />
                        <span class="text-gray-400 dark:text-gray-300 font-normal">Deskripsi, (%) Penyesuaian, ±
                            Penyesuaian (Rp)</span>
                    </td>
                </tr>

                <!-- Loop Kategori dan Item -->
                <template v-for="group in elemenPerbandinganFields" :key="group.kategori">
                    <!-- Kategori -->
                    <tr class="bg-gray-200 dark:bg-gray-800 font-semibold">
                        <td :colspan="1 + (data.object?.length || 0) + (data.pembanding?.length || 0)"
                            class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ group.kategori }}
                        </td>
                    </tr>

                    <!-- Item per Elemen -->
                    <tr v-for="item in group.items" :key="item.label">
                        <td class="p-2 border dark:border-gray-600 dark:text-white">{{ item.label }}</td>

                        <!-- Data Objek -->
                        <td v-for="(obj, i) in data.object" :key="'elemen-obj-' + item.label + '-' + i"
                            class="p-2 border dark:border-gray-600 dark:text-white">
                            <div class="font-medium">{{ item.keterangan }}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">{{ item.object }}</div>
                        </td>

                        <!-- Data Pembanding -->
                        <td v-for="(pb, i) in data.pembanding" :key="'elemen-pb-' + item.label + '-' + i"
                            class="p-2 border dark:border-gray-600 dark:text-white">
                            <div>{{ item[`pembanding${i + 1}`]?.deskripsi || '-' }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-300">
                                {{ item[`pembanding${i + 1}`]?.persen || '-' }} |
                                {{ item[`pembanding${i + 1}`]?.penyesuaian || '-' }}
                            </div>
                        </td>
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
                    <th v-for="(pb, index) in data.pembanding" :key="'pembanding-' + index"
                        class="p-2 border dark:border-gray-600 dark:text-white">
                        DATA PEMBANDING {{ index + 1 }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in dataPerhitungan" :key="'row-' + index">
                    <td class="border p-2 dark:border-gray-600 dark:text-white font-semibold"
                        :class="{ 'font-semibold': row.isBold }">
                        {{ row.label }}
                    </td>

                    <td v-for="(cell, i) in row.values" :key="'val-' + i"
                        class="border p-2 dark:border-gray-600 text-center" :class="{ 'font-semibold': row.isBold }"
                        v-html="cell.value">
                    </td>
                </tr>
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
            <tbody>
                <tr v-for="(item, index) in kesimpulanSewa.pembanding" :key="'kesimpulan-' + index">
                    <td class="border p-2 dark:border-gray-600 dark:text-white">{{ item.label }}</td>
                    <td class="border p-2 dark:border-gray-600 text-center">{{ item.bobot }}</td>
                    <td class="border p-2 dark:border-gray-600 text-right">{{ item.nilai }}</td>
                </tr>

                <!-- Baris Kesimpulan -->
                <tr class="bg-gray-50 dark:bg-gray-700 font-semibold">
                    <td class="border p-2 dark:border-gray-600 dark:text-white" colspan="2">
                        Indikasi Nilai Sewa Pasar / m²
                    </td>
                    <td class="border p-2 dark:border-gray-600 text-right">{{ kesimpulanSewa.hasil.nilaiPerMeter }}</td>
                </tr>
                <tr class="bg-gray-50 dark:bg-gray-700 font-semibold">
                    <td class="border p-2 dark:border-gray-600 dark:text-white" colspan="2">
                        Indikasi Nilai Sewa Pasar
                    </td>
                    <td class="border p-2 dark:border-gray-600 text-right">{{ kesimpulanSewa.hasil.total }}</td>
                </tr>
            </tbody>

        </table>
        <br>
        <table class="min-w-full border border-gray-300 text-sm mt-4 text-center">
            <tbody>
                <tr>
                    <td class="border p-2 text-left font-semibold  text-white">Deviasi:</td>
                    <td class="border p-2 font-semibold">8,14%</td>
                    <td class="border p-2 font-bold align-middle" rowspan="3">OK !!!</td>
                </tr>
                <tr>
                    <td class="border p-2 text-left  text-white">Min</td>
                    <td class="border p-2">Rp612.000</td>
                </tr>
                <tr>
                    <td class="border p-2 text-left  text-white">Max</td>
                    <td class="border p-2">Rp661.833</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>