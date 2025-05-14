<script setup>
import AdvancedFileUpload from '@/components/AdvancedFileUpload.vue';
import InputDate from '@/components/InputDate.vue';
import InputEditor from '@/components/InputEditor.vue';
import InputError from '@/components/InputError.vue';
import InputGroupCheckbox from '@/components/InputGroupCheckbox.vue';
import InputRadio from '@/components/InputRadio.vue';
import PopupTable from '@/components/PopupTable.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import _ from 'lodash';
import { inject, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import { storeSchema } from './schema';

const swal = inject('$swal');
const router = useRouter();
const route = useRoute();

const countries = ref([]);
const destinations = ref([]);

const gender = ref(['Male', 'Female']);
const statuses = ref(['unqualified', 'negotiation', 'qualified', 'new', 'renewal']);
const types = ref(['Buildings', 'Land', 'Services', 'Technology', 'Other']);

const form = ref({
    data: {
        name: '',
        country_id: '',
        company: '',
        gender: '',
        current_position_id: '',
        category_ids: [],
        types: [],
        destination_ids: [],
        join_date: '',
        status: '',
        balance: 0,
        address: '',
        is_active: false,
        documents: []
    },
    errors: {
        name: null,
        country_id: null,
        company: null,
        gender: null,
        current_position: null,
        category_ids: null,
        types: null,
        destination_ids: null,
        join_date: null,
        status: null,
        balance: null,
        address: null,
        is_active: null,
        documents: null
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

const getCustomer = async (id) => {
    try {
        const response = await AuthApi.client().get('gateway/example/customers/' + id);

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

    const url = route.params.id ? 'gateway/example/customers/' + route.params.id : 'gateway/example/customers';
    console.log(Helper.parseFormdata(form.value.data));

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
                text: 'Customer saved successfully',
                icon: 'success'
            });

            router.push({ name: 'customer-list' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to save customer',
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
        getCustomer(route.params.id);
    }
});

onMounted(async () => {
    const title = route.params.id ? 'Edit Customer' : 'Add Customer';

    Helper.setTitle(title);

    // get master data
    countries.value = await Helper.getMasterData({ endpoint: 'gateway/example/countries' });
    destinations.value = await Helper.getMasterData({ endpoint: 'gateway/example/countries' });
});
</script>

<template>
    <div class="flex items-center justify-between">
        <h3 class="text-xl text-slate-700 font-semibold leading-3">Add Customer</h3>
    </div>

    <form class="card mt-8" @submit.prevent="save">
        <div class="grid md:grid-cols-2 md:gap-x-32 gap-y-4">
            <!-- Type varchar  -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="name" class="text-surface-500">Nama</label>

                <div class="md:col-span-3">
                    <InputText v-model="form.data.name" class="w-full" id="name" :invalid="!!form.errors.name" />
                    <InputError :message="form.errors.name" />
                </div>
            </div>

            <!-- Type Dropdown from db -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="country" class="text-surface-500">Country</label>

                <div class="md:col-span-3">
                    <Select v-model="form.data.country_id" input-id="country" option-label="name" option-value="id"
                        filter show-clear :options="countries" :virtualScrollerOptions="{ itemSize: 38 }"
                        placeholder="Select a Country" class="w-full" :invalid="!!form.errors.country_id" />
                    <InputError :message="form.errors.country_id" />
                </div>
            </div>

            <!-- Type Static Radio -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label class="text-surface-500">Gender</label>
                <div class="md:col-span-3">
                    <InputRadio v-model="form.data.gender" name="gender" :options="gender" class="md:col-span-3" />
                </div>
            </div>

            <!-- Type Radio From DB -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label class="text-surface-500">Current Position</label>
                <div class="md:col-span-3">
                    <InputRadio v-model="form.data.current_position_id" name="current_position_id"
                        option-url="gateway/example/ms_customer_categories" />
                </div>
            </div>

            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="company" class="text-surface-500">Company</label>

                <div class="md:col-span-3">
                    <InputText v-model="form.data.company" id="company" class="w-full"
                        :invalid="!!form.errors.company" />
                    <InputError :message="form.errors.company" />
                </div>
            </div>

            <!-- Type Date -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="join_date" class="text-surface-500">Join Date</label>

                <div class="md:col-span-3">
                    <InputDate v-model="form.data.join_date" input-id="join_date" date-format="yy-mm-dd" class="w-full"
                        :invalid="!!form.errors.join_date" />
                    <InputError :message="form.errors.join_date" />
                </div>
            </div>

            <!-- type dropdown static -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="status" class="text-surface-500">Status</label>

                <div class="md:col-span-3">
                    <Select v-model="form.data.status" input-id="status" show-clear :options="statuses"
                        :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a Status" class="w-full"
                        :invalid="!!form.errors.status" />
                    <InputError :message="form.errors.status" />
                </div>
            </div>

            <!-- type number -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="balance" class="text-surface-500">Balance</label>

                <div class="md:col-span-3">
                    <InputNumber v-model="form.data.balance" inputId="balance" class="w-full" fluid locale="en-US"
                        mode="currency" currency="USD" :invalid="!!form.errors.balance" />
                    <InputError :message="form.errors.balance" />
                </div>
            </div>

            <!-- type checkbox from db -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label class="text-surface-500">Category</label>
                <div class="md:col-span-3">
                    <InputGroupCheckbox v-model="form.data.category_ids"
                        option-url="gateway/example/ms_customer_categories" />
                </div>
            </div>

            <!-- type checkbox static -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label class="text-surface-500">Tags</label>
                <div class="md:col-span-3">
                    <InputGroupCheckbox :options="types" v-model="form.data.types" />
                </div>
            </div>

            <!-- type boolean -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label class="text-surface-500">Active</label>
                <ToggleSwitch v-model="form.data.is_active" />
            </div>

            <!-- type popup table -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label class="text-surface-500">Destination</label>
                <div class="col-span-3">
                    <PopupTable button-label="Add Destination" header="Select Destination" :options="countries"
                        v-model="form.data.destination_ids" />
                </div>
            </div>

            <!-- type long text -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label class="text-surface-500">Address</label>
                <InputEditor v-model="form.data.address" class="md:col-span-3" />
            </div>

            <!-- type file/document -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label class="text-surface-500">Document</label>
                <div class="md:col-span-3">
                    <AdvancedFileUpload v-model="form.data.documents" />
                </div>
            </div>
        </div>

        <div class="flex justify-end items-center gap-2">
            <Button label="Back" text @click="router.push({ name: 'customer-list' })" />
            <Button type="submit" label="Save" class="w-20" :loading="form.loading" :disabled="form.loading" />
        </div>
    </form>
</template>
