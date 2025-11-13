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
const statusOptions = ref([]);

const iconsData = ref([]);



const form = ref({
    data: {
        name: '',
        parent_id: '',
        icon: '',
        address: '',
        order_list: '',
        status: true
    },
    errors: {
        name: null,
        parent_id: null,
        icon: null,
        address: null,
        order_list: null,
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

    const url = route.params.id ? 'menus/' + route.params.id : 'menus';

    try {
        storeSchema.parse(form.value.data);

        const formData = new FormData();
        for (const key in form.value.data) {

            formData.append(key, form.value.data[key]);

        }
        console.log(formData);

        const response = await AuthApi.client()({
            url: url,
            method: route.params.id ? 'put' : 'post',
            data: formData
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

async function getMenuManagement() {
    try {
        const response = await AuthApi.client().get('menus/');
        const filteredData = response.data.data.filter(item => item.status === 1);

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
        const userData = await Helper.getDataById('menus', route.params.id);

        if (userData) {
            userData.parent_enc_id = userData.parent_id
            form.value.assign(userData);
        }
    }
});


onMounted(async () => {

    getMenuManagement()
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

const parentIdOptions = computed(() => [
    { menu_id: null, name: '— No Parent —' },
    ...parentIdDataHeader.value
]);


const goBack = () => {
    router.push('/pages/menu_management');
};
</script>
<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <!-- Left Column -->
            <div class="space-y-4">

                <!-- Name -->
                <div class="col-span-6">
                    <Label for="name" class="block mb-1 text-gray-700 dark:text-white">
                        Name <span class="text-red-500">*</span>
                    </Label>
                    <InputText v-model="formattedName" class="w-full" id="name" :invalid="!!form.errors.name" />
                    <InputError :message="form.errors.name" />
                </div>

                <!-- Icon -->
                <div class="col-span-6">
                    <Label for="icon" class="block mb-1 text-gray-700 dark:text-white">Icon</Label>
                    <InputText v-model="form.data.icon" id="icon" class="w-full" :invalid="!!form.errors.icon" />
                    <InputError :message="form.errors.icon" />
                </div>

                <!-- Address -->
                <div class="col-span-6">
                    <Label for="address" class="block mb-1 text-gray-700 dark:text-white">Address</Label>
                    <InputText v-model="form.data.address" id="address" class="w-full"
                        :invalid="!!form.errors.address" />
                    <InputError :message="form.errors.address" />
                </div>
            </div>
            <div class="space-y-4">

                <!-- Parent ID -->
                <div class="col-span-6">
                    <Label for="parent_id" class="block mb-1 text-gray-700 dark:text-white">Parent ID</Label>
                    <Select v-model="form.data.parent_id" :options="parentIdOptions" show-clear option-label="name"
                        option-value="menu_id" :virtualScrollerOptions="{ itemSize: 38 }" filter
                        placeholder="Select a parent name" class="w-full" :invalid="!!form.errors.parent_id" />
                    <InputError :message="form.errors.parent_id" />
                </div>

                <!-- Order List -->
                <div class="col-span-6">
                    <Label for="order_list" class="block mb-1 text-gray-700 dark:text-white">Order List</Label>
                    <InputText v-model="form.data.order_list" id="order_list" type="number" class="w-full"
                        :invalid="!!form.errors.order_list" />
                    <InputError :message="form.errors.order_list" />
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
        </div>

        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>
