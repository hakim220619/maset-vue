<script setup>
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const data = ref();
const filters = ref();
const swal = inject('$swal');
const isRedirect = ref(false);
const firstRowIndex = ref(0);
const rows = ref(10);

const loading = ref(true);
const router = useRouter();

const fetchUsers = async () => {
    try {
        const response = await AuthApi.client().get('/users');
        const allUsers = getUsers(response.data.data);

        const { rs_name, role_structure } = await Helper.getUserLocalStorage();

        if (role_structure !== 1) {
            if ([33, 34, 35].includes(role_structure)) {
                data.value = allUsers.filter(user =>
                    user.rs_name?.toLowerCase().includes(rs_name?.toLowerCase())
                );
            } else {
                data.value = allUsers.filter(user =>
                    user.role_structure === role_structure && user.role_access !== 1
                );
            }
        } else {
            data.value = allUsers;
        }
    } catch (error) {
        console.error('Failed to fetch users:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchUsers();
});
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

    };
};

initFilters();

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const clearFilter = () => {
    initFilters();
};

const getUsers = (data) => {
    return [...(data || [])].map((d) => {
        d.date = new Date(d.date);
        return d;
    });
};



const items = [
    {
        label: 'Ubah',
        command: (e) => {
            router.push({ name: 'Users-edit', params: { id: e.item.data.id } });
        }
    },
    {
        label: 'Hapus',
        command: (e) => {
            destroy(e.item.data.id, e.item.data.name);
        }
    }
];


const destroy = (id, name) => {
    swal.mixin({
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
                const response = await AuthApi.client().delete('users/' + id);

                if (response.data.success) {
                    swal.fire({
                        title: 'Success',
                        text: 'Menu Management deleted successfully',
                        icon: 'success'
                    });

                    fetchUsers();
                }
            }
        });
};


const add = () => {
    router.push('/pages/users/create');
    isRedirect.value = true;
};

</script>


<template>
    <div class="flex items-center justify-between flex-wrap">
        <h2 class="text-3xl text-slate-700 font-semibold leading-3 w-full md:w-auto dark:text-white"></h2>

        <ButtonGroup class="w-full md:w-auto flex justify-between mt-4 md:mt-0">

            <Button label="Export" icon="pi pi-upload" @click="exportExcel" :loading="isExport"
                class="w-full md:w-auto mb-2 md:mb-0" />
            <Button label="Create" icon="pi pi-plus" @click="add" class="w-full md:w-auto mb-2 md:mb-0" />
        </ButtonGroup>
    </div>

    <div class="mt-4">
        <div class="card space-y-4 mt-2 p-4 rounded-lg shadow-md bg-white dark:bg-gray-900">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-5">

                <!-- Total Users -->
                <div class="p-4 bg-white rounded-lg shadow dark:bg-gray-800 flex items-center">
                    <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <svg class="w-6 h-6 text-gray-600 dark:text-white" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13 0A4 4 0 0015 9h-1a3 3 0 00-6 0H7a4 4 0 00-3 3.13M12 14h.01" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm text-gray-500 dark:text-gray-300">Total Users</div>
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ data?.length || 0 }}</div>
                    </div>
                </div>

                <!-- Active Users -->
                <div class="p-4 bg-white rounded-lg shadow dark:bg-gray-800 flex items-center">
                    <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                        <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm text-gray-500 dark:text-gray-300">Active Users</div>
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                            {{data?.filter(user => user.status_name === 'ACTIVE').length || 0}}
                        </div>
                    </div>
                </div>

                <!-- Inactive Users -->
                <div class="p-4 bg-white rounded-lg shadow dark:bg-gray-800 flex items-center">
                    <div class="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                        <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm text-gray-500 dark:text-gray-300">Inactive Users</div>
                        <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                            {{data?.filter(user => user.status_name === 'INACTIVE').length || 0}}
                        </div>
                    </div>
                </div>

                <!-- Suspended Users -->
                <div class="p-4 bg-white rounded-lg shadow dark:bg-gray-800 flex items-center">
                    <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                        <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm text-gray-500 dark:text-gray-300">Suspended Users</div>
                        <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {{data?.filter(user => user.status_name === 'SUSPENDED').length || 0}}
                        </div>
                    </div>
                </div>

                <!-- Verification Users -->
                <div class="p-4 bg-white rounded-lg shadow dark:bg-gray-800 flex items-center">
                    <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 0 3 2 3 2-1.896 2-3zM12 15h0" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm text-gray-500 dark:text-gray-300">Verification Users</div>
                        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {{data?.filter(user => user.status_name === 'VERIFICATION').length || 0}}
                        </div>
                    </div>
                </div>

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
                <template #loading> Loading data data. Please wait. </template>
                <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
                <Column field="no" header="No" style="min-width: 6rem">
                    <template #body="{ index }">
                        {{ firstRowIndex + index + 1 }}
                    </template>
                </Column>


                <Column field="nik" sortable header="NIK" style="min-width: 12rem">
                    <template #body="{ data }">{{ data.nik }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Search by NIK" />
                    </template>
                </Column>

                <Column field="name" sortable header="User" style="min-width: 12rem">
                    <template #body="{ data }">{{ data.name }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                    </template>
                </Column>

                <Column field="email" sortable header="Email" style="min-width: 12rem">
                    <template #body="{ data }">{{ data.email }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Search by Email" />
                    </template>
                </Column>

                <Column field="rs_name" sortable header="Role Structure" style="min-width: 20rem">
                    <template #body="{ data }">{{ data.rs_name }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Search by Role Structure" />
                    </template>
                </Column>

                <Column field="ra_name" sortable header="Role Access" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.ra_name }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Search by Role Access" />
                    </template>
                </Column>

                <Column field="role_name" sortable header="Role Users" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.role_name }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Search by Role Users" />
                    </template>
                </Column>

                <Column field="contact" sortable header="Contact" style="min-width: 12rem">
                    <template #body="{ data }">{{ data.contact }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Search by Contact" />
                    </template>
                </Column>

                <Column field="status" sortable header="Status" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Tag :value="Helper.getStatusLabel(data.status)"
                            :severity="Helper.getStatusSeverity(data.status)" />
                    </template>
                    <template #filter="{ filterModel }">
                        <Dropdown v-model="filterModel.value" :options="statusOptions" placeholder="Filter Status"
                            optionLabel="label" optionValue="value" />
                    </template>
                </Column>


                <Column header="Action">
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
