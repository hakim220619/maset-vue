<script setup>
import InputError from '@/components/InputError.vue';
import InputRadio from '@/components/InputRadio.vue';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const dataTypes = ref([
    { label: 'Integer', value: 'integer' },
    { label: 'String', value: 'string' },
    { label: 'Boolean', value: 'boolean' }
]);

const relationTypes = ref([
    { label: 'Dependent', value: 'dependent' },
    { label: 'Independent', value: 'independent' }
]);

const statusTypes = ref([
    { label: 'Inactive', value: 'inactive' },
    { label: 'Active', value: 'active' }
]);
const ValueType = ref([
    { label: 'Any', value: 'Any' },
    { label: 'Discreate', value: 'Discreate' },
    { label: 'Range', value: 'Range' },
    { label: 'Fixed', value: 'Fixed' },
    { label: 'Discreate-Single-Select', value: 'Discreate-Single-Select' }
]);

const router = useRouter();

const form = ref({
    data: {
        externalAttributeId: '',
        name: '',
        context: '',
        usedBy: '',
        defaultAssociation: 'No',
        dataType: 'integer',
        relationType: 'dependent',
        status: 'inactive',
        possibleValues: '',
        queryBased: false
    },
    errors: {
        externalAttributeId: null,
        name: null,
        context: null,
        usedBy: null,
        dataType: null,
        relationType: null,
        status: null,
        possibleValues: null
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
    router.push('/pages/product/attribute');
};
</script>

<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <!-- Left Column -->
            <div class="space-y-4">
                <!-- External Attribute ID -->
                <div class="flex justify-between items-center gap-4">
                    <label for="externalAttributeId" class="text-surface-500 md:w-1/4">External Attribute ID <span class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.externalAttributeId" class="w-full" id="externalAttributeId" :invalid="!!form.errors.externalAttributeId" />
                        <InputError :message="form.errors.externalAttributeId" />
                    </div>
                </div>

                <!-- Context -->
                <div class="flex justify-between items-center gap-4">
                    <label for="context" class="text-surface-500 md:w-1/4">Context <span class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.context" input-id="context" show-clear :options="['Select From Below']" placeholder="Select context" class="w-full" />
                    </div>
                </div>

                <!-- Used By -->
                <div class="flex justify-between items-center gap-4">
                    <label for="usedBy" class="text-surface-500 md:w-1/4">Used By <span class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.usedBy" input-id="usedBy" show-clear :options="['Service Specification']" placeholder="Select used by" class="w-full" />
                    </div>
                </div>

                <!-- Default Association -->
                <div class="flex justify-between items-center gap-4">
                    <label for="defaultAssociation" class="text-surface-500 md:w-1/4">Default Association</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.defaultAssociation" input-id="defaultAssociation" :options="['Yes', 'No']" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
                <!-- Name -->
                <div class="flex justify-between items-center gap-4">
                    <label for="name" class="text-surface-500 md:w-1/4">Name <span class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.name" class="w-full" id="name" :invalid="!!form.errors.name" />
                        <InputError :message="form.errors.name" />
                    </div>
                </div>
                <!-- Data Type -->
                <div class="flex justify-between items-center gap-4">
                    <label for="dataType" class="text-surface-500 md:w-1/4">Data Type <span class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.dataType" input-id="dataType" :options="dataTypes" option-label="label" option-value="value" class="w-full" />
                        <InputError :message="form.errors.dataType" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 md:w-1/4 font-medium">Value Type <span class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <Select
                            v-model="form.data.value_type"
                            input-id="value_type"
                            show-clear
                            :options="ValueType"
                            option-label="label"
                            option-value="value"
                            :virtualScrollerOptions="{ itemSize: 38 }"
                            placeholder="Select Discount Mode"
                            class="w-full"
                            :invalid="!!form.errors.value_type"
                        />
                        <InputError :message="form.errors.value_type" class="text-sm text-red-500 mt-1" />
                    </div>
                </div>

                <!-- Relation Type -->
                <div class="flex justify-between items-center gap-4">
                    <label for="relationType" class="text-surface-500 md:w-1/4">Relation Type <span class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.relationType" input-id="relationType" :options="relationTypes" option-label="label" option-value="value" class="w-full" />
                        <InputError :message="form.errors.relationType" />
                    </div>
                </div>

                <!-- Status -->
                <div class="flex justify-between items-center gap-4">
                    <label for="status" class="text-surface-500 md:w-1/4">Status <span class="text-red-500">*</span></label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.status" input-id="status" :options="statusTypes" option-label="label" option-value="value" class="w-full" />
                        <InputError :message="form.errors.status" />
                    </div>
                </div>

                <!-- Possible Values -->
                <div class="flex justify-between items-center gap-4">
                    <label for="possibleValues" class="text-surface-500 md:w-1/4">Possible Values</label>
                    <div class="md:w-3/4">
                        <textarea v-model="form.data.possibleValues" id="possibleValues" class="w-full" rows="4"></textarea>
                        <InputError :message="form.errors.possibleValues" />
                    </div>
                </div>

                <!-- Query Based -->
                <div class="flex justify-between items-center gap-4">
                    <label for="queryBased" class="text-surface-500 md:w-1/4">Query Based</label>
                    <div class="md:w-3/4">
                        <InputRadio v-model="form.data.queryBased" :options="['Yes', 'No']" />
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
