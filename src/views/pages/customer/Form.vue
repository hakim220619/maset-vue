<script setup>
import { onMounted, ref } from 'vue';

const form = ref({
    name: '',
    number: null,
    date: null,
    datetime: null,
    money: null,
    dropdown: null,
    switch: null,
    pizza: ['Cheese', 'Mushroom', 'Pepper', 'Onion'],
    editor: null
});

const staticDropdownOption = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);

const recipes = ref(['Cheese', 'Mushroom', 'Pepper', 'Onion']);
const dropdownOptionFromDb = ref([]);

const onClick = () => {
    const formData = new FormData();

    for (const key in form) {
        formData.append(key, form[key]);
    }
};

onMounted(() => {});
</script>

<template>
    <div class="flex items-center justify-between">
        <h3 class="text-xl text-slate-700 font-semibold leading-3">Add Customer</h3>
    </div>

    <div class="card mt-8">
        <div class="grid grid-cols-2 gap-x-32 gap-y-4">
            <div class="grid grid-cols-4 gap-4">
                <label for="name" class="text-surface-500">Varchar</label>
                <InputText v-model="form.name" class="col-span-3" id="name" />
            </div>

            <div class="grid grid-cols-4 gap-4">
                <label for="integeronly" class="text-surface-500">Integer</label>
                <InputNumber v-model="form.number" inputId="integeronly" class="col-span-3" fluid locale="en-US" />
            </div>

            <div class="grid grid-cols-4 gap-4">
                <label for="date" class="text-surface-500">Date</label>
                <DatePicker v-model="form.date" input-id="date" class="col-span-3" date-format="yy-mm-dd" />
            </div>

            <div class="grid grid-cols-4 gap-4">
                <label for="datepicker-24h" class="text-surface-500">Datetime</label>
                <DatePicker id="datepicker-24h" v-model="form.datetime" class="col-span-3" showTime hourFormat="24" date-format="yy-mm-dd" fluid />
            </div>

            <div class="grid grid-cols-4 gap-4">
                <label for="money" class="text-surface-500">Money</label>
                <InputNumber v-model="form.money" inputId="money" fluid class="col-span-3" locale="en-US" mode="currency" currency="IDR" />
            </div>

            <div class="grid grid-cols-4 gap-4">
                <label class="text-surface-500">Dropdown</label>
                <Select v-model="form.dropdown" :options="staticDropdownOption" optionLabel="name" placeholder="Select a City" class="col-span-3" />
            </div>

            <div class="grid grid-cols-4 gap-4">
                <label class="text-surface-500">True/False</label>
                <ToggleSwitch v-model="form.switch" />
            </div>

            <div class="grid grid-cols-4 gap-4">
                <label class="text-surface-500">Checkbox</label>
                <div class="flex justify-between flex-wrap gap-2 mt-2 col-span-3">
                    <div class="flex items-center gap-2" v-for="(recipe, index) in recipes" :key="recipe">
                        <Checkbox v-model="form.pizza" :inputId="'ingredient_' + index" name="pizza" :value="recipe" />
                        <label :for="'ingredient_' + index"> {{ recipe }} </label>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-4">
                <label class="text-surface-500">Text Editor</label>
                <Editor
                    v-model="form.editor"
                    editorStyle="height: 320px"
                    class="col-span-3"
                    :pt="{
                        content: {
                            class: '!font-sans'
                        }
                    }"
                >
                    <template #toolbar>
                        <span class="ql-formats">
                            <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
                            <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
                            <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
                        </span>

                        <span class="ql-formats">
                            <button class="ql-list" value="ordered" type="button"></button>
                            <button class="ql-list" value="bullet" type="button"></button>
                            <select class="ql-align">
                                <option defaultValue></option>
                                <option value="center"></option>
                                <option value="right"></option>
                                <option value="justify"></option>
                            </select>
                        </span>
                    </template>
                </Editor>
            </div>
        </div>
    </div>
</template>
