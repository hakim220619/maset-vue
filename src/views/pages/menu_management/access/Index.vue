<script setup>
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { inject, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const swal = inject('$swal');

const router = useRouter();

const data = ref([]);
const visible = ref(false);
const isFiltering = ref(false);
const isExport = ref(false);
const isRedirect = ref(false);
const showSearchFields = ref(false);
const first = ref(0);
const loading = ref(true);

// ✅ Inisialisasi filters secara lengkap untuk menghindari error reaktif
const filters = reactive({
    global: { value: '', matchMode: 'contains' },
    rs_name: { value: '', matchMode: 'contains' },
    icon: { value: '', matchMode: 'contains' },
    address: { value: '', matchMode: 'contains' },
    order_list: { value: '', matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' }
});

const search = ref({
    name: null,
    address: '',
    is_active: null
});

const activeOptions = [
    { label: 'Select', value: null },
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
];

const statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' }
];

async function getMenuManagement() {
    isFiltering.value = true;
    const params = Helper.formatSearchParams(search.value);
    try {
        const response = await AuthApi.client().get('/role_structure/?' + new URLSearchParams(params));
        console.log(response);

        const filteredData = response.data.data;
        const sortedData = filteredData.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
        });
        data.value = sortedData;

    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

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
                const response = await AuthApi.client().delete('menus/' + id);
                console.log(response);

                if (response.data.success) {
                    swal.fire({
                        title: 'Success',
                        text: 'Menu Management deleted successfully',
                        icon: 'success'
                    });
                    getMenuManagement();
                }
            }
        });
};

const exportExcel = async () => {
    const params = Helper.formatSearchParams(search.value);
    await Helper.exportExcelFromApi('gateway/idp/menu/export', 'menu.xlsx', params);
};

const showDetail = (data) => {

    router.push({
        name: 'menuManagement-access-detail',
        params: { id: data.rs_id }
    });
    isRedirect.value = true;
};



onMounted(() => {
    getMenuManagement();
});
</script>


<template>


    <div class="mt-4">
        <div class="card space-y-4 mt-2 p-4 rounded-lg shadow-md">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <!-- Total Users -->
                <StatusCard label="Total Menu" :value="data?.length || 0" iconBg="bg-gray-100 dark:bg-gray-700"
                    valueColor="text-gray-900 dark:text-white">
                    <template #icon>
                        <svg class="w-6 h-6 text-gray-600 dark:text-white" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13 0A4 4 0 0015 9h-1a3 3 0 00-6 0H7a4 4 0 00-3 3.13M12 14h.01" />
                        </svg>
                    </template>
                </StatusCard>

                <StatusCard label="Active Menu" :value="data?.filter(user => user.status === 1).length || 0"
                    iconBg="bg-green-100 dark:bg-green-900" valueColor="text-green-600 dark:text-green-400">
                    <template #icon>
                        <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </template>
                </StatusCard>

                <StatusCard label="Inactive Menu" :value="data?.filter(user => user.status === 2).length || 0"
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

        <div class="card mt-5">
            <div class="font-semibold text-xl mb-2">List of Data</div>
            <div class="card mt-4">
                <DataTable v-model:filters="filters" :value="data" paginator showGridlines :rows="50" dataKey="id"
                    filterDisplay="menu" :loading="loading" :globalFilterFields="['rs_name', 'icon', 'address']">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <p></p>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-search text-gray-500"></i>
                                <InputText v-model="filters['global'].value" placeholder="Keyword Search"
                                    class="p-inputtext-sm" />
                            </div>
                        </div>
                    </template>

                    <template #empty> No data found. </template>
                    <template #loading> Loading data. Please wait. </template>

                    <Column field="no" header="No" style="width: 1rem">
                        <template #body="{ index }">{{ index + 1 }}</template>
                    </Column>

                    <Column header="Actions" :bodyStyle="{ textAlign: 'center' }" style="width: 1rem;">
                        <template #body="{ data }">
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-info p-button-text"
                                style="width: 2.5rem; height: 2.5rem; font-size: 1.5rem;" @click="showDetail(data)"
                                v-tooltip.top="'View Detail'" />
                        </template>
                    </Column>

                    <Column field="rs_name" sortable header="Role Name" style="min-width: 12rem">
                        <template #body="{ data }">{{ data.rs_name }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" placeholder="Search by Role Name" />
                        </template>
                    </Column>

                    <Column field="rs_status" sortable header="Status" style="min-width: 10rem">
                        <template #body="{ data }">
                            <Tag :value="Helper.getStatusLabel(data.rs_status)"
                                :severity="Helper.getStatusSeverity(data.rs_status)" />
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statusOptions" placeholder="Filter Status"
                                optionLabel="label" optionValue="value" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

    </div>
</template>
