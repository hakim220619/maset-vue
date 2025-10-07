<script setup>
import DropdownButton from '@/components/DropdownButton.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const swal = inject('$swal');
const router = useRouter();

const data = ref([]);
const visible = ref(false);
const isFiltering = ref(false);
const isExport = ref(false);
const isRedirect = ref(false);
const firstRowIndex = ref(0);
const rows = ref(10);
const loading = ref(true);

const filters = ref({
    global: { value: '', matchMode: 'contains' },
    judul_penilaian: { value: '', matchMode: 'contains' },
    tanggal_penilaian: { value: '', matchMode: 'contains' }
});

const search = ref({
    judul_penilaian: ''
});

async function getBangunanData() {
    isFiltering.value = true;
    const params = Helper.formatSearchParams(search.value);
    try {
        const response = await AuthApi.client().get('/bangunan/?' + new URLSearchParams(params));
        const filteredData = response.data.data;
        const sortedData = filteredData.sort((a, b) => {
            return new Date(b.tanggal_penilaian) - new Date(a.tanggal_penilaian);
        });
        data.value = sortedData;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

const items = [
    {
        label: 'Ubah',
        command: (e) => {
            router.push({ name: 'Bangunan Edit', params: { id: e.item.data.id } });
        }
    },
    {
        label: 'Hapus',
        command: (e) => {
            destroy(e.item.data.id, e.item.data.judul_penilaian);
        }
    }
];

const destroy = (id, name) => {
    swal
        .mixin({
            customClass: {
                confirmButton: 'p-button p-component p-button-danger !mr-2',
                cancelButton: 'p-button p-component p-button-secondary'
            },
            buttonsStyling: false
        })
        .fire({
            icon: 'warning',
            title: 'Peringatan',
            text: `Apakah anda yakin ingin menghapus data ${name}?`,
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus Data!'
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                const response = await AuthApi.client().delete('bangunan/' + id);
                console.log(response);

                if (response.data.success) {
                    swal.fire({
                        title: 'Success',
                        text: 'Data bangunan berhasil dihapus',
                        icon: 'success'
                    });
                    getBangunanData();
                }
            }
        });
};

const exportExcel = async () => {
    const params = Helper.formatSearchParams(search.value);
    await Helper.exportExcelFromApi('gateway/idp/bangunan/export', 'bangunan.xlsx', params);
};

const add = () => {
    router.push('/pages/object/bangunan/create');
    isRedirect.value = true;
};

onMounted(() => {
    getBangunanData();
});
</script>

<template>
    <div class="flex items-center justify-between flex-wrap">
        <p></p>
        <ButtonGroup class="w-full md:w-auto flex justify-between mt-4 md:mt-0">
            <Button label="Export" icon="pi pi-upload" @click="exportExcel" :loading="isExport"
                class="w-full md:w-auto mb-2 md:mb-0" />
            <Button label="Create" icon="pi pi-plus" @click="add" class="w-full md:w-auto mb-2 md:mb-0" />
        </ButtonGroup>
    </div>

    <div class="mt-4">
        <div class="card mt-4">
            <DataTable ref="dt" :value="data" dataKey="id" :paginator="true" v-model:first="firstRowIndex"
                v-model:rows="rows" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[10, 20, 50]" currentPageReportTemplate="{first} to {last} of {totalRecords}">
                <template #header>
                    <div class="flex justify-between">
                        <p></p>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </IconField>
                    </div>
                </template>
                <template #empty> Tidak ada data ditemukan. </template>
                <template #loading> Memuat data, mohon tunggu... </template>

                <Column field="no" header="No" style="min-width: 6rem">
                    <template #body="{ index }">
                        {{ firstRowIndex + index + 1 }}
                    </template>
                </Column>

                <Column field="judul_penilaian" sortable header="Judul Penilaian" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.judul_penilaian }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" placeholder="Cari Judul Penilaian" />
                    </template>
                </Column>

                <Column field="object_type" sortable header="Tipe Object" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.object_type }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" placeholder="Cari Tipe Object" />
                    </template>
                </Column>

                <Column field="nama_entitas" sortable header="Nama Entitas" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.nama_entitas }}</template>
                </Column>

                <Column field="tanggal_inspeksi" sortable header="Tanggal Inspeksi" style="min-width: 14rem">
                    <template #body="{ data }">{{ new Date(data.tanggal_inspeksi).toLocaleDateString() }}</template>
                </Column>

                <Column field="tanggal_penilaian" sortable header="Tanggal Penilaian" style="min-width: 14rem">
                    <template #body="{ data }">{{ new Date(data.tanggal_penilaian).toLocaleDateString() }}</template>
                </Column>

                <Column field="penilai_surveyor" header="Penilai / Surveyor" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.penilai_surveyor }}</template>
                </Column>

                <Column field="batas_utara" header="Batas Utara" style="min-width: 14rem" />
                <Column field="batas_selatan" header="Batas Selatan" style="min-width: 14rem" />
                <Column field="batas_timur" header="Batas Timur" style="min-width: 14rem" />
                <Column field="batas_barat" header="Batas Barat" style="min-width: 14rem" />

                <Column>
                    <template #body="{ data }">
                        <div class="flex gap-1 justify-end">
                            <DropdownButton :items="items" :data="data" :menu-key="data.id" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
