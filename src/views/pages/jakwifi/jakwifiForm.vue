<script setup>
import InputError from '@/components/InputError.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import _ from 'lodash';
import { inject, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import { storeSchema } from './schema.js';

const router = useRouter();
const route = useRoute();
const swal = inject('$swal');
// const validityTypesData = ref([]);
const getSubTypeData = ref([]);

const statusData = ref([
    { name: 'Live', id: true },
    { name: 'Inactive', id: false }
]);

const form = ref({
    data: {
        type: "",
        ms_jakwifi_site_type_id: "",
        name: "",
        is_active: ""
    },

    errors: {
        type: null,
        ms_jakwifi_site_type_id: null,
        name: null,
        is_active: null
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

    const url = route.params.id ? 'gateway/main_service/jakwifi/' + route.params.id : 'gateway/main_service/jakwifi';

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
                text: 'Ms Government saved successfully',
                icon: 'success'
            });

            router.push({ name: 'ms-jakwifi-sites-list' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to save Government',
                icon: 'error'
            });
        }
    }

    form.value.loading = false;
};

async function fetchData(endpoint, dataProperty) {
    try {
        const response = await AuthApi.client().get(endpoint);
        dataProperty.value = response.data.data;
    } catch (error) {
        console.log(error);
    }
}

for (const key in form.value.data) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}

onBeforeMount(async () => {
    getSubTypes();

    if (route.params.id) {
        const userData = await Helper.getDataById('gateway/main_service/jakwifi', route.params.id);
        if (userData) {
            form.value.assign(userData);
        }
    }
});

const getSubTypes = () => fetchData('gateway/main_service/ms_jakwifi_types', getSubTypeData);

onMounted(async () => {
    const title = route.params.id ? 'Edit Ms Government' : 'Add Ms Government';

    Helper.setTitle(title);

    // get master data
    // validityTypesData.value = await Helper.getMasterData({ endpoint: 'gateway/example/validityTypesData' });
});
const goBack = () => {
    router.push('/pages/jakwifi');
};
</script>

<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid md:grid-cols-2 md:gap-x-32 gap-y-4">
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="type" class="text-surface-500 dark:text-white">Type</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.type" class="w-full" id="type" :invalid="!!form.errors.type" />
                    <InputError :message="form.errors.type" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="ms_jakwifi_site_type_id" class="text-surface-500 dark:text-white">Subtype</label>
                <div class="md:col-span-3">
                    <Select v-model="form.data.ms_jakwifi_site_type_id" :options="getSubTypeData" show-clear
                        option-label="name" option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" filter
                        placeholder="Select a Type" class="w-full" :invalid="!!form.errors.ms_jakwifi_site_type_id" />
                    <InputError :message="form.errors.ms_jakwifi_site_type_id" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="name" class="text-surface-500 dark:text-white">Government Name</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.name" class="w-full" id="name" :invalid="!!form.errors.name" />
                    <InputError :message="form.errors.name" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="is_active" class="text-surface-500 dark:text-white">Status</label>
                <div class="md:col-span-3">
                    <Select v-model="form.data.is_active" :options=statusData show-clear option-label="name"
                        option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a Status"
                        class="w-full" :invalid="!!form.errors.is_active" />
                    <InputError :message="form.errors.is_active" />
                </div>
            </div>
        </div>

        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>