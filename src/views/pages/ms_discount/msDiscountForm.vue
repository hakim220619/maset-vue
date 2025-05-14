<script setup>
import InputError from '@/components/InputError.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';

import InputDate from '@/components/InputDate.vue';
import _ from 'lodash';
import { inject, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import { storeSchema } from './schema.js';



const router = useRouter();
const route = useRoute();
const swal = inject('$swal');
const DiscountAssociationsData = ref([]);
const ReccurancePatternsData = ref([]);
const DiscountProductData = ref([]);
const DiscountModeData = ref([]);

const StatusOptions = ref([
    { label: 'Inactive', id: false },
    { label: 'Live', id: true }
]);



const calculateMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};
const minDate = calculateMinDate();

const form = ref({
    data: {
        name: '',
        description: '',
        discount_type: '',
        value_policy: '',
        ms_reccurance_pattern_id: '',
        discounted_product: '',
        start_date: '',
        end_date: '',
        is_active: '',
        ms_discount_association_id: '',
        ledger_code: '',
        discount_value: '',
        ms_discount_mode_id: ''
    },
    errors: {
        name: null,
        description: null,
        discount_type: null,
        value_policy: null,
        ms_reccurance_pattern_id: null,
        discounted_product: null,
        start_date: null,
        end_date: null,
        is_active: null,
        ms_discount_association_id: null,
        ledger_code: null,
        discount_value: null,
        ms_discount_mode_id: null
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

    const url = route.params.id ? 'gateway/main_service/ms_discount/' + route.params.id : 'gateway/main_service/ms_discount';

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
                text: 'Discount saved successfully',
                icon: 'success'
            });

            router.push({ name: 'Ms Discount List' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to save Discount',
                icon: 'error'
            });
        }
    }

    form.value.loading = false;
};

onBeforeMount(async () => {
    if (route.params.id) {
        const userData = await Helper.getDataById('gateway/main_service/ms_discount', route.params.id);
        if (userData) {
            form.value.assign(userData);

        }
    }
});

onMounted(async () => {
    const title = route.params.id ? 'Edit Discount' : 'Add Discount';

    Helper.setTitle(title);

    DiscountAssociationsData.value = await Helper.getMasterData({ endpoint: 'gateway/main_service/ms_discount_associations/' });
    ReccurancePatternsData.value = await Helper.getMasterData({ endpoint: 'gateway/main_service/ms_reccurance_patterns/' });
    DiscountProductData.value = await Helper.getMasterData({ endpoint: 'gateway/main_service/ms_discount_products/' });
    DiscountModeData.value = await Helper.getMasterData({ endpoint: 'gateway/main_service/ms_discount_mode/' });
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
    router.push('/pages/ms_discount');
};
</script>

<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <!-- Left Column -->
            <div class="space-y-4">
                <!-- Discount Name -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Name <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.name" class="w-full" id="name" :invalid="!!form.errors.name" />
                        <InputError :message="form.errors.name" class="text-sm text-red-500 mt-1" />
                    </div>
                </div>

                <!-- Discount Description -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Description</label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.description" class="w-full" id="description"
                            :invalid="!!form.errors.description" />
                        <InputError :message="form.errors.description" class="text-sm text-red-500 mt-1" />
                    </div>
                </div>

                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">Discount Type<span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputRadio v-model="form.data.discount_type"
                            v-if="form.data.ms_discount_association_id === 'EjDVLjJnuv3hd2WmIR0X'"
                            :options="['Normal']" />
                        <InputRadio v-else v-model="form.data.discount_type" :options="['Normal', 'Policy Based']" />
                        <InputError :message="form.errors.discount_type" />
                    </div>
                </div>

                <!-- Value Policy -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Value Policy</label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.value_policy" class="w-full" id="value_policy"
                            :invalid="!!form.errors.value_policy" />
                        <InputError :message="form.errors.value_policy" class="text-sm text-red-500 mt-1" />
                    </div>
                </div>
                <!-- Value Policy -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Discount Value <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.discount_value" class="w-full" id="discount_value"
                            :invalid="!!form.errors.discount_value" />
                        <InputError :message="form.errors.discount_value" class="text-sm text-red-500 mt-1" />
                    </div>
                </div>
                <!-- Ledger Code -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Ledger Code</label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.ledger_code" class="w-full" id="ledger_code"
                            :invalid="!!form.errors.ledger_code" />
                        <InputError :message="form.errors.ledger_code" class="text-sm text-red-500 mt-1" />
                    </div>
                </div>
                <!-- Discount Mode -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Discount Mode <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.ms_discount_mode_id" input-id="ms_discount_mode_id" show-clear
                            :options="DiscountModeData" option-label="name" option-value="id"
                            :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select Discount Mode" class="w-full"
                            :invalid="!!form.errors.ms_discount_mode_id" />
                        <InputError :message="form.errors.ms_discount_mode_id" class="text-sm text-red-500 mt-1" />
                    </div>
                </div>
            </div>
            <div class="space-y-4">
                <!-- Start Date -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Start Date</label>
                    <div class="md:w-3/4">

                        <InputDate v-model="form.data.start_date" :minDate="minDate" :manualInput="false"
                            class="w-full" />

                        <InputError :message="form.errors.start_date" />
                    </div>
                </div>
                <!-- End Date -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">End Date</label>
                    <div class="md:w-3/4">
                        <InputDate v-model="form.data.end_date" :minDate="minDate" :manualInput="false"
                            class="w-full" />
                        <InputError :message="form.errors.end_date" />
                    </div>
                </div>
                <!-- Status -->
                <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                    <label class="text-surface-500 dark:text-white">Active</label>
                    <ToggleSwitch v-model="form.data.is_active" />
                </div>

                <!-- Discount Association -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Discount Association</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.ms_discount_association_id" input-id="ms_discount_association_id"
                            show-clear :options="DiscountAssociationsData" option-label="name" option-value="id"
                            :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select Discount Association"
                            class="w-full" :invalid="!!form.errors.ms_discount_association_id" />
                        <InputError :message="form.errors.ms_discount_association_id"
                            class="text-sm text-red-500 mt-1" />
                    </div>
                </div>
                <!-- Recurrence Pattern -->
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Recurrence Pattern</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.ms_reccurance_pattern_id" input-id="ms_reccurance_pattern_id"
                            show-clear :options="ReccurancePatternsData" option-label="name" option-value="id"
                            :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select Recurrence Pattern"
                            class="w-full" :invalid="!!form.errors.ms_reccurance_pattern_id" />
                        <InputError :message="form.errors.ms_reccurance_pattern_id" class="text-sm text-red-500 mt-1" />
                    </div>
                </div>
                <div v-if="form.data.ms_reccurance_pattern_id === 'Recurring Limited Period'"
                    class="flex justify-between items-center gap-4 mt-4">
                    <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">No Of Cycle <span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.no_of_cycle" class="w-full" id="no_of_cycle"
                            :invalid="!!form.errors.no_of_cycle" />
                        <InputError :message="form.errors.no_of_cycle" class="text-sm text-red-500 mt-1" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Discounted Product</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.discounted_product" input-id="discounted_product" show-clear
                            :options="DiscountProductData" option-label="name" option-value="id"
                            :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select Discounted Product"
                            class="w-full" :invalid="!!form.errors.discounted_product" />
                        <InputError :message="form.errors.discounted_product" class="text-sm text-red-500 mt-1" />
                    </div>
                </div>
                <div v-if="form.data.ms_discount_association_id === 'EjDVLjJnuv3hd2WmIR0X'"
                    class="flex justify-between items-center gap-4 mt-4">
                    <label class="text-surface-500 md:w-1/4 dark:text-white">Override<span
                            class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputRadio v-model="form.data.discount_type" :options="['Yes', 'No ']" />
                        <InputError :message="form.errors.discount_type" />
                    </div>
                </div>
                <div v-if="form.data.discounted_product === 'EjDVLjJnuv3hd2WmIR0X'" class="grid grid-cols-1 gap-y-4">
                    <!-- Discount Name -->
                    <div class="flex justify-between items-center gap-4">
                        <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Charge Installation Value
                        </label>
                        <div class="md:w-3/4">
                            <InputText v-model="form.data.charge_installation_value" class="w-full"
                                id="charge_installation_value" :invalid="!!form.errors.charge_installation_value" />
                            <InputError :message="form.errors.charge_installation_value"
                                class="text-sm text-red-500 mt-1" />
                        </div>
                    </div>
                    <div class="flex justify-between items-center gap-4">
                        <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Charge Device Value <span
                                class="text-red-500">*</span></label>
                        <div class="md:w-3/4">
                            <InputText v-model="form.data.charge_installation_value" class="w-full"
                                id="charge_installation_value" :invalid="!!form.errors.charge_installation_value" />
                            <InputError :message="form.errors.charge_installation_value"
                                class="text-sm text-red-500 mt-1" />
                        </div>
                    </div>
                    <div class="flex justify-between items-center gap-4">
                        <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Charge Package Value <span
                                class="text-red-500">*</span></label>
                        <div class="md:w-3/4">
                            <InputText v-model="form.data.charge_installation_value" class="w-full"
                                id="charge_installation_value" :invalid="!!form.errors.charge_installation_value" />
                            <InputError :message="form.errors.charge_installation_value"
                                class="text-sm text-red-500 mt-1" />
                        </div>
                    </div>
                    <div class="flex justify-between items-center gap-4">
                        <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Ledger Code Installation
                        </label>
                        <div class="md:w-3/4">
                            <InputText v-model="form.data.charge_installation_value" class="w-full"
                                id="charge_installation_value" :invalid="!!form.errors.charge_installation_value" />
                            <InputError :message="form.errors.charge_installation_value"
                                class="text-sm text-red-500 mt-1" />
                        </div>
                    </div>
                    <div class="flex justify-between items-center gap-4">
                        <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Ledger Code Device</label>
                        <div class="md:w-3/4">
                            <InputText v-model="form.data.charge_installation_value" class="w-full"
                                id="charge_installation_value" :invalid="!!form.errors.charge_installation_value" />
                            <InputError :message="form.errors.charge_installation_value"
                                class="text-sm text-red-500 mt-1" />
                        </div>
                    </div>
                    <div class="flex justify-between items-center gap-4">
                        <label class="text-surface-500 md:w-1/4 font-medium dark:text-white">Ledger Code Package</label>
                        <div class="md:w-3/4">
                            <InputText v-model="form.data.charge_installation_value" class="w-full"
                                id="charge_installation_value" :invalid="!!form.errors.charge_installation_value" />
                            <InputError :message="form.errors.charge_installation_value"
                                class="text-sm text-red-500 mt-1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Action Buttons -->
        <div class="flex justify-end items-center gap-2 mt-6">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>
