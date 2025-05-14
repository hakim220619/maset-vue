<script setup>
import DropdownButton from '@/components/DropdownButton.vue';
import { ref } from 'vue';

const props = defineProps({
    columns: {
        type: Array,
        default: () => []
    }
});

const emits = defineEmits(['next', 'prev', 'update:columns']);
const columns = ref(props.columns);

const dialogTitle = ref('');

const visible = ref(false);
const isEdit = ref(false);
const editIndex = ref();

const rowField = ref({
    name: '',
    label: '',
    table_field: '',
    type: '',
    required: false,
    unique: false,
    options: []
});

const columnOptions = [
    { id: 'varchar', name: 'Varchar' },
    { id: 'text', name: 'Text' },
    { id: 'editor', name: 'Editor' },
    { id: 'datetime', name: 'Datetime' },
    { id: 'date', name: 'Date' },
    { id: 'number', name: 'Number' },
    { id: 'money', name: 'Money' },
    { id: 'boolean', name: 'True/False' },
    { id: 'file', name: 'File' },
    { id: 'image', name: 'Image' },
    { id: 'dropdown_static', name: 'Dropdown static value' },
    { id: 'dropdown_db', name: 'Dropdown from database' },
    { id: 'checkbox_static', name: 'Checkbox static value' },
    { id: 'checkbox_db', name: 'Checkbox from database' }
];

const onShowDialog = () => {
    dialogTitle.value = isEdit.value ? 'Update Column' : 'Add Column';
};

const resetRowField = () => {
    // set to default value
    rowField.value = {
        name: '',
        label: '',
        table_field: '',
        type: '',
        required: false,
        unique: false
    };

    // hide form dialog
    visible.value = false;

    isEdit.value = false;
};

const updateColumn = () => {
    columns.value[editIndex.value] = rowField.value;
    visible.value = false;
};

const addColumn = () => {
    columns.value.push(rowField.value);

    // trigger reactive form
    emits('update:columns', columns.value);

    // hide form dialog
    visible.value = false;
};

const saveColumn = () => {
    if (!isEdit.value) addColumn();
    else updateColumn(editIndex.value);

    console.log(columns.value);
};

const removeColumn = (rowIndex) => {
    columns.value = columns.value.filter((item, index) => index != rowIndex);

    // trigger reactive form
    emits('update:columns', columns.value);
};

const items = [
    {
        label: 'Ubah',
        command: (e) => {
            isEdit.value = true;
            visible.value = true;
            editIndex.value = e.item.index;

            rowField.value = columns.value[e.item.index];
        }
    },
    {
        label: 'Hapus',
        command: (e) => {
            removeColumn(e.item.index);
        }
    }
];
</script>

<template>
    <div class="">
        <div class="flex items-end justify-between">
            <div>
                <div class="font-semibold text-xl mb-4">Columns</div>
                <p>Setup the table columns, and the form interface.</p>
            </div>

            <Button label="Add Column" icon="pi pi-fw pi-plus" text @click="visible = true"> </Button>
        </div>

        <DataTable :value="columns" class="mt-4" tableStyle="min-width: 50rem">
            <Column field="name" header="Name"></Column>
            <Column field="label" header="Label"></Column>
            <Column field="table_field" header="Table Field"></Column>
            <Column field="type" header="Type"></Column>
            <Column field="required" header="Required"></Column>
            <Column field="unique" header="Unique"></Column>

            <Column>
                <template #body="{ index }">
                    <div class="flex gap-1 justify-end">
                        <DropdownButton :items="items" :menu-key="index" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
    <div class="flex pt-6 justify-between">
        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="(e) => emits('prev', e)" />
        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="(e) => emits('next', e)" />
    </div>

    <Dialog v-model:visible="visible" modal :header="dialogTitle" dismissable-mask position="top" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" @show="onShowDialog()" @after-hide="resetRowField()">
        <div class="space-y-6">
            <div class="grid grid-cols-4">
                <label for="label">Label</label>
                <InputText id="label" v-model="rowField.label" class="col-span-2" />
            </div>

            <div class="grid grid-cols-4">
                <label for="name">Nama</label>
                <InputText id="name" v-model="rowField.name" class="col-span-2" />
            </div>

            <div class="grid grid-cols-4">
                <label for="table_field">Table Field</label>
                <InputText id="table_field" v-model="rowField.table_field" class="col-span-2" />
            </div>

            <div class="grid grid-cols-4">
                <label for="type">Tipe</label>

                <div class="col-span-2">
                    <Select v-model="rowField.type" :options="columnOptions" optionLabel="name" option-value="id" placeholder="Pilih Tipe" class="w-full" />

                    <div class="mt-4">
                        <span class="inline-block text-surface-500">Options</span>
                        <div class="grid grid-cols-2 gap-2" v-for="(opt, index) in rowField.options" :key="index">
                            <div>
                                <FloatLabel variant="on">
                                    <InputText :id="'option_' + index" v-model="opt.id" />
                                    <label :for="'option_' + index">On Label</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-4">
                <label>Required</label>
                <ToggleSwitch v-model="rowField.required" />
            </div>

            <div class="grid grid-cols-4">
                <label>Unique</label>
                <ToggleSwitch v-model="rowField.unique" />
            </div>
        </div>

        <template #footer>
            <div class="flex gap-2 items-center justify-end">
                <Button label="Cancel" severity="secondary" text @click="visible = false" />
                <Button label="Apply" @click="saveColumn" />
            </div>
        </template>
    </Dialog>
</template>
