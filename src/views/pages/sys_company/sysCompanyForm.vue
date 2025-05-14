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
const validityTypesData = ref([]);


const categoryData = ref([
    { name: 'Internal', id: '7cEiGgt4W8ZSLJo9nxHj' },
    { name: 'Outsource', id: 'Q1JvMiqoZxHAG2KaljCO' }
]);

const form = ref({
    data: {
        name: "",
        company_code: "",
        oracle_code: "",
        type: "",
        category_id: "",
        is_active: true
    },

    errors: {
        name: null,
        company_code: null,
        oracle_code: null,
        type: null,
        category_id: null,
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

    const url = route.params.id ? 'gateway/main_service/sys_company/' + route.params.id : 'gateway/main_service/sys_company';

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
                text: 'Company saved successfully',
                icon: 'success'
            });

            router.push({ name: 'Company List' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to save sysCompany',
                icon: 'error'
            });
        }
    }

    form.value.loading = false;
};

for (const key in form.value.data) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}

onBeforeMount(async () => {
    if (route.params.id) {
        const userData = await Helper.getDataById('gateway/main_service/sys_company', route.params.id);
        if (userData) {
            form.value.assign(userData);
        }
    }
});

onMounted(async () => {
    const title = route.params.id ? 'Edit Company' : 'Add Company';

    Helper.setTitle(title);

    // get master data
    validityTypesData.value = await Helper.getMasterData({ endpoint: 'gateway/example/validityTypesData' });
});
const goBack = () => {
    router.push('/pages/sys_company');
};
</script>

<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid md:grid-cols-2 md:gap-x-32 gap-y-4">
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="name" class="text-surface-500 dark:text-white">Name</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.name" class="w-full" id="name" :invalid="!!form.errors.name" />
                    <InputError :message="form.errors.name" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="company_code" class="text-surface-500 dark:text-white">Company Code</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.company_code" class="w-full" id="company_code"
                        :invalid="!!form.errors.company_code" />
                    <InputError :message="form.errors.company_code" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="oracle_code" class="text-surface-500 dark:text-white">Oracle Code</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.oracle_code" class="w-full" id="oracle_code"
                        :invalid="!!form.errors.oracle_code" />
                    <InputError :message="form.errors.oracle_code" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="type" class="text-surface-500 dark:text-white">Type</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.type" class="w-full" id="type" :invalid="!!form.errors.type" />
                    <InputError :message="form.errors.type" />
                </div>
            </div>
            <div class="flex justify-between items-center gap-4">
                <label for="category_id" class="text-surface-500 dark:text-white">Category Id</label>
                <div class="md:w-3/4">
                    <Select v-model="form.data.category_id" input-id="category_id" show-clear :options="categoryData"
                        option-label="name" option-value="id" :virtualScrollerOptions="{ itemSize: 38 }"
                        placeholder="Select Recurrence Pattern" class="w-full" :invalid="!!form.errors.category_id" />
                    <InputError :message="form.errors.category_id" class="text-sm text-red-500 mt-1" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label class="text-surface-500 dark:text-white">Active</label>
                <ToggleSwitch v-model="form.data.is_active" />
            </div>
        </div>

        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>
