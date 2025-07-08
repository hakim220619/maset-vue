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
    object_id: { value: '', matchMode: 'contains' },
    pembanding_id: { value: '', matchMode: 'contains' },
    created_at: { value: '', matchMode: 'contains' }
});

const search = ref({
    object_id: '',
    pembanding_id: ''
});

async function getSewaData() {
    isFiltering.value = true;
    const params = Helper.formatSearchParams(search.value);
    try {
        const response = await AuthApi.client().get('/sewa/?' + new URLSearchParams(params));
        const filteredData = response.data.data;
        const sortedData = filteredData.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
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
        label: 'Detail',
        command: (e) => {
            router.push({ name: 'Pasar Detail', params: { id: e.item.data.id } });
        }
    },
    {
        label: 'Ubah',
        command: (e) => {
            router.push({ name: 'Pasar Edit', params: { id: e.item.data.id } });
        }
    },
    {
        label: 'Hapus',
        command: (e) => {
            destroy(e.item.data.id);
        }
    }
];

const destroy = (id) => {
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
            text: `Apakah anda yakin ingin menghapus data sewa ini?`,
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus Data!'
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                const response = await AuthApi.client().delete('/sewa/' + id);
                if (response.data.success) {
                    swal.fire({
                        title: 'Success',
                        text: 'Data sewa berhasil dihapus',
                        icon: 'success'
                    });
                    getSewaData();
                }
            }
        });
};

const exportExcel = async () => {
    const params = Helper.formatSearchParams(search.value);
    await Helper.exportExcelFromApi('gateway/idp/sewa/export', 'sewa.xlsx', params);
};

const add = () => {
    router.push('/pages/pasar/create');
    isRedirect.value = true;
};

onMounted(() => {
    getSewaData();
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
        <div class="card space-y-4 mt-2 p-4 rounded-lg shadow-md">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatusCard label="Total Sewa" :value="data?.length || 0" iconBg="bg-gray-100 dark:bg-gray-700"
                    valueColor="text-gray-900 dark:text-white" />
            </div>
        </div>

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
                <template #loading> Memuat data. Mohon tunggu... </template>

                <Column field="no" header="No" style="min-width: 6rem">
                    <template #body="{ index }">
                        {{ firstRowIndex + index + 1 }}
                    </template>
                </Column>

                <Column field="object" sortable header="Object" style="min-width: 12rem">
                    <template #body="{ data }">{{ JSON.stringify(data.object).replace(/"/g, '') }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" placeholder="Cari Object ID" />
                    </template>
                </Column>

                <Column field="pembanding" sortable header="Pembanding" style="min-width: 12rem">
                    <template #body="{ data }">{{ JSON.stringify(data.pembanding).replace(/"/g, '') }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" placeholder="Cari Pembanding ID" />
                    </template>
                </Column>


                <Column field="created_at" sortable header="Created At" style="min-width: 14rem">
                    <template #body="{ data }">{{ new Date(data.created_at).toLocaleString() }}</template>
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
