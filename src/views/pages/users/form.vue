<script setup>
import TextContact from '@/components/InputContact.vue';
import InputError from '@/components/InputError.vue';
import TextNumber from '@/components/InputTextNumber.vue';
import Label from '@/components/Label.vue';
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

const roleStructureOptions = ref([]);
const roleAccessOptions = ref([]);
const roleOptions = ref([]);
const statusOptions = ref([]);

const form = ref({
    data: {
        nik: '',
        name: '',
        email: '',
        password: '',
        role_structure: '',
        role_access: '',
        role: '',
        status: '',
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
        status: null,
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

    const isEdit = !!route.params.id;
    const url = isEdit ? 'users/' + route.params.id : 'users';

    try {
        storeSchema.parse(form.value.data);

        const formData = new FormData();
        for (const key in form.value.data) {
            if (key === 'image') {
                if (form.value.data.image) {
                    formData.append('image', form.value.data.image);
                }
            } else if (key === 'password' && isEdit && !form.value.data.password) {
                // Jangan kirim password jika kosong saat edit
                continue;
            } else {
                formData.append(key, form.value.data[key]);
            }
        }

        const response = await AuthApi.client()({
            url: url,
            method: isEdit ? 'put' : 'post',
            data: formData
        });

        if (response.data.success) {
            swal.fire({
                title: 'Success',
                text: 'Users saved successfully',
                icon: 'success'
            });

            router.push({ name: 'Users-list' });
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



onBeforeMount(async () => {
    if (route.params.id) {
        const userData = await Helper.getDataById('users', route.params.id);

        if (userData) {
            userData.password = ''
            form.value.assign(userData);
        }
    }
});


const fetchOptions = async () => {
    try {
        const [roleStructures, roleAccess, roles, statuses] = await Promise.all([
            Helper.getRoleStructures(),
            Helper.getRoleAccess(),
            Helper.getRole(),
            Helper.getStatus()
        ]);

        roleStructureOptions.value = roleStructures;
        roleAccessOptions.value = roleAccess;
        roleOptions.value = roles;
        statusOptions.value = statuses;

    } catch (error) {
        console.error('Failed to fetch options:', error);
    }
};

onMounted(fetchOptions);



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
    router.push('/pages/users');
};
</script>
<template>


    <form class="card mt-8" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <!-- Left Column -->
            <div class="space-y-4">
                <!-- NIK -->
                <div class="col-span-6">
                    <Label for="nik" class="block mb-1 text-gray-700">NIK</Label>
                    <TextNumber v-model="form.data.nik" id="nik" class="w-full" :invalid="!!form.errors.nik"
                        inputmode="numeric" pattern="[0-9]*" />
                    <InputError :message="form.errors.nik" />
                </div>

                <!-- Name -->
                <div class="col-span-6">
                    <Label for="name" class="block mb-1 text-gray-700">Name</Label>
                    <InputText v-model="form.data.name" id="name" class="w-full" :invalid="!!form.errors.name" />
                    <InputError :message="form.errors.name" />
                </div>

                <!-- Contact -->
                <div class="col-span-6">
                    <Label for="contact" class="block mb-1 text-gray-700">Contact</Label>
                    <TextContact v-model="form.data.contact" id="contact" class="w-full"
                        :invalid="!!form.errors.contact" />
                    <InputError :message="form.errors.contact" />
                </div>

                <!-- Role Access -->
                <div class="col-span-6">
                    <Label for="role_access" class="block mb-1 text-gray-700">Role Access</Label>
                    <Select v-model="form.data.role_access" :options="roleAccessOptions" show-clear option-label="name"
                        filter option-value="id" :virtualScrollerOptions="{ itemSize: 38 }"
                        placeholder="Select a category" class="w-full" :invalid="!!form.errors.role_access" />
                    <InputError :message="form.errors.role_access" />
                </div>

                <!-- Status -->
                <div class="col-span-6">
                    <Label for="status" class="block mb-1 text-gray-700">Status</Label>
                    <Select v-model="form.data.status" :options="statusOptions" show-clear option-label="name" filter
                        option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a category"
                        class="w-full" :invalid="!!form.errors.status" />
                    <InputError :message="form.errors.status" />
                </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
                <!-- Email -->
                <div class="col-span-6">
                    <Label for="email" class="block mb-1 text-gray-700">Email</Label>
                    <InputText v-model="form.data.email" id="email" class="w-full" :invalid="!!form.errors.email" />
                    <InputError :message="form.errors.email" />
                </div>

                <!-- Password -->
                <div class="col-span-6">
                    <Label for="password" class="block mb-1 text-gray-700">Password</Label>
                    <InputText v-model="form.data.password" id="password" class="w-full" type="password"
                        :invalid="!!form.errors.password" />
                    <InputError :message="form.errors.password" />
                </div>

                <!-- Role Structure -->
                <div class="col-span-6">
                    <Label for="role_structure" class="block mb-1 text-gray-700">Role Structure</Label>
                    <Select v-model="form.data.role_structure" :options="roleStructureOptions" show-clear
                        option-label="name" filter option-value="id" :virtualScrollerOptions="{ itemSize: 38 }"
                        placeholder="Select a category" class="w-full" :invalid="!!form.errors.role_structure" />
                    <InputError :message="form.errors.role_structure" />
                </div>

                <!-- Role -->
                <div class="col-span-6">
                    <Label for="role" class="block mb-1 text-gray-700">Role</Label>
                    <Select v-model="form.data.role" :options="roleOptions" show-clear option-label="name" filter
                        option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a category"
                        class="w-full" :invalid="!!form.errors.role" />
                    <InputError :message="form.errors.role" />
                </div>

                <!-- Image -->
                <div class="col-span-6">
                    <Label for="image" class="block mb-1 text-gray-700">Image</Label>
                    <InputText type="file" @change="e => form.data.image = e.target.files[0]" class="w-full" />
                    <InputError :message="form.errors.image" />
                </div>
            </div>

            <!-- Address (col-span-12) -->

        </div>
        <div class="col-span-12">
            <Label for="address" class="block mb-1 text-gray-700">Address</Label>
            <Textarea v-model="form.data.address" id="address" class="w-full" :invalid="!!form.errors.address" />
            <InputError :message="form.errors.address" />
        </div>
        <!-- Footer Buttons -->
        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>


</template>
