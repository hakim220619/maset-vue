<script setup>
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import _ from 'lodash';
import { inject, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const data = ref([]);
const dataMenuPermission = ref([]);
const loading = ref(false);
const firstRowIndex = ref(0);
const rows = ref(50);

const router = useRouter();
const route = useRoute();
const swal = inject('$swal');

const statusOptions = ref([]);
const roleStructureData = ref([]);
const roleAccessData = ref([]);
const roleData = ref([]);

const filters = ref({
    global: { value: '', matchMode: 'contains' },
});

const form = ref({
    data: {
        role_structure: '',
        role_access: '',
        role: '',
        menu_id: '',
        status: true,
        can_create: false,
        can_read: false,
        can_update: false,
        can_delete: false,
    },
    errors: {
        role_structure: null,
        role_access: null,
        role: null,
        status: null,
    },
    assign: (data = {}) => {
        for (const key in data) {
            if (_.has(form.value.data, key)) {
                const newValue = data[key];
                if (
                    typeof newValue === 'boolean' ||
                    (newValue && typeof newValue === typeof form.value.data[key]) ||
                    (Number.isInteger(newValue) && !isNaN(newValue))
                ) {
                    form.value.data[key] = newValue;
                }
            }
        }
    },
    loading: false,
});

const fetchOptions = async () => {
    try {
        const [statuses] = await Promise.all([Helper.getStatus()]);
        statusOptions.value = statuses;
    } catch (error) {
        console.error('Failed to fetch options:', error);
    }
};

async function getRoleStructure() {
    try {
        const response = await AuthApi.client().get('role_structure/');
        roleStructureData.value = response.data.data;
    } catch (error) {
        console.log(error);
    }
}

async function getRoleAcess() {
    try {
        const response = await AuthApi.client().get('role_access/');
        roleAccessData.value = response.data.data;
    } catch (error) {
        console.log(error);
    }
}

async function getRole() {
    try {
        const response = await AuthApi.client().get('role/');
        roleData.value = response.data.data;
    } catch (error) {
        console.log(error);
    }
}

async function getMenuPermisiionById() {
    try {
        const roleStructureId = route.params.id;

        if (!roleData.value.length) await getRole();
        if (!roleAccessData.value.length) await getRoleAcess();

        const response = await AuthApi.client().get(`/menusByRoleStructure?role_structure_id=${roleStructureId}`);
        const data = response.data.data;
        const grouped = {};

        data.forEach((row) => {
            if (!grouped[row.menu_id]) {
                grouped[row.menu_id] = {
                    menu_id: row.menu_id,
                    name: row.name,
                    order_list: row.order_list,
                    access: false,
                    create: false,
                    read: false,
                    update: false,
                    delete: false,
                    role_id: {},
                    role_access_id: {},
                    role_structure_id: row.role_structure_id,
                };

                roleData.value.forEach((role) => {
                    grouped[row.menu_id].role_id[role.role_id] = false;
                });

                roleAccessData.value.forEach((ra) => {
                    grouped[row.menu_id].role_access_id[ra.ra_id] = false;
                });
            }

            if (row.role_id && grouped[row.menu_id].role_id[row.role_id] !== undefined) {
                grouped[row.menu_id].role_id[row.role_id] = true;
            }

            if (row.role_access_id && grouped[row.menu_id].role_access_id[row.role_access_id] !== undefined) {
                grouped[row.menu_id].role_access_id[row.role_access_id] = true;
            }

            grouped[row.menu_id].access = !!row.can_access;
            grouped[row.menu_id].create = !!row.can_create;
            grouped[row.menu_id].read = !!row.can_read;
            grouped[row.menu_id].update = !!row.can_update;
            grouped[row.menu_id].delete = !!row.can_delete;
        });

        const processedData = Object.values(grouped);
        processedData.forEach((row) => updateAllCheckboxState(row));
        dataMenuPermission.value = reactive(processedData);
    } catch (error) {
        console.error('Error fetching menu permission:', error);
    }
}

onBeforeMount(async () => {
    if (route.params.id) {
        getMenuPermisiionById();
    }
});

onMounted(async () => {
    getRoleStructure();
    getRoleAcess();
    getRole();
    fetchOptions();
});

for (const key in form.value.data) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}

const toggleRowSelectAll = async (row) => {
    const newValue = !(
        row.access &&
        row.create &&
        row.read &&
        row.update &&
        row.delete &&
        Object.values(row.role_id || {}).every(Boolean) &&
        Object.values(row.role_access_id || {}).every(Boolean)
    );

    row.access = newValue;
    row.create = newValue;
    row.read = newValue;
    row.update = newValue;
    row.delete = newValue;

    if (row.role_id && typeof row.role_id === 'object') {
        Object.keys(row.role_id).forEach((key) => {
            row.role_id[key] = newValue;
        });
    }

    if (row.role_access_id && typeof row.role_access_id === 'object') {
        Object.keys(row.role_access_id).forEach((key) => {
            row.role_access_id[key] = newValue;
        });
    }

    row.isAll = newValue;

    // 🔹 Panggil API untuk menyimpan perubahan
    try {
        const payload = {
            menu_id: row.menu_id,
            role_structure_id: row.role_structure_id,
            can_access: row.access,
            can_create: row.create,
            can_read: row.read,
            can_update: row.update,
            can_delete: row.delete,
            roles: row.role_id,
            role_access: row.role_access_id
        };
        const role_structure = Number(route.params.id)

        await AuthApi.client().put(`menuPermissionAll/${role_structure}`, payload);

        console.log('✅ Menu permission updated successfully:', payload);
    } catch (error) {
        console.error('❌ Failed to update menu permission:', error);
    }
};


const updateAllCheckboxState = (row) => {
    row.isAll =
        row.access &&
        row.create &&
        row.read &&
        row.update &&
        row.delete &&
        Object.values(row.role_id || {}).every(Boolean) &&
        Object.values(row.role_access_id || {}).every(Boolean);
};


const onPermissionChange = async (row) => {
    try {
        // 🔹 Update status checkbox "All"
        updateAllCheckboxState(row);
        // 🔹 Siapkan payload sesuai struktur data backend
        const payload = {
            menu_id: row.menu_id,
            role_structure_id: role_structure,
            can_access: row.access,
            can_create: row.create,
            can_read: row.read,
            can_update: row.update,
            can_delete: row.delete,
            roles: row.role_id,           // object { role_id: true/false }
            role_access: row.role_access_id // object { role_access_id: true/false }
        };

        // 🔹 Kirim PUT request ke API
        await AuthApi.client().put(`menuAccessById/${role_structure}`, payload);

    } catch (error) {
        console.error(`❌ Failed to update menu access for menu_id=${row.menu_id}:`, error);
    }
};

const goBack = () => {
    router.push('/pages/menu_management/access');
};
</script>

<template>
    <div class="flex justify-start items-center gap-2 mt-6">
        <Button label="Kembali" icon="pi pi-arrow-left" iconPos="left" type="button" :loading="form.loading"
            severity="secondary" @click="goBack" />
    </div>

    <div class="card mt-8">
        <!-- Tombol -->

        <div class="font-semibold text-xl mb-4">List of Data</div>
        <DataTable ref="dt" :value="dataMenuPermission" dataKey="id" :paginator="true" :first="firstRowIndex"
            :rows="rows" :totalRecords="dataMenuPermission.length" :filters="filters" :loading="loading" showGridlines
            filterDisplay="menu"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50]" currentPageReportTemplate="{first} to {last} of {totalRecords}">
            <!-- Header -->
            <template #header>
                <div class="flex justify-between items-center">
                    <span class="font-medium text-lg">Search</span>
                    <IconField>
                        <InputIcon><i class="pi pi-search" /></InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>

            <!-- Empty / Loading -->
            <template #empty>No data found.</template>
            <template #loading>Loading data, please wait...</template>

            <!-- Columns -->
            <Column header="No" style="width: 4rem">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column header="Menu" style="width: 4rem">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
            </Column>

            <Column field="role_id" header="Role" style="min-width: 15rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap items-center gap-3">
                        <template v-for="role in roleData" :key="role.id">
                            <div class="flex items-center gap-2">
                                <span>{{ role.role_name }}</span>
                                <Checkbox v-model="data.role_id[role.role_id]" :binary="true"
                                    @change="onPermissionChange(data, 'role')" />
                            </div>
                        </template>
                    </div>
                </template>
            </Column>

            <Column field="rs_id" header="Role Access" style="min-width: 15rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap items-center gap-3">
                        <template v-for="ra in roleAccessData" :key="ra.id">
                            <div class="flex items-center gap-2">
                                <span>{{ ra.ra_name }}</span>
                                <Checkbox v-model="data.role_access_id[ra.ra_id]" :binary="true"
                                    @change="onPermissionChange(data, 'role_access')" />
                            </div>
                        </template>
                    </div>
                </template>
            </Column>



            <!-- ✅ Permission Columns -->
            <Column field="access" header="Access" style="text-align:center; width: 3rem;">
                <template #body="{ data }">
                    <Checkbox v-model="data.access" :binary="true" @change="onPermissionChange(data, 'access')" />
                </template>
            </Column>

            <Column field="create" header="Create" style="text-align:center; width: 3rem;">
                <template #body="{ data }">
                    <Checkbox v-model="data.create" :binary="true" @change="onPermissionChange(data, 'create')" />
                </template>
            </Column>

            <Column field="read" header="Read" style="text-align:center; width: 3rem;">
                <template #body="{ data }">
                    <Checkbox v-model="data.read" :binary="true" @change="onPermissionChange(data, 'read')" />
                </template>
            </Column>

            <Column field="update" header="Update" style="text-align:center; width: 3rem;">
                <template #body="{ data }">
                    <Checkbox v-model="data.update" :binary="true" @change="onPermissionChange(data, 'update')" />
                </template>
            </Column>

            <Column field="delete" header="Delete" style="text-align:center; width: 3rem;">
                <template #body="{ data }">
                    <Checkbox v-model="data.delete" :binary="true" @change="onPermissionChange(data, 'delete')" />
                </template>
            </Column>
            <Column header="All" style="text-align:center; width: 3rem;">
                <template #body="{ data }">
                    <div class="flex justify-center items-center">
                        <Checkbox v-model="data.isAll" :binary="true" @change="toggleRowSelectAll(data)" />
                    </div>
                </template>
            </Column>

        </DataTable>

    </div>

</template>
