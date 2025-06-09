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
    nama_bangunan: { value: '', matchMode: 'contains' }
});

const search = ref({
    nama_bangunan: ''
});

async function getBangunanData() {
    isFiltering.value = true;
    const params = Helper.formatSearchParams(search.value);
    try {
        const response = await AuthApi.client().get('/bangunan/?' + new URLSearchParams(params));
        const filteredData = response.data.data;
        const sortedData = filteredData.sort((a, b) => {
            return new Date(b.tahun_dibangun) - new Date(a.tahun_dibangun);
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
            destroy(e.item.data.id, e.item.data.nama_bangunan);
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

                <Column field="nama_bangunan" sortable header="Nama Bangunan" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.nama_bangunan }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" placeholder="Cari Nama Bangunan" />
                    </template>
                </Column>

                <Column field="bentuk_bangunan" header="Bentuk" style="min-width: 10rem">
                    <template #body="{ data }">{{ data.bentuk_bangunan }}</template>
                </Column>

                <Column field="grade_gudang" header="Grade" style="min-width: 8rem">
                    <template #body="{ data }">{{ data.grade_gudang }}</template>
                </Column>

                <Column field="jumlah_lantai" header="Lantai" style="min-width: 8rem">
                    <template #body="{ data }">{{ data.jumlah_lantai }}</template>
                </Column>

                <Column field="basement" header="Basement" style="min-width: 8rem">
                    <template #body="{ data }">{{ data.basement ? 'Ya' : 'Tidak' }}</template>
                </Column>

                <Column field="tahun_dibangun" header="Tahun Dibangun" style="min-width: 10rem">
                    <template #body="{ data }">{{ data.tahun_dibangun }}</template>
                </Column>

                <Column field="tahun_renovasi" header="Tahun Renovasi" style="min-width: 10rem">
                    <template #body="{ data }">{{ data.tahun_renovasi }}</template>
                </Column>

                <Column field="kondisi_visual" header="Kondisi" style="min-width: 10rem">
                    <template #body="{ data }">{{ data.kondisi_visual }}</template>
                </Column>

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
