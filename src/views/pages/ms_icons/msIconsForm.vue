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

const StatusOptions = ref([
    { label: 'Live', id: true },
    { label: 'Inactive', id: false }

]);

const form = ref({
    data: {
        icon_code: "",
        is_active: true
    },

    errors: {
        icon_code: null,
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

    const url = route.params.id ? 'gateway/main_service/ms_icons/' + route.params.id : 'gateway/main_service/ms_icons';

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
                text: 'Icons saved successfully',
                icon: 'success'
            });

            router.push({ name: 'Icons List' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to save msIcons',
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
        const userData = await Helper.getDataById('gateway/main_service/ms_icons', route.params.id);
        if (userData) {
            form.value.assign(userData);
        }
    }
});

onMounted(async () => {
    const title = route.params.id ? 'Edit Icons' : 'Add Icons';

    Helper.setTitle(title);

});
const goBack = () => {
    router.push('/pages/ms_icons');
};
</script>

<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid md:grid-cols-2 md:gap-x-32 gap-y-4">
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="icon_code" class="text-surface-500 dark:text-white">Icon Code</label>
                <div class="md:col-span-3 relative">
                    <InputText v-model="form.data.icon_code" class="w-full pr-8" id="icon_code"
                        :invalid="!!form.errors.icon_code" />
                    <i :class="form.data.icon_code"
                        class="layout-menuitem-icon absolute top-1/2 right-2 transform -translate-y-1/2"></i>
                    <InputError :message="form.errors.icon_code" />
                </div>
            </div>

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

        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>
