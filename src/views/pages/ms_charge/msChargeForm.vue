<script setup>
import InputDate from '@/components/InputDate.vue';
import InputError from '@/components/InputError.vue';
import InputRadio from '@/components/InputRadio.vue';
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
const statuses = ref([
    { label: 'Live', value: 'live' },
    { label: 'Inactive', value: 'inactive' }
]);

const currencyes = ref([{ label: 'IDR', value: 'idr' }]);
const triggeringEventes = ref([{ label: 'ALL', value: 'all' }, { label: 'Plan Termination', value: 'plan_termination' }]);
const chargeType = ref([]);
const chargeTypes = ref([]);
const chargeCategories = ref([]);

const recurrenceOptions = [
    { id: 1, name: 'Recurring Limited Period' },
    { id: 2, name: 'Non Recurring' },
    { id: 3, name: 'Recurring' }
];

const filteredRecurrenceOptions = computed(() => {
    if (form.value.data.triggering_event === 'plan_termination') {
        return recurrenceOptions.filter(option => option.id === 3);
    }
    return recurrenceOptions;
});


const form = ref({
    data: {
        name: '',
        category: '',
        description: '',
        charging_pattern: '',
        lookup_policy: '',
        charge_category: '',
        from_date: '',
        to_date: '',
        status: '',
        charge_type: '',
        triggering_event: '',
        proration_flag: '',
        bill_description: '',
        recurrence_pattern: '',
        periods: [0, 0, 0, 0, 0],
        prices: [0, 0, 0, 0, 0],
        price: 0
    },
    errors: {
        name: null,
        category: null,
        description: null,
        charging_pattern: null,
        lookup_policy: null,
        charge_category: null,
        from_date: null,
        to_date: null,
        status: null,
        charge_type: null,
        triggering_event: null,
        proration_flag: null,
        bill_description: null,
        recurrence_pattern: null,
        price: null
    },
    assign: (data = {}) => {
        for (const key in data) {
            if (_.has(form.value.data, key)) {
                if (typeof data[key] === 'boolean' || (data[key] && typeof data[key] === typeof form.value.data[key])) {
                    form.value.data[key] = data[key];
                }
            }
        }
    },
    loading: false
});

const save = async () => {
    form.value.loading = true;

    const url = route.params.id ? 'main_service/ms_charge/' + route.params.id : 'main_service/ms_charge';

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
                text: 'msCharge saved successfully',
                icon: 'success'
            });

            router.push({ name: 'msCharge-list' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to save msCharge',
                icon: 'error'
            });
        }
    }

    form.value.loading = false;
};


onBeforeMount(async () => {
    if (route.params.id) {
        const userData = await Helper.getDataById('gateway/main_service/ms_charge', route.params.id);
        if (userData) {
            form.value.assign(userData);

        }
    }
});

onMounted(async () => {

    const title = route.params.id ? 'Edit Charge' : 'Add Charge';

    Helper.setTitle(title);

    // get master data
    chargeTypes.value = await Helper.getMasterData({ endpoint: 'gateway/main_service/ms_charge_types' });
    chargeCategories.value = await Helper.getMasterData({ endpoint: 'gateway/main_service/ms_charge_categories' });
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
    router.push('/pages/ms_charge');
};
</script>


<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div class="space-y-4">
                <!-- Charge Name -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">Charge Name <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.name" class="w-full" id="name" :invalid="!!form.errors.name" />
                        <InputError :message="form.errors.name" />
                    </div>
                </div>



                <!-- Description -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">Description</label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.description" class="w-full"
                            :invalid="!!form.errors.description" />
                        <InputError :message="form.errors.description" />
                    </div>
                </div>

                <!-- Charging Pattern -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">Charging Pattern <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputRadio v-model="form.data.charging_pattern" :options="['Prepaid', 'Postpaid']" />
                        <InputError :message="form.errors.charging_pattern" />
                    </div>
                </div>
                <!-- Charging Pattern -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">Charge Type <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputRadio v-model="form.data.charge_type" :options="chargeType" />
                        <InputError :message="form.errors.charge_type" />
                    </div>
                </div>

                <!-- Lookup Policy -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">Lookup Policy</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.lookup_policy" :options="['Pilih Salah Satu']"
                            placeholder="Select a policy" class="w-full" :invalid="!!form.errors.lookup_policy" />
                        <InputError :message="form.errors.lookup_policy" />
                    </div>
                </div>

                <div class="flex justify-between items-center gap-4">
                    <label for="ledgerCode" class="text-surface-500 md:w-1/4 dark:text-white">Ledger Code <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.ledgerCode" input-id="ledgerCode" show-clear :options="ledgerCodees"
                            option-label="label" option-value="value" :virtualScrollerOptions="{ itemSize: 38 }"
                            placeholder="Select a ledgerCode" class="w-full" :invalid="!!form.errors.ledgerCode" />
                        <InputError :message="form.errors.ledgerCode" />
                    </div>
                </div>
                <!-- Charge Category -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">Charge Category</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.charge_category" :options=chargeCategories show-clear
                            option-label="name" option-value="id" :virtualScrollerOptions="{ itemSize: 38 }"
                            placeholder="Select a category" class="w-full" :invalid="!!form.errors.charge_category" />
                        <InputError :message="form.errors.charge_category" />
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
                <!-- Start Date -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">Start Date <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputDate class="w-full" v-model="form.data.from_date" />
                        <InputError :message="form.errors.from_date" />
                    </div>
                </div>
                <!-- End Date -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">End Date</label>
                    <div class="md:w-3/4">
                        <InputDate class="w-full" v-model="form.data.to_date" />
                        <InputError :message="form.errors.to_date" />
                    </div>
                </div>

                <!-- Status -->
                <div class="flex justify-between items-center gap-4">
                    <label for="status" class="text-surface-500 md:w-1/4 dark:text-white">Status <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.status" input-id="status" show-clear :options="statuses"
                            option-label="label" option-value="value" :virtualScrollerOptions="{ itemSize: 38 }"
                            placeholder="Select a status" class="w-full" :invalid="!!form.errors.status" />
                        <InputError :message="form.errors.status" />
                    </div>
                </div>
                <!-- Currency -->
                <div class="flex justify-between items-center gap-4">
                    <label for="currency" class="text-surface-500 md:w-1/4 dark:text-white">Currency <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.currency" input-id="currency" show-clear :options="currencyes"
                            option-label="label" option-value="value" :virtualScrollerOptions="{ itemSize: 38 }"
                            placeholder="Select a currency" class="w-full" :invalid="!!form.errors.currency" />
                        <InputError :message="form.errors.currency" />
                    </div>
                </div>


                <!-- Description -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">Bill Description</label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.bill_description" class="w-full"
                            :invalid="!!form.errors.bill_description" />
                        <InputError :message="form.errors.bill_description" />
                    </div>
                </div>
                <!-- Triggering Event -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">Triggering Event</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.triggering_event" input-id="triggering_event" show-clear
                            :options="triggeringEventes" option-label="label" option-value="value"
                            :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a Triggering Event"
                            class="w-full" :invalid="!!form.errors.triggering_event" />
                        <InputError :message="form.errors.triggering_event" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label for="status" class="text-surface-500 md:w-1/4 dark:text-white">Charge Type <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.chargeType" input-id="chargeType" show-clear :options="chargeTypes"
                            option-label="name" option-value="id" :virtualScrollerOptions="{ itemSize: 38 }"
                            placeholder="Select a chargeType" class="w-full" :invalid="!!form.errors.chargeType" />
                        <InputError :message="form.errors.chargeType" />
                    </div>
                </div>
                <!-- Proration Flag -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">Burn Daily <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputRadio v-model="form.data.burnDaily" :options="['Yes', 'No']" />
                        <InputError :message="form.errors.burnDaily" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-2 mt-12">
            <label class="text-surface-500 dark:text-white">Recurrence Pattern</label>
            <Select v-model="form.data.recurrence_pattern" :options="filteredRecurrenceOptions" option-label="name"
                option-value="id" placeholder="Select a recurrence pattern" class="w-full"
                :invalid="!!form.errors.recurrence_pattern" />
            <InputError :message="form.errors.recurrence_pattern" />

            <!-- Show table if Recurring Limited Period is selected -->
            <div v-if="form.data.recurrence_pattern === 1" class="mt-4">
                <h2 class="text-lg font-bold ">Recurring Limited Period</h2>
                <table class="table-auto w-full mt-4">
                    <thead>
                        <tr>
                            <th class="px-4 py-2 bg-orange-500 text-white">SR.NO.</th>
                            <th class="px-4 py-2 bg-orange-500 text-white">CHARGE CYCLE</th>
                            <th class="px-4 py-2 bg-orange-500 text-white">PERIOD(CHARGE CYCLE)</th>
                            <th class="px-4 py-2 bg-orange-500 text-white">PRICE PER CHARGE CYCLE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="px-4 py-2">1</td>
                            <td class="px-4 py-2">Monthly</td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.periods[0]" class="border rounded p-1 w-full" />
                            </td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.prices[0]" class="border rounded p-1 w-full" />
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2">2</td>
                            <td class="px-4 py-2">Bi Monthly</td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.periods[1]" class="border rounded p-1 w-full" />
                            </td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.prices[1]" class="border rounded p-1 w-full" />
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2">3</td>
                            <td class="px-4 py-2">Quarterly</td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.periods[2]" class="border rounded p-1 w-full" />
                            </td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.prices[2]" class="border rounded p-1 w-full" />
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2">4</td>
                            <td class="px-4 py-2">Half Yearly</td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.periods[3]" class="border rounded p-1 w-full" />
                            </td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.prices[3]" class="border rounded p-1 w-full" />
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2">5</td>
                            <td class="px-4 py-2">Yearly</td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.periods[4]" class="border rounded p-1 w-full" />
                            </td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.prices[4]" class="border rounded p-1 w-full" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="form.data.recurrence_pattern === 2" class="mt-4">
                <h2 class="text-lg font-bold">Non Recurring</h2>
                <div class="flex flex-col">
                    <label for="price" class="text-surface-500">Price</label>
                    <input type="number" id="price" v-model="form.data.price" class="border rounded p-2"
                        placeholder="Enter price" />
                </div>
            </div>
            <div v-if="form.data.recurrence_pattern === 3" class="mt-4">
                <h2 class="text-lg font-bold">Recurring</h2>
                <table class="table-auto w-full mt-4">
                    <thead>
                        <tr>
                            <th class="px-4 py-2 bg-orange-500 text-white">SR.NO.</th>
                            <th class="px-4 py-2 bg-orange-500 text-white">CHARGE CYCLE</th>
                            <th class="px-4 py-2 bg-orange-500 text-white">PRICE PER CHARGE CYCLE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="px-4 py-2">1</td>
                            <td class="px-4 py-2">Monthly</td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.prices[0]" class="border rounded p-1 w-full" />
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2">2</td>
                            <td class="px-4 py-2">Bi Monthly</td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.prices[1]" class="border rounded p-1 w-full" />
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2">3</td>
                            <td class="px-4 py-2">Quarterly</td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.prices[2]" class="border rounded p-1 w-full" />
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2">4</td>
                            <td class="px-4 py-2">Half Yearly</td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.prices[3]" class="border rounded p-1 w-full" />
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2">5</td>
                            <td class="px-4 py-2">Yearly</td>
                            <td class="px-4 py-2">
                                <input type="number" v-model="form.data.prices[4]" class="border rounded p-1 w-full" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>
