<script setup>
import InputError from '@/components/InputError.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import _ from 'lodash';


import { inject, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';


const data = ref([]);
const dataMenuPermission = ref([]);
const loading = ref(false);




const firstRowIndex = ref(0);
const rows = ref(10);

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
        menu_id: route.params.id,
        status: true,
        can_create: false,
        can_read: false,
        can_update: false,
        can_delete: false
    },
    errors: {
        role_structure: null,
        role_access: null,
        role: null,
        status: null
    },
    assign: (data = {}) => {
        for (const key in data) {
            if (_.has(form.value.data, key)) {
                const newValue = data[key];

                if (typeof newValue === 'boolean' ||
                    (newValue && typeof newValue === typeof form.value.data[key]) ||
                    (Number.isInteger(newValue) && !isNaN(newValue))) {

                    form.value.data[key] = newValue;
                }
            }
        }
    },

    loading: false
});


const save = async () => {
    form.value.loading = true;

    const url = '/menu_permission';

    try {
        // storeSchema.parse(form.value.data);

        const formData = new FormData();
        for (const key in form.value.data) {

            formData.append(key, form.value.data[key]);

        }
        const response = await AuthApi.client()({
            url: url,
            method: 'post',
            data: formData
        });
        if (response.data.data.success === false) {
            swal.fire({
                title: 'Error',
                text: 'Menu Management already exists',
                icon: 'error'
            });
        } else {
            if (response.data.success) {
                swal.fire({
                    title: 'Success',
                    text: 'Menu Management saved successfully',
                    icon: 'success'
                });

                getMenuPermisiionById(route.params.id)
            }
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to save Menu Management',
                icon: 'error'
            });
        }
    }

    form.value.loading = false;
};

const fetchOptions = async () => {
    try {
        const [statuses] = await Promise.all([
            Helper.getStatus()
        ]);

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

async function getMenuPermisiionById(id) {
    try {
        const response = await AuthApi.client().get('menu_permission_detail/' + id);

        dataMenuPermission.value = response.data.data;

    } catch (error) {
        console.log(error);
    }
}

onBeforeMount(async () => {
    if (route.params.id) {
        getMenuPermisiionById(route.params.id)
        // const userData = await Helper.getDataById('menu_permission_detail', route.params.id);



    }
});


onMounted(async () => {

    getRoleStructure()
    getRoleAcess()
    getRole()
    fetchOptions()

});

for (const key in form.value.data) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}



const goBack = () => {
    router.push('/pages/menu_management');
};
</script><template>
    <form class="card mt-8" @submit.prevent="save">
        <!-- Grid utama -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
            <!-- Role Structure -->
            <div>
                <Label for="role_structure" class="block mb-1 text-gray-700 dark:text-white">Role Structure</Label>
                <Select v-model="form.data.role_structure" :options="roleStructureData" show-clear
                    option-label="rs_name" option-value="rs_id" :virtualScrollerOptions="{ itemSize: 38 }" filter
                    placeholder="Select Role Structure" class="w-full" :invalid="!!form.errors.role_structure" />
                <InputError :message="form.errors.role_structure" />
            </div>

            <!-- Role Access -->
            <div>
                <Label for="role_access" class="block mb-1 text-gray-700 dark:text-white">Role Access</Label>
                <Select v-model="form.data.role_access" :options="roleAccessData" show-clear option-label="ra_name"
                    option-value="ra_id" :virtualScrollerOptions="{ itemSize: 38 }" filter
                    placeholder="Select Role Access" class="w-full" :invalid="!!form.errors.role_access" />
                <InputError :message="form.errors.role_access" />
            </div>

            <!-- Role -->
            <div>
                <Label for="role" class="block mb-1 text-gray-700 dark:text-white">Role</Label>
                <Select v-model="form.data.role" :options="roleData" show-clear option-label="role_name"
                    option-value="role_id" :virtualScrollerOptions="{ itemSize: 38 }" filter placeholder="Select Role"
                    class="w-full" :invalid="!!form.errors.role" />
                <InputError :message="form.errors.role" />
            </div>

            <!-- Status -->
            <div>
                <Label for="status" class="block mb-1 text-gray-700 dark:text-white">Status</Label>
                <Select v-model="form.data.status" :options="statusOptions" show-clear option-label="name"
                    option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" filter placeholder="Select Status"
                    class="w-full" :invalid="!!form.errors.status" />
                <InputError :message="form.errors.status" />
            </div>
        </div>

        <!-- Akses CRUD -->
        <div class="mt-6">
            <label class="block mb-2 text-gray-700 dark:text-white">Permissions</label>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="flex items-center gap-2">
                    <Checkbox v-model="form.data.can_create" :binary="true" input-id="can_create" />
                    <label for="can_create" class="text-sm text-gray-700 dark:text-white">Create</label>
                </div>
                <div class="flex items-center gap-2">
                    <Checkbox v-model="form.data.can_read" :binary="true" input-id="can_read" />
                    <label for="can_read" class="text-sm text-gray-700 dark:text-white">Read</label>
                </div>
                <div class="flex items-center gap-2">
                    <Checkbox v-model="form.data.can_update" :binary="true" input-id="can_update" />
                    <label for="can_update" class="text-sm text-gray-700 dark:text-white">Update</label>
                </div>
                <div class="flex items-center gap-2">
                    <Checkbox v-model="form.data.can_delete" :binary="true" input-id="can_delete" />
                    <label for="can_delete" class="text-sm text-gray-700 dark:text-white">Delete</label>
                </div>
            </div>
        </div>

        <!-- Tombol -->
        <div class="flex justify-end items-center gap-2 mt-6">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>

    <div class="card mt-8">
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

            <Column field="menu_id" header="Menu ID" style="min-width: 12rem">
                <template #body="slotProps">
                    {{ slotProps.data.menu_id }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by Menu ID" />
                </template>
            </Column>
            <Column field="rs_id" header="Role Structure" style="min-width: 12rem">
                <template #body="slotProps">
                    {{ slotProps.data.rs_id }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by Menu ID" />
                </template>
            </Column>

            <!-- Tambahkan kolom lain sesuai kebutuhan, contoh status -->
            <Column field="status" header="Status" style="min-width: 8rem">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status ? 'Active' : 'Inactive'"
                        :severity="slotProps.data.status ? 'success' : 'danger'" />
                </template>
            </Column>

            <!-- <Column header="Action" style="width: 6rem">
                <template #body="slotProps">
                    <DropdownButton :items="items" :data="slotProps.data" :menu-key="slotProps.data.id" />
                </template>
            </Column> -->
        </DataTable>

    </div>

</template>
