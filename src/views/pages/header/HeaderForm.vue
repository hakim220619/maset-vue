<script setup>
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import _ from 'lodash';
import { inject, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import DetailForm from './DetailForm.vue';
import { storeSchema } from './schema';

const swal = inject('$swal');
const router = useRouter();
const route = useRoute();

const title = ref('');

const form = ref({
    data: {
        page_title: '',
        service: '',
        database: '',
        table_name: '',
        header_details: []
    },
    errors: {
        page_title: null,
        service: null,
        database: null,
        table_name: null
    },
    assign: (data = {}) => {
        for (const key in data) {
            if (_.has(form.value.data, key) && data[key] && typeof data[key] === typeof form.value.data[key]) {
                form.value.data[key] = data[key];
            }
        }
    },
    loading: false
});

const getTblHeader = async (id) => {
    try {
        const response = await AuthApi.client().get('gateway/example/tbl_header/' + id);

        if (response.data.success) {
            form.value.assign(response.data.data[0]);
        }
    } catch (error) {
        if ([400, 404].includes(error.status)) {
            router.push({ name: 'notfound' });
        }
    }
};

const save = async () => {
    form.value.loading = true;

    const url = route.params.id ? 'gateway/example/tbl_header/' + route.params.id : 'gateway/example/tbl_header';

    try {
        storeSchema.parse(form.value.data);

        const response = await AuthApi.client()({
            url: url,
            method: route.params.id ? 'put' : 'post',
            data: Helper.parseFormdata(mappingFormData())
        });

        if (response.data.success) {
            swal.fire({
                title: 'Success',
                text: 'Tbl Header saved successfully',
                icon: 'success'
            });

            router.push({ name: 'tbl-header-list' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to Tbl Header',
                icon: 'error'
            });
        }
    }

    form.value.loading = false;
};

const mappingFormData = () => {
    let data = {};

    if (route.params.id) {
        data = { ...form.value.data };

        data.create_header_details = data.header_details
            .filter((item) => item.uuid)
            .map((item) => {
                delete item.uuid;
                return item;
            });

        data.update_header_details = data.header_details
            .filter((item) => item.method === 'update')
            .map((item) => {
                item.enc_id = item.id;

                delete item.id;
                delete item.method;

                return item;
            });

        data.delete_header_details = data.header_details.filter((item) => item.method === 'delete').map((item) => ({ enc_id: item.id }));

        return data;
    } else {
        return form.value.data;
    }
};

onBeforeMount(async () => {
    if (route.params.id) {
        getTblHeader(route.params.id);
    }
});

onMounted(async () => {
    title.value = route.params.id ? 'Edit Tbl Header' : 'Add Tbl Header';

    Helper.setTitle(title.value);
});

for (const key in form.value.data) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}
</script>

<template>
    <div class="flex items-center justify-between">
        <h3 class="text-xl text-slate-700 font-semibold leading-3">{{ title }}</h3>
    </div>

    <form @submit.prevent="save">
        <div class="card mt-8">
            <div class="grid md:grid-cols-2 md:gap-x-32 gap-y-4">
                <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                    <label for="page_title" class="text-surface-500">Page Title</label>

                    <div class="md:col-span-3">
                        <InputText v-model="form.data.page_title" class="w-full" id="page_title" :invalid="!!form.errors.page_title" />
                        <InputError :message="form.errors.page_title" />
                    </div>
                </div>

                <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                    <label for="service" class="text-surface-500">Service</label>

                    <div class="md:col-span-3">
                        <InputText v-model="form.data.service" class="w-full" id="service" :invalid="!!form.errors.service" />
                        <InputError :message="form.errors.service" />
                    </div>
                </div>

                <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                    <label for="database" class="text-surface-500">Database</label>

                    <div class="md:col-span-3">
                        <InputText v-model="form.data.database" class="w-full" id="database" :invalid="!!form.errors.database" />
                        <InputError :message="form.errors.database" />
                    </div>
                </div>

                <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                    <label for="table_name" class="text-surface-500">Table Name</label>

                    <div class="md:col-span-3">
                        <InputText v-model="form.data.table_name" class="w-full" id="table_name" :invalid="!!form.errors.table_name" />
                        <InputError :message="form.errors.table_name" />
                    </div>
                </div>
            </div>
        </div>

        <DetailForm v-model="form.data.header_details" />

        <div class="flex justify-end items-center gap-2 mt-8">
            <Button label="Back" text @click="router.push({ name: 'tbl-header-list' })" />
            <Button label="Save" type="submit" raised class="w-20" />
        </div>
    </form>
</template>
