<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: [String, Number],
    inputId: String,
    invalid: Boolean
});

const emits = defineEmits(['update:modelValue']);
const value = ref(props.modelValue ?? '');

// Sinkronisasi props ke local value
watch(
    () => props.modelValue,
    (newVal) => {
        value.value = newVal ?? '';
    }
);
</script>

<template>
    <InputText :id="inputId" v-model="value" :class="{ 'is-invalid': invalid }" inputmode="numeric" pattern="[0-9]*"
        @change="(e) => {
            const cleaned = e.target.value.replace(/\D/g, '');
            value = cleaned;
            emits('update:modelValue', cleaned);
        }" />
</template>
