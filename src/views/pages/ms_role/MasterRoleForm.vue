<script setup>
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import Label from '@/components/Label.vue';
import { AuthApi } from '@/service/Api';
import { MenuService } from '@/service/MenuService';
// import { Helper } from '@/utilities/Helper';
import { watchDebounced } from '@vueuse/core';
import { AxiosError } from 'axios';
import swal from 'sweetalert2';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
// import { storeSchema, updateSchema } from '/schema';
import { Helper } from '@/service/Helper';
import { RolesService } from '@/service/RolesService';
import SetupPermission from './partials/SetupPermission.vue';

const route = useRoute();
const router = useRouter();

const role = ref({});
var totalMenu = ref(0);

const menus = ref([]);
const treeMenu = ref([]);

const menuPermissions = ref([]);
const selectedPermissions = ref([]);

const setupPermission = ref();

const isEditMode = computed(() => !!route.params.msroleId);

const form = ref({
    data: {
        sys_application_id: '7cEiGgt4W8ZSLJo9nxHj',
        name: '',
        is_active: '',
        create_permissions: [],
        delete_permissions: []
    },
    errors: {},
    loading: false,
    assign: (data = {}) => {
        for (const key in data) {
            if (_.has(form.value.data, key) && data[key] && typeof data[key] === typeof form.value.data[key]) {
                form.value.data[key] = data[key];
            }
        }
    }
});

// trigger before submitting form
function validate() {
    const config = {
        method: 'post',
        url: 'gateway/idp/role'
    };

    form.value.errors = {};

    if (isEditMode.value) {
        config.method = 'put';
        config.url = `gateway/idp/role/${route.params.msroleId}`;

        form.value.data.create_permissions = selectedPermissions.value.filter((item) => !role.value.sys_permission_ids.includes(item));
        form.value.data.delete_permissions = role.value.sys_permission_ids.filter((item) => !selectedPermissions.value.includes(item));

        updateSchema.parse(form.value.data);
    } else {

        form.value.data.create_permissions = selectedPermissions.value;

    }

    return config;
}

async function save() {
    form.value.loading = true;

    try {
        const config = validate();
        const response = await AuthApi.client()({
            ...config,
            data: Helper.parseFormdata(form.value.data)
        });


        if (response.data.success) {
            swal.fire({
                title: 'Success',
                text: 'Role saved successfully',
                icon: 'success'
            });

            router.push({ name: 'msrole' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }

            return;
        } else if (error instanceof AxiosError) {
            if (error.response.status === 422) {
                for (const key in error.response.data.errors) {
                    form.value.errors[key] = error.response.data.errors[key][0];
                }

                return;
            }
        }

        swal.fire({
            title: 'Gagal',
            text: error.response?.data?.message || 'Terjadi kesalahan',
            icon: 'error'
        });
    }

    form.value.loading = false;
}


async function getMenus() {
    const response = await MenuService.getData();
    // console.log(response.data.data);

    return response.data.data;
}

async function getMenuPermissions() {
    const response = await MenuService.getMenuPermissions();
    // console.log(response.data.data);

    return response.data.data;
}

async function getRole() {
    try {
        if (route.params.id) {
            role.value = await RolesService.getById(route.params.id);
            form.value.data.name = role.value.name;
            form.value.data.is_active = role.value.is_active;
            console.log(role.value.is_active);


            selectedPermissions.value = [...role.value.sys_permission_ids];
            // console.log(selectedPermissions.value);
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.status === 404) router.push({ name: 'notfound' });
            else {
                swal.fire('Gagal', error.message, 'error');

                router.push('/');
            }
        }
    }
}

onMounted(async () => {
    menus.value = await getMenus();
    totalMenu = menus.value.length;
    menuPermissions.value = await getMenuPermissions();
    treeMenu.value = MenuService.getTreeData(menus.value);

    await getRole();

    setTimeout(() => {
        setupPermission.value.setPermissionCheckbox();
    }, 500)
});

for (const key in form.value.data) {
    watchDebounced(
        () => form.value.data[key],
        (value) => {
            delete form.value.errors[key];
        },
        { debounce: 500, maxWait: 1000 }
    );
}

</script>

<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid md:grid-cols-2 gap-4 md:gap-8">
            <div class="p-4 shadow-lg rounded-lg ">
                <Heading title="Role Information" />

                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Role Name Field -->
                    <div class="flex flex-col gap-2">
                        <Label for="role-name">Role Name</Label>
                        <InputText v-model="form.data.name" id="role-name" fluid />
                        <InputError :message="form.errors.name" />
                    </div>

                    <!-- Active Toggle Field -->
                    <div class="flex flex-col gap-2">
                        <label for="is-active" class="text-surface-500 dark:text-white">Active</label>
                        <ToggleSwitch v-model="form.data.is_active" id="is-active" />
                    </div>
                </div>
            </div>
        </div>

        <SetupPermission ref="setupPermission" v-model="selectedPermissions" :menu="treeMenu"
            :menu-permissions="menuPermissions" :total-menu="totalMenu" />

        <!-- Dummy Data Table -->


        <div class="flex gap-3 justify-end">
            <Button label="Back" severity="secondary" @click="router.push({ name: 'msrole' })" />
            <Button label="Submit" type="submit" :loading="form.loading" :disabled="form.loading" @click="save" />
        </div>

    </form>
</template>
