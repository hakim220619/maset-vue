<script setup>
import InputError from '@/components/InputError.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import _ from 'lodash';
import { computed, inject, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import { storeSchema } from './schema.js';

const router = useRouter();
const route = useRoute();
const swal = inject('$swal');
const parentIdDataHeader = ref([]);
const StatusOptions = ref([
    { label: 'Live', id: true },
    { label: 'Inactive', id: false }

]);
const iconsData = ref([]);
const roleStructureOptions = ref([]);

const form = ref({
    data: {
        nik: '',
        name: '',
        email: '',
        password: '',
        role_structure: '',
        role_access: '',
        role: '',
        image: null,
        contact: '',
        address: ''
    },
    errors: {
        nik: null,
        name: null,
        email: null,
        password: null,
        role_structure: null,
        role_access: null,
        role: null,
        image: null,
        contact: null,
        address: null
    },
    assign: (data = {}) => {
        for (const key in data) {
            if (_.has(form.value.data, key)) {
                form.value.data[key] = data[key];
            }
        }
    },
    loading: false
});

const save = async () => {
    form.value.loading = true;

    const url = route.params.id ? 'gateway/idp/menu/' + route.params.id : 'gateway/idp/menu';

    try {
        storeSchema.parse(form.value.data);

        const response = await AuthApi.client()({
            url: url,
            method: route.params.id ? 'put' : 'post',
            data: Helper.parseFormdata(form.value.data)
        });

        if (response.data.success) {
            swal.fire({
                title: 'Success',
                text: 'Menu Management saved successfully',
                icon: 'success'
            });

            router.push({ name: 'menuManagement-list' });
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


async function getMenuManagement() {
    try {
        const response = await AuthApi.client().get('gateway/idp/menu/');
        const filteredData = response.data.data.filter(item => item.is_active === true);
        const sortedData = filteredData.sort((a, b) => {
            return a.parent_id - b.parent_id;
        });
        parentIdDataHeader.value = sortedData;

    } catch (error) {
        console.log(error);
    }
}

onBeforeMount(async () => {
    if (route.params.id) {
        const userData = await Helper.getDataById('gateway/idp/menu', route.params.id);

        if (userData) {
            userData.parent_enc_id = userData.parent_id
            form.value.assign(userData);
        }
    }
});

async function getIconData() {
    try {
        const response = await AuthApi.client().get('gateway/main_service/ms_icons');

        iconsData.value = response.data.data;
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    const title = route.params.id ? 'Edit Menu Management' : 'Add Menu Management';

    Helper.setTitle(title);
    getMenuManagement()
    getIconData()


});

onMounted(async () => {
    try {
        const response = await AuthApi.client().get('/role_structure');

        roleStructureOptions.value = response.data.data.map(item => ({
            name: item.rs_name,
            id: item.rs_id,
        }));

    } catch (error) {
        console.error('Failed to fetch entitas options:', error);
    }
});

for (const key in form.value.data) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}
const formattedName = computed({
    get() {
        return form.value.data.name
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    },
    set(value) {
        form.value.data.name = value
            .replace(/\s+/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }
});


const goBack = () => {
    router.push('/pages/menu_management');
};
</script>
<template>


    <form class="card mt-8" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <!-- Left Column -->
            <div class="space-y-4">

                <!-- NIK -->
                <div class="col-span-6">
                    <label for="nik" class="block mb-1 text-gray-700">NIK</label>
                    <InputText v-model="form.data.nik" id="nik" class="w-full" :invalid="!!form.errors.nik" />
                    <InputError :message="form.errors.nik" />
                </div>

                <!-- Name -->
                <div class="col-span-6">
                    <label for="name" class="block mb-1 text-gray-700">Name</label>
                    <InputText v-model="form.data.name" id="name" class="w-full" :invalid="!!form.errors.name" />
                    <InputError :message="form.errors.name" />
                </div>

                <!-- Contact -->
                <div class="col-span-6">
                    <label for="contact" class="block mb-1 text-gray-700">Contact</label>
                    <InputText v-model="form.data.contact" id="contact" class="w-full"
                        :invalid="!!form.errors.contact" />
                    <InputError :message="form.errors.contact" />
                </div>

                <div class="col-span-6">
                    <label for="role_access" class="block mb-1 text-gray-700">Role Access</label>
                    <Select v-model="form.data.role_access" :options="role_accessOptions" show-clear option-label="name"
                        filter option-value="id" :virtualScrollerOptions="{ itemSize: 38 }"
                        placeholder="Select a category" class="w-full" :invalid="!!form.errors.role_access" />
                    <InputError :message="form.errors.role_access" />
                </div>

                <!-- Address -->
                <div class="col-span-6">
                    <label for="address" class="block mb-1 text-gray-700">Address</label>
                    <InputText v-model="form.data.address" id="address" class="w-full"
                        :invalid="!!form.errors.address" />
                    <InputError :message="form.errors.address" />
                </div>

            </div>
            <div class="space-y-4">
                <!-- Email -->
                <div class="col-span-6">
                    <label for="email" class="block mb-1 text-gray-700">Email</label>
                    <InputText v-model="form.data.email" id="email" class="w-full" :invalid="!!form.errors.email" />
                    <InputError :message="form.errors.email" />
                </div>

                <!-- Password -->
                <div class="col-span-6">
                    <label for="password" class="block mb-1 text-gray-700">Password</label>
                    <InputText v-model="form.data.password" id="password" class="w-full" type="password"
                        :invalid="!!form.errors.password" />
                    <InputError :message="form.errors.password" />
                </div>

                <!-- role_structure -->
                <div class="col-span-6">
                    <label for="role_structure" class="block mb-1 text-gray-700">Role Structure</label>
                    <Select v-model="form.data.role_structure" :options="roleStructureOptions" show-clear
                        option-label="name" filter option-value="id" :virtualScrollerOptions="{ itemSize: 38 }"
                        placeholder="Select a category" class="w-full" :invalid="!!form.errors.role_structure" />
                    <InputError :message="form.errors.role_structure" />
                </div>

                <div class="col-span-6">
                    <label for="role" class="block mb-1 text-gray-700">Role</label>
                    <Select v-model="form.data.role" :options="roleOptions" show-clear option-label="name" filter
                        option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a category"
                        class="w-full" :invalid="!!form.errors.role" />
                    <InputError :message="form.errors.role" />
                </div>


                <!-- Image Upload -->
                <div class="col-span-6">
                    <label for="image" class="block mb-1 text-gray-700">Image</label>
                    <input type="file" @change="e => form.data.image = e.target.files[0]"
                        class="w-full border border-gray-300 rounded px-3 py-2 file:mr-4  hover:file:bg-surface-300" />
                    <InputError :message="form.errors.image" />
                </div>

            </div>
        </div>
        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>

</template>
