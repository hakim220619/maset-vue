<script setup>
import InputError from '@/components/InputError.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { inject, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';

import { storeSchema } from './schema.js'; // Pastikan schema sudah menyesuaikan field baru

const router = useRouter();
const route = useRoute();
const swal = inject('$swal');

const statusOptions = ref([]);
const form = ref({
    data: {
        role_name: '',
        role_status: ''
    },
    errors: {
        role_name: null,
        role_status: null
    },
    assign: (data = {}) => {
        for (const key in data) {
            if (key in form.value.data) {
                form.value.data[key] = data[key];
            }
        }
    },
    loading: false
});

const save = async () => {
    form.value.loading = true;
    const url = route.params.id ? `role/${route.params.id}` : 'role';

    try {
        storeSchema.parse(form.value.data);

        const formData = new FormData();
        for (const key in form.value.data) {
            formData.append(key, form.value.data[key]);
        }

        const response = await AuthApi.client()({
            url,
            method: route.params.id ? 'put' : 'post',
            data: formData
        });

        if (response.data.success) {
            swal.fire({
                title: 'Success',
                text: 'Role saved successfully',
                icon: 'success'
            });
            router.push({ name: 'role-list' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to save Role',
                icon: 'error'
            });
        }
    }

    form.value.loading = false;
};

const fetchOptions = async () => {
    try {
        const [statuses] = await Promise.all([Helper.getStatus()]);
        statusOptions.value = statuses;
    } catch (error) {
        console.error('Failed to fetch status options:', error);
    }
};

onBeforeMount(async () => {
    if (route.params.id) {
        const data = await Helper.getDataById('role', route.params.id);
        if (data) {
            form.value.assign(data);
        }
    }
});

onMounted(() => {
    const title = route.params.id ? 'Edit Role' : 'Add Role';
    Helper.setTitle(title);
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

const goBack = () => {
    router.push('/pages/role');
};
</script>

<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <!-- Kiri: Role Name -->
            <div>
                <Label for="role_name" class="block mb-1 text-gray-700 dark:text-white">
                    Role Name <span class="text-red-500">*</span>
                </Label>
                <InputText v-model="form.data.role_name" class="w-full" id="role_name"
                    :invalid="!!form.errors.role_name" />
                <InputError :message="form.errors.role_name" />
            </div>

            <!-- Kanan: Status -->
            <div>
                <Label for="role_status" class="block mb-1 text-gray-700 dark:text-white">
                    Status
                </Label>
                <Select v-model="form.data.role_status" :options="statusOptions" show-clear option-label="name"
                    option-value="id" filter placeholder="Select a status" class="w-full"
                    :invalid="!!form.errors.role_status" />
                <InputError :message="form.errors.role_status" />
            </div>
        </div>

        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>
