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



const form = ref({
    data: {
        application_enc_id: '7cEiGgt4W8ZSLJo9nxHj',
        name: '',
        parent_enc_id: '',
        icon: '',
        address: '',
        order_list: '',
        is_active: true
    },
    errors: {
        application_enc_id: null,
        name: null,
        parent_enc_id: null,
        icon: null,
        address: null,
        order_list: null,
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

                <!-- Name -->
                <div class="flex justify-between items-center gap-4">
                    <label for="name" class="text-surface-500 dark:text-white">Name <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputText v-model="formattedName" class="w-full" id="name" :invalid="!!form.errors.name" />
                        <InputError :message="form.errors.name" />
                    </div>
                </div>

                <!-- Icon -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 dark:text-white">Icon</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.icon" :options="iconsData" option-label="icon_code"
                            option-value="icon_code" placeholder="Select an Icon" class="w-full" filter>

                            <template #option="slotProps">
                                <div class="flex items-center">
                                    <i :class="slotProps.option.icon_code" class="layout-menuitem-icon"></i>
                                    <div>{{ slotProps.option.icon_code }}</div>
                                </div>
                            </template>
                        </Select>
                        <InputError :message="form.errors.icon" />
                    </div>
                </div>
                <!-- Address -->
                <div class="flex justify-between items-center gap-4">
                    <label for="address" class="text-surface-500 dark:text-white">Address</label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.address" id="address" class="w-full"
                            :invalid="!!form.errors.address" />
                        <InputError :message="form.errors.address" />
                    </div>
                </div>
            </div>
            <div class="space-y-4">
                <!-- Parent ID -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 dark:text-white">Parent ID</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.parent_enc_id" :options=parentIdDataHeader show-clear
                            option-label="name" option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" filter
                            placeholder="Select a parent name" class="w-full" :invalid="!!form.errors.parent_enc_id" />
                        <InputError :message="form.errors.parent_enc_id" />
                    </div>
                </div>
                <!-- Order List -->
                <div class="flex justify-between items-center gap-4">
                    <label for="order_list" class="text-surface-500 dark:text-white">Order List</label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.order_list" id="order_list" class="w-full" type="number"
                            :invalid="!!form.errors.order_list" />
                        <InputError :message="form.errors.order_list" />
                    </div>
                </div>

                <!-- Status -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 font-medium dark:text-white">Status</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.is_active" input-id="is_active" show-clear :options="StatusOptions"
                            option-label="label" option-value="id" :virtualScrollerOptions="{ itemSize: 38 }"
                            placeholder="Select Status" class="w-full" :invalid="!!form.errors.is_active" />
                        <InputError :message="form.errors.is_active" class="text-sm text-red-500 mt-1" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>
