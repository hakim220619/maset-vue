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
    role_name: { value: '', matchMode: 'contains' },
    role_status: { value: null, matchMode: 'equals' },
    role_created_at: { value: '', matchMode: 'contains' }
});

const search = ref({
    role_name: '',
    role_status: null
});

const statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' }
];

async function getRole() {
    isFiltering.value = true;
    const params = Helper.formatSearchParams(search.value);
    try {
        const response = await AuthApi.client().get('/role/?' + new URLSearchParams(params));
        const filteredData = response.data.data;
        const sortedData = filteredData.sort((a, b) => {
            return new Date(b.role_created_at) - new Date(a.role_created_at);
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
            router.push({ name: 'role-edit', params: { id: e.item.data.role_id } });
        }
    },
    {
        label: 'Hapus',
        command: (e) => {
            destroy(e.item.data.role_id, e.item.data.role_name);
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
                const response = await AuthApi.client().delete('role/' + id);
                if (response.data.success) {
                    swal.fire({
                        title: 'Success',
                        text: 'Role deleted successfully',
                        icon: 'success'
                    });
                    getRole();
                }
            }
        });
};

const exportExcel = async () => {
    const params = Helper.formatSearchParams(search.value);
    await Helper.exportExcelFromApi('gateway/idp/role/export', 'role.xlsx', params);
};

const add = () => {
    router.push('/pages/role/create');
    isRedirect.value = true;
};

onMounted(() => {
    getRole();
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
                <StatusCard label="Total Role" :value="data?.length || 0" iconBg="bg-gray-100 dark:bg-gray-700"
                    valueColor="text-gray-900 dark:text-white">
                    <template #icon>
                        <svg class="w-6 h-6 text-gray-600 dark:text-white" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13 0A4 4 0 0015 9h-1a3 3 0 00-6 0H7a4 4 0 00-3 3.13M12 14h.01" />
                        </svg>
                    </template>
                </StatusCard>

                <StatusCard label="Active Role" :value="data?.filter(row => row.role_status === 1).length || 0"
                    iconBg="bg-green-100 dark:bg-green-900" valueColor="text-green-600 dark:text-green-400">
                    <template #icon>
                        <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </template>
                </StatusCard>

                <StatusCard label="Inactive Role" :value="data?.filter(row => row.role_status === 2).length || 0"
                    iconBg="bg-red-100 dark:bg-red-900" valueColor="text-red-600 dark:text-red-400">
                    <template #icon>
                        <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </template>
                </StatusCard>
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
                <template #empty> No data found. </template>
                <template #loading> Loading data. Please wait. </template>

                <Column field="no" header="No" style="min-width: 6rem">
                    <template #body="{ index }">{{ index + 1 }}</template>
                </Column>

                <Column field="role_name" sortable header="Role Name" style="min-width: 12rem">
                    <template #body="{ data }">{{ data.role_name }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" placeholder="Search by Role Name" />
                    </template>
                </Column>

                <Column field="role_status" sortable header="Status" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Tag :value="Helper.getStatusLabel(data.role_status)"
                            :severity="Helper.getStatusSeverity(data.role_status)" />
                    </template>
                    <template #filter="{ filterModel }">
                        <Dropdown v-model="filterModel.value" :options="statusOptions" placeholder="Filter Status"
                            optionLabel="label" optionValue="value" />
                    </template>
                </Column>

                <Column field="role_created_at" sortable header="Created At" style="min-width: 14rem">
                    <template #body="{ data }">{{ new Date(data.role_created_at).toLocaleString() }}</template>
                </Column>

                <Column>
                    <template #body="{ data }">
                        <div class="flex gap-1 justify-end">
                            <DropdownButton :items="items" :data="data" :menu-key="data.role_id" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

    </div>
</template>
