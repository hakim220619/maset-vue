<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { computed, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    },
    header: String,
    buttonLabel: {
        type: String,
        default: 'click me'
    },
    options: {
        type: Array,
        default: () => []
    }
});

const emits = defineEmits(['update:modelValue']);

const visible = ref(false);
const selection = ref([]);

const selected = computed(() => props.options.filter((item) => props.modelValue.includes(item.id)));

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const onDialogOpen = () => {
    selection.value = props.options.filter((item) => props.modelValue.includes(item.id));
};

const onRemoveChip = (e) => {
    selection.value = selection.value.filter((item) => item.id !== e.id);

    emits(
        'update:modelValue',
        selection.value.map((item) => item.id)
    );
};

const save = () => {
    emits(
        'update:modelValue',
        selection.value.map((item) => item.id)
    );

    visible.value = false;
};
</script>

<template>
    <div class="flex flex-wrap gap-3">
        <Chip :label="item.name" removable v-for="item in selected" :key="item.id" @remove="onRemoveChip(item)" />
    </div>

    <Button :label="buttonLabel" link @click="visible = true"></Button>

    <Dialog v-model:visible="visible" modal :header="props.header" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" @show="onDialogOpen">
        <DataTable
            v-model:filters="filters"
            v-model:selection="selection"
            selectionKey="id"
            :value="options"
            dataKey="id"
            scrollable
            stripedRows
            scrollHeight="400px"
            :virtualScrollerOptions="{ itemSize: 46 }"
            tableStyle="min-width: 50rem"
            :globalFilterFields="['name']"
        >
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="name" header="Name"></Column>

            <template #header>
                <div class="flex justify-end">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
        </DataTable>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="save"></Button>
            </div>
        </template>
    </Dialog>
</template>
