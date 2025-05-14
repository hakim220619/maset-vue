<script setup>
import InputError from '@/components/InputError.vue';
import InputRadio from '@/components/InputRadio.vue';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const Packages_name = ref([
    { label: 'Free 5 Mbps', value: 'Free 5 Mbps' },
    { label: 'Kuta', value: 'Kuta' },
    { label: 'Jimbaran Ekstra', value: 'Jimbaran Ekstra' },
    { label: 'Kuta Super', value: 'Kuta Super' }
]);
const Diskon_name = ref([
    { label: 'DISCOUNT 11 MONTHS', value: 'DISCOUNT 11 MONTHS' },
    { label: 'DISCOUNT 3 MONTH 30 PERCENT', value: 'DISCOUNT 3 MONTH 30 PERCENT' },
    { label: 'Discount Contributor', value: 'Discount Contributor' },
    { label: 'DISCOUNT 15%', value: 'DISCOUNT 15%' }
]);
const Bill_discount = ref([
    { label: 'Customer Ceria', value: 'Customer Ceria' },
    { label: 'Customer Experience', value: 'Customer Experience' },
    { label: 'Other', value: 'Other' }
]);
const router = useRouter();

const form = ref({
    data: {
        applicable_on: 'Billing Account',
        billing_account: '',
        service_instance_account: '',
        discounted_product: '',
        discount_type: 'Normal',
        discount_mode: 'Percentage',
        discount_value: 100,
        discount_name: 'Discount Contributor',
        no_cycle: '',
        end_date: ''
    },
    errors: {
        applicable_on: null,
        billing_account: null,
        service_instance_account: null,
        discounted_product: null,
        discount_value: null,
        discount_name: null,
        end_date: null
    },
    assign: (data = {}) => {
        for (const key in data) {
            if (form.value.data[key] !== undefined && data[key] !== undefined) {
                form.value.data[key] = data[key];
            }
        }
    },
    loading: false
});

const save = async () => {
    // Handle the saving logic for the form data
};

onBeforeMount(() => {
    // Initialize form data if needed
});

onMounted(() => {
    // Setup necessary data like categories or options
});

const goBack = () => {
    router.push('/pages/product/discountGlobal');
};

const isBillingAccountSelected = ref(false);

// Watch for changes in the Billing Account selection
const onBillingAccountChange = () => {
    isBillingAccountSelected.value = form.value.data.billing_account !== '';
};

// Watch for changes in the Applicable On selection
watch(
    () => form.value.data.applicable_on,
    (newValue) => {
        if (newValue === 'Billing Account') {
            isBillingAccountSelected.value = form.value.data.billing_account !== '';
        } else {
            isBillingAccountSelected.value = false;
        }
    }
);
</script>

<template>
    <form class="card mt-8" @submit.prevent="save">
        <!-- Applicable On Section -->
        <div class="flex justify-between items-center gap-1">
            <label class="text-surface-500 md:w-1/4 font-medium">Applicable On <span class="text-red-500">*</span></label>
            <div class="md:w-3/4">
                <InputRadio v-model="form.data.applicable_on" :options="['All', 'Billing Account']" class="w-full" />
                <InputError :message="form.errors.applicable_on" class="text-sm text-red-500 mt-1" />
            </div>
        </div>
        <!-- Conditional Content Based on "Applicable On" Selection -->
        <div v-if="form.data.applicable_on === 'billing_account'">
            <!-- Billing Account Field -->
            <div class="flex justify-between items-center gap-4 mt-4">
                <label class="text-surface-500 md:w-1/4 font-medium">Billing Account <span class="text-red-500">*</span></label>
                <div class="md:w-3/4">
                    <Select
                        v-model="form.data.billing_account"
                        input-id="billing_account"
                        show-clear
                        :options="Packages_name"
                        option-label="label"
                        option-value="value"
                        :virtualScrollerOptions="{ itemSize: 38 }"
                        placeholder="Select Billing Account"
                        class="w-full"
                        :invalid="!!form.errors.billing_account"
                        @change="onBillingAccountChange"
                    />
                    <InputError :message="form.errors.billing_account" class="text-sm text-red-500 mt-1" />
                </div>
            </div>
            <div class="flex justify-between items-center gap-4 mt-4">
                <label class="text-surface-500 md:w-1/4 font-medium">Service Instance Account <span class="text-red-500">*</span></label>
                <div class="md:w-3/4">
                    <Select
                        v-model="form.data.billing_account"
                        input-id="billing_account"
                        show-clear
                        :options="Packages_name"
                        option-label="label"
                        option-value="value"
                        :virtualScrollerOptions="{ itemSize: 38 }"
                        placeholder="Select Service Instance Account"
                        class="w-full"
                        :invalid="!!form.errors.billing_account"
                        @change="onBillingAccountChange"
                    />
                    <InputError :message="form.errors.billing_account" class="text-sm text-red-500 mt-1" />
                </div>
            </div>

            <!-- Service Instance Account Field -->
            <div v-show="isBillingAccountSelected" class="flex justify-between items-center gap-4 mt-4">
                <label for="service_instance_account" class="text-surface-500 md:w-1/4 font-medium">Service Instance Account <span class="text-red-500">*</span></label>
                <div class="md:w-3/4">
                    <InputText v-model="form.data.service_instance_account" class="w-full" id="service_instance_account" :invalid="!!form.errors.service_instance_account" />
                    <InputError :message="form.errors.service_instance_account" class="text-sm text-red-500 mt-1" />
                </div>
            </div>
        </div>
        <div class="flex justify-between items-center gap-4 mt-4">
            <label class="text-surface-500 md:w-1/4 font-medium">Discount Name <span class="text-red-500">*</span></label>
            <div class="md:w-3/4">
                <Select
                    v-model="form.data.discount_name"
                    input-id="discount_name"
                    show-clear
                    :options="Diskon_name"
                    option-label="label"
                    option-value="value"
                    :virtualScrollerOptions="{ itemSize: 38 }"
                    placeholder="Select Billing Account"
                    class="w-full"
                    :invalid="!!form.errors.discount_name"
                    @change="onBillingAccountChange"
                />
                <InputError :message="form.errors.discount_name" class="text-sm text-red-500 mt-1" />
            </div>
        </div>
        <!-- Discounted Product Field -->
        <div class="flex justify-between items-center gap-4 mt-4">
            <label for="discounted_product" class="text-surface-500 md:w-1/4 font-medium">Discounted Product <span class="text-red-500">*</span></label>
            <div class="md:w-3/4">
                <InputText v-model="form.data.discounted_product" class="w-full" id="discounted_product" :invalid="!!form.errors.discounted_product" />
                <InputError :message="form.errors.discounted_product" class="text-sm text-red-500 mt-1" />
            </div>
        </div>

        <!-- Discount Value Field -->
        <div class="flex justify-between items-center gap-4 mt-4">
            <label for="discount_value" class="text-surface-500 md:w-1/4 font-medium">Discount Value <span class="text-red-500">*</span></label>
            <div class="md:w-3/4">
                <InputText v-model="form.data.discount_value" class="w-full" id="discount_value" :invalid="!!form.errors.discount_value" />
                <InputError :message="form.errors.discount_value" class="text-sm text-red-500 mt-1" />
            </div>
        </div>

        <!-- Discount Type Field -->
        <div class="flex justify-between items-center gap-4 mt-4">
            <label for="discount_type" class="text-surface-500 md:w-1/4 font-medium">Discount Type <span class="text-red-500">*</span></label>
            <div class="md:w-3/4">
                <Select v-model="form.data.discount_type" input-id="discount_type" show-clear :options="['Normal', 'Special']" placeholder="Select Discount Type" class="w-full" :invalid="!!form.errors.discount_type" />
                <InputError :message="form.errors.discount_type" class="text-sm text-red-500 mt-1" />
            </div>
        </div>

        <!-- Discount Value Field -->
        <div class="flex justify-between items-center gap-4 mt-4">
            <label for="discount_mode" class="text-surface-500 md:w-1/4 font-medium">Discount Mode <span class="text-red-500">*</span></label>
            <div class="md:w-3/4">
                <InputText v-model="form.data.discount_mode" class="w-full" id="discount_mode" :invalid="!!form.errors.discount_mode" />
                <InputError :message="form.errors.discount_mode" class="text-sm text-red-500 mt-1" />
            </div>
        </div>
        <div class="flex justify-between items-center gap-4 mt-4">
            <label class="text-surface-500 md:w-1/4 font-medium">Bill Description <span class="text-red-500">*</span></label>
            <div class="md:w-3/4">
                <Select
                    v-model="form.data.bill_discount"
                    input-id="bill_discount"
                    show-clear
                    :options="Bill_discount"
                    option-label="label"
                    option-value="value"
                    :virtualScrollerOptions="{ itemSize: 38 }"
                    placeholder="Select Billing Account"
                    class="w-full"
                    :invalid="!!form.errors.bill_discount"
                    @change="onBillingAccountChange"
                />
                <InputError :message="form.errors.bill_discount" class="text-sm text-red-500 mt-1" />
                <div v-if="form.data.bill_discount === 'Other'" class="flex justify-between items-center gap-4 mt-4">
                    <div class="w-full">
                        <InputText v-model="form.data.bill_other" class="w-full" id="bill_other" :invalid="!!form.errors.bill_other" />
                        <InputError :message="form.errors.bill_other" class="text-sm text-red-500 mt-1" />
                    </div>
                </div>
            </div>
        </div>

        <!-- End Date Field -->
        <div class="flex justify-between items-center gap-4 mt-4">
            <label for="no_cycle" class="text-surface-500 md:w-1/4 font-medium">No Cycle</label>
            <div class="md:w-3/4">
                <InputText v-model="form.data.no_cycle" class="w-full" id="no_cycle" :invalid="!!form.errors.no_cycle" />
                <InputError :message="form.errors.no_cycle" class="text-sm text-red-500 mt-1" />
            </div>
        </div>
        <div v-if="form.data.applicable_on === 'billing_account'">
            <!-- To Date -->
            <div class="flex justify-between items-center gap-4 mt-4">
                <label class="text-surface-500 md:w-1/4">To Date </label>
                <div class="md:w-3/4">
                    <InputDate class="w-full" v-model="form.data.to_date" />
                    <InputError :message="form.errors.to_date" />
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
