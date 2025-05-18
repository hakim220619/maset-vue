<script setup>
import AppConfig from '@/layout/AppConfig.vue';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { computed, ref } from 'vue';


const products = ref(null);
const reports = ref([
    {
        title: 'PT Bank Central Asia Tbk KCU Rungkut -CV',
        adminDate: '2024-12-18 11:18',
        penilaiDate: null,
        reviewerDate: null,
        penilaiPublikDate: null
    },
    {
        title: 'PT Bank Central Asia Tbk KCU Magelang',
        adminDate: '2024-12-18 08:55',
        penilaiDate: '2024-12-18 14:39',
        reviewerDate: null,
        penilaiPublikDate: null
    },
    {
        title: 'PT Telekomunikasi Indonesia Tbk',
        adminDate: '2024-11-10 09:30',
        penilaiDate: '2024-11-11 10:00',
        reviewerDate: '2024-11-12 16:15',
        penilaiPublikDate: null
    },
    {
        title: 'PT Unilever Indonesia Tbk',
        adminDate: '2024-10-05 14:00',
        penilaiDate: null,
        reviewerDate: null,
        penilaiPublikDate: null
    },
    {
        title: 'PT Astra International Tbk',
        adminDate: '2024-12-01 07:45',
        penilaiDate: '2024-12-02 09:00',
        reviewerDate: '2024-12-03 10:30',
        penilaiPublikDate: '2024-12-04 08:15'
    },
    {
        title: 'PT Garuda Indonesia Tbk',
        adminDate: null,
        penilaiDate: null,
        reviewerDate: null,
        penilaiPublikDate: null
    },
    {
        title: 'PT Indofood Sukses Makmur Tbk',
        adminDate: '2024-09-15 12:20',
        penilaiDate: '2024-09-16 14:45',
        reviewerDate: null,
        penilaiPublikDate: null
    },
    {
        title: 'PT Bank Mandiri (Persero) Tbk',
        adminDate: '2024-08-21 11:00',
        penilaiDate: '2024-08-22 13:00',
        reviewerDate: '2024-08-23 15:30',
        penilaiPublikDate: '2024-08-24 09:10'
    },
    {
        title: 'PT Pertamina (Persero)',
        adminDate: '2024-07-10 10:10',
        penilaiDate: null,
        reviewerDate: null,
        penilaiPublikDate: null
    },
    {
        title: 'PT Charoen Pokphand Indonesia Tbk',
        adminDate: '2024-06-30 09:50',
        penilaiDate: '2024-07-01 12:00',
        reviewerDate: '2024-07-02 14:20',
        penilaiPublikDate: null
    }
]);


function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}



const searchForm = ref({
    laporan: '',
    pemberiTugas: '',
    jenisProperti: null,
    tanggalPenilaian: null,
    provinsi: null,
    kabupaten: null,
    kodePos: ''
});

const filteredReports = computed(() => {
    return reports.value.filter((report) => {
        return (
            (!searchForm.value.laporan || report.title.toLowerCase().includes(searchForm.value.laporan.toLowerCase())) &&
            (!searchForm.value.pemberiTugas || report.title.toLowerCase().includes(searchForm.value.pemberiTugas.toLowerCase()))
        );
    });
});

</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 md:col-span-6 lg:col-span-4">
            <div class="p-4 text-white h-24 rounded-border m-0 bg-center bg-cover bg-no-repeat bg-cyan-400"
                style="background-image: url('/demo/images/dashboard/effect-1.svg')">
                <div class="font-bold w-full mb-2">
                    <span>TOTAL OBJEK PENILAIAN</span>
                </div>
                <div class="text-white text-2xl font-bold w-full flex items-center py-1">150 <i
                        class="pi pi-arrow-up ml-2 font-bold"></i></div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-4">
            <div class="p-4 text-white h-24 rounded-border m-0 bg-center bg-cover bg-no-repeat bg-orange-400"
                style="background-image: url('/demo/images/dashboard/effect-2.svg')">
                <div class="font-bold w-full mb-2">
                    <span>TOTAL CLIENT</span>
                </div>
                <div class="text-white text-2xl font-bold w-full flex items-center py-1">532 <i
                        class="pi pi-arrow-up ml-2 font-bold"></i></div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-4">
            <div class="p-4 text-white h-24 rounded-border m-0 bg-center bg-cover bg-no-repeat bg-purple-400"
                style="background-image: url('/demo/images/dashboard/effect-3.svg')">
                <div class="font-bold w-full mb-2">
                    <span>DATA PEMBANDING</span>
                </div>
                <div class="text-white text-2xl font-bold w-full flex items-center py-1">450 <i
                        class="pi pi-arrow-down ml-2 font-bold"></i></div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-12">

            <div class="card mb-4">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-6 lg:col-span-4">
                        <label class="block text-sm font-medium mb-1">Cari Laporan</label>
                        <InputText v-model="searchForm.laporan" placeholder="Cari..." class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6 lg:col-span-4">
                        <label class="block text-sm font-medium mb-1">Cari Pemberi Tugas</label>
                        <InputText v-model="searchForm.pemberiTugas" placeholder="Cari..." class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6 lg:col-span-4">
                        <label class="block text-sm font-medium mb-1">Jenis Properti</label>
                        <Dropdown v-model="searchForm.jenisProperti" :options="['Tanah dan Bangunan', 'Tanah']"
                            placeholder="Pilih Jenis" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6 lg:col-span-4">
                        <label class="block text-sm font-medium mb-1">Tanggal Penilaian</label>
                        <Calendar v-model="searchForm.tanggalPenilaian" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy"
                            class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6 lg:col-span-4">
                        <label class="block text-sm font-medium mb-1">Provinsi</label>
                        <Dropdown v-model="searchForm.provinsi" :options="['Jambi', 'DKI Jakarta']"
                            placeholder="Pilih Provinsi" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6 lg:col-span-4">
                        <label class="block text-sm font-medium mb-1">Kabupaten</label>
                        <Dropdown v-model="searchForm.kabupaten" :options="['Kab. Merangin', 'Kab. Bogor']"
                            placeholder="Pilih Kabupaten" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6 lg:col-span-4">
                        <label class="block text-sm font-medium mb-1">Kode Pos</label>
                        <InputText v-model="searchForm.kodePos" placeholder="Kode Pos" class="w-full" />
                    </div>

                    <div class="col-span-12 flex justify-end">
                        <Button label="Cari" icon="pi pi-search" class="mt-6" />
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-12">
            <div class="card h-full">
                <h5 class="text-lg font-semibold mb-4">Progres Laporan Penilaian</h5>

                <DataTable :value="filteredReports" removableSort tableStyle="min-width: 50rem">
                    <Column field="title" sortable>
                        <template #header>
                            <div
                                class="flex flex-col items-center justify-center text-center text-base font-semibold h-full">
                                Judul Laporan
                            </div>
                        </template>
                    </Column>

                    <Column field="admin">
                        <template #header>
                            <div class="flex justify-center items-center h-full w-full text-center font-semibold">
                                Admin
                            </div>
                        </template>
                        <template #body="slotProps">
                            <div class="flex flex-col items-center justify-center text-center h-full">
                                <i :class="slotProps.data.adminDate
                                    ? 'pi pi-check-circle text-green-500'
                                    : 'pi pi-times-circle text-red-400'"></i>
                                <br />
                                <span v-if="slotProps.data.adminDate">{{ formatDate(slotProps.data.adminDate) }}</span>
                                <span v-else class="text-gray-500 dark:text-white">Belum</span>

                            </div>
                        </template>
                    </Column>


                    <Column field="penilai">
                        <template #header>
                            <div class="flex justify-center items-center h-full w-full text-center font-semibold">
                                Penilai
                            </div>
                        </template>
                        <template #body="slotProps">
                            <div
                                class="flex flex-col items-center justify-center text-center text-base text-gray-800 h-full">
                                <i
                                    :class="slotProps.data.penilaiDate ? 'pi pi-check-circle text-green-500 ' : 'pi pi-times-circle text-red-400'"></i><br>
                                <span v-if="slotProps.data.penilaiDate" class="dark:text-white">{{
                                    formatDate(slotProps.data.penilaiDate)
                                }} </span>
                                <span v-else class="text-gray-500 dark:text-white">Belum</span>

                            </div>
                        </template>
                    </Column>

                    <Column field="reviewer">
                        <template #header>
                            <div class="flex justify-center items-center h-full w-full text-center font-semibold">
                                Reviewer
                            </div>
                        </template>
                        <template #body="slotProps">
                            <div
                                class="flex flex-col items-center justify-center text-center text-base text-gray-800 h-full">
                                <i
                                    :class="slotProps.data.reviewerDate ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-400'"></i><br>
                                <span v-if="slotProps.data.reviewerDate">{{ formatDate(slotProps.data.reviewerDate)
                                    }}</span>
                                <span v-else class="text-gray-500 dark:text-white">Belum</span>

                            </div>
                        </template>
                    </Column>

                    <Column field="penilaiPublik">
                        <template #header>
                            <div class="flex justify-center items-center h-full w-full text-center font-semibold">
                                Penilai Publik
                            </div>
                        </template>
                        <template #body="slotProps">
                            <div
                                class="flex flex-col items-center justify-center text-center text-base text-gray-800 h-full">
                                <i
                                    :class="slotProps.data.penilaiPublikDate ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-400'"></i><br>
                                <span v-if="slotProps.data.penilaiPublikDate">{{
                                    formatDate(slotProps.data.penilaiPublikDate) }}</span>
                                <span v-else class="text-gray-500 dark:text-white">Belum</span>

                            </div>
                        </template>
                    </Column>
                </DataTable>


            </div>
        </div>

    </div>
    <AppConfig />
</template>
