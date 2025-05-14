<script setup>
import InputError from '@/components/InputError.vue';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref, watch } from 'vue';
import { z } from 'zod';

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    }
});

const emits = defineEmits(['update:modelValue']);

const value = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emits('update:modelValue', newValue);
    }
});

const displayValue = computed(() => {
    return value.value.filter((item) => item.method !== 'delete');
});

const collapse = ref(false);
const visible = ref(false);

// editing mode
const isEditing = ref(false);
const selectedIndexDetail = ref(null);

const panelToggleIcon = computed(() => {
    return ['pi', collapse.value ? 'pi-chevron-down' : 'pi-chevron-up'].join(' ');
});

const form = ref({
    data: {
        field_name: '',
        label_name: '',
        type_name: '',
        unique_data: false,
        mandatory: false,
        indexing: false
    },
    errors: {
        field_name: null,
        label_name: null,
        type_name: null,
        unique_data: null,
        mandatory: null,
        indexing: null
    }
});

const schema = z.object({
    field_name: z.string().min(1, { message: 'Field name is required' }).max(255),
    label_name: z.string().min(1, { message: 'Label name is required' }).max(255),
    type_name: z.string().min(1, { message: 'Type name is required' }).max(255)
});

const saveDetail = () => {
    try {
        schema.parse(form.value.data);

        if (isEditing.value) {
            // add flag to update existing detail
            if (value.value[selectedIndexDetail.value].id) {
                form.value.data.method = 'update';
            }

            for (const key in form.value.data) {
                value.value[selectedIndexDetail.value][key] = form.value.data[key];
            }
        } else {
            value.value.push({ ...form.value.data, uuid: uuidv4() });
        }

        visible.value = false;
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        }
    }
};

const deleteDetail = (id) => {
    selectedIndexDetail.value = value.value.findIndex((val) => val.id === id);

    // check if there is attribute id
    if (selectedIndexDetail.value !== undefined && value.value[selectedIndexDetail.value].id) {
        value.value[selectedIndexDetail.value].method = 'delete';
    } else {
        value.value = value.value.filter((v) => v.uuid !== id);
    }
};

const editDetail = (id) => {
    isEditing.value = true;
    selectedIndexDetail.value = value.value.findIndex((val) => val.id === id || val.uuid === id);

    for (const key in form.value.data) {
        form.value.data[key] = value.value[selectedIndexDetail.value][key];
    }

    visible.value = true;
};

const resetForm = () => {
    form.value = {
        data: {
            field_name: '',
            label_name: '',
            type_name: '',
            unique_data: false,
            mandatory: false,
            indexing: false
        },
        errors: {
            field_name: null,
            label_name: null,
            type_name: null,
            unique_data: null,
            mandatory: null,
            indexing: null
        }
    };

    isEditing.value = false;
    selectedIndexDetail.value = null;
};

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
    <Panel header="Tbl Details" toggleable v-model:collapsed="collapse" class="mt-8">
        <template #icons>
            <Button icon="pi pi-fw pi-plus-circle" label="Add detail" rounded text @click="visible = true" />
        </template>

        <template #toggleicon>
            <Button :icon="panelToggleIcon" severity="secondary" rounded text />
        </template>

        <template #default>
            <DataTable :value="displayValue" tableStyle="min-width: 50rem">
                <Column field="field_name" header="Field Name"></Column>
                <Column field="label_name" header="Label Name"></Column>
                <Column field="type_name" header="Type Name"></Column>
                <Column field="unique_data" header="Unique Data"></Column>
                <Column field="mandatory" header="Mandatory"></Column>
                <Column field="indexing" header="Indexing"></Column>
                <Column>
                    <template #body="{ data }">
                        <div class="flex justify-end gap-2">
                            <Button icon="pi pi-pencil" outlined severity="secondary" @click="editDetail(data.id ?? data.uuid)" />
                            <Button icon="pi pi-trash" outlined severity="secondary" @click="deleteDetail(data.id ?? data.uuid)" />
                        </div>
                    </template>
                </Column>

                <template #empty>
                    <div class="text-center">No data to display</div>
                </template>
            </DataTable>

            <Dialog v-model:visible="visible" modal dismissable-mask header="Detail" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" @after-hide="resetForm">
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1">
                        <label for="field_name">Field Name</label>
                        <InputText v-model="form.data.field_name" id="field_name" class="w-full" />
                        <InputError :message="form.errors.field_name" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="label_name">Label Name</label>
                        <InputText v-model="form.data.label_name" id="label_name" class="w-full" />
                        <InputError :message="form.errors.label_name" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="type_name">Type Name</label>
                        <InputText v-model="form.data.type_name" id="type_name" class="w-full" />
                        <InputError :message="form.errors.type_name" />
                    </div>
                </div>

                <div class="mt-4">
                    <label for="unique_data" class="py-3 px-1 text-surface-500 hover:bg-surface-50 flex items-center justify-between cursor-pointer">
                        Unique Data

                        <ToggleSwitch v-model="form.data.unique_data" inputId="unique_data" />
                    </label>

                    <label for="mandatory" class="py-3 px-1 text-surface-500 hover:bg-surface-50 flex items-center justify-between cursor-pointer">
                        Mandatory

                        <ToggleSwitch v-model="form.data.mandatory" inputId="mandatory" />
                    </label>

                    <label for="indexing" class="py-3 px-1 text-surface-500 hover:bg-surface-50 flex items-center justify-between cursor-pointer">
                        Indexing

                        <ToggleSwitch v-model="form.data.indexing" inputId="indexing" />
                    </label>
                </div>

                <template #footer>
                    <Button label="Cancel" @click="visible = false" severity="secondary" />
                    <Button label="Save" @click="saveDetail" />
                </template>
            </Dialog>
        </template>
    </Panel>
</template>
