<script setup>
import { AuthApi } from '@/service/Api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const customers = ref();
const filters = ref();

const loading = ref(true);
const router = useRouter();
onMounted(async () => {
    try {
        const response = await AuthApi.client().get('/users');
        const allUsers = getUsers(response.data.data);

        const currentUser = JSON.parse(localStorage.getItem('userData'));

        if (currentUser.role_structure !== 4) {
            if ([32, 33, 34].includes(currentUser.role_structure)) {
                customers.value = allUsers.filter(user =>
                    user.rs_name?.toLowerCase().includes(currentUser.rs_name?.toLowerCase())
                );
            } else {
                customers.value = allUsers.filter(user =>
                    user.role_structure === currentUser.role_structure
                );
            }
        } else {
            customers.value = allUsers;
        }
    } catch (error) {
        console.error('Failed to fetch users:', error);
    } finally {
        loading.value = false;
    }
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
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">

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
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">
                            {{ customers?.length || 0 }}
                        </div>
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
                            {{customers?.filter(user => user.status === 'ACTIVE').length || 0}}
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
                            {{customers?.filter(user => user.status === 'INACTIVE').length || 0}}
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="card mt-5">
            <div class="font-semibold text-xl mb-2">List of Data</div>
            <div class="card mt-4">
                <DataTable v-model:filters="filters" :value="customers" paginator showGridlines :rows="10" dataKey="id"
                    filterDisplay="menu" :loading="loading" :globalFilterFields="['name',]">
                    <template #header>
                        <div class="flex justify-between">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                @click="clearFilter()" />
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                            </IconField>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>

                    <Column field="no" header="No" style="min-width: 6rem">
                        <template #body="{ index }">{{ index + 1 }}</template>
                    </Column>

                    <Column field="nik" header="NIK" style="min-width: 12rem">
                        <template #body="{ data }">{{ data.nik }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" type="text" placeholder="Search by NIK" />
                        </template>
                    </Column>

                    <Column field="name" header="User" style="min-width: 12rem">
                        <template #body="{ data }">{{ data.name }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                        </template>
                    </Column>

                    <Column field="email" header="Email" style="min-width: 12rem">
                        <template #body="{ data }">{{ data.email }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" type="text" placeholder="Search by Email" />
                        </template>
                    </Column>

                    <Column field="rs_name" header="Role Structure" style="min-width: 20rem">
                        <template #body="{ data }">{{ data.rs_name }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" type="text" placeholder="Search by Role Structure" />
                        </template>
                    </Column>

                    <Column field="ra_name" header="Role Access" style="min-width: 14rem">
                        <template #body="{ data }">{{ data.ra_name }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" type="text" placeholder="Search by Role Access" />
                        </template>
                    </Column>

                    <Column field="role_name" header="Role Users" style="min-width: 14rem">
                        <template #body="{ data }">{{ data.role_name }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" type="text" placeholder="Search by Role Users" />
                        </template>
                    </Column>

                    <Column field="contact" header="Contact" style="min-width: 12rem">
                        <template #body="{ data }">{{ data.contact }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" type="text" placeholder="Search by Contact" />
                        </template>
                    </Column>

                    <Column field="status" header="Status" style="min-width: 10rem">
                        <template #body="{ data }">{{ data.status }}</template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" type="text" placeholder="Search by Status" />
                        </template>
                    </Column>

                    <Column field="active" header="Active" style="min-width: 8rem">
                        <template #body="{ data }">
                            <Tag :value="data.active ? 'Active' : 'Inactive'"
                                :severity="data.active ? 'success' : 'danger'" />
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="[true, false]" placeholder="Filter Active"
                                optionLabel="label" optionValue="value">
                                <template #option="{ option }">
                                    {{ option ? 'Active' : 'Inactive' }}
                                </template>
                            </Dropdown>
                        </template>
                    </Column>
                    <Column headerStyle="width: 5rem; text-align: center"
                        bodyStyle="text-align: center; overflow: visible">
                        <template #body>
                            <Button type="button" icon="pi pi-cog" rounded />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
