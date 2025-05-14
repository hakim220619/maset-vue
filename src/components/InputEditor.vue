<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: String
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
</script>

<template>
    <Editor
        v-model="value"
        editorStyle="height: 200px"
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
</template>
