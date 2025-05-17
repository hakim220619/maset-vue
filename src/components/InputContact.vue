<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: [String, Number],
    inputId: String,
    invalid: Boolean,
});

const emits = defineEmits(['update:modelValue']);
const value = ref(props.modelValue ?? '');

// Sinkronisasi dari parent ke local
watch(
    () => props.modelValue,
    (newVal) => {
        value.value = newVal ?? '';
    }
);

function onChange(e) {
    let cleaned = e.target.value.replace(/\D/g, ''); // hapus non-digit

    // Tambahkan '62' di depan jika belum ada
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned.replace(/^0+/, '');
    }

    // Batasi panjang maksimal 15 karakter
    cleaned = cleaned.slice(0, 15);

    value.value = cleaned;
    emits('update:modelValue', cleaned);
}
</script>

<template>
    <InputText :id="inputId" v-model="value" :class="{ 'is-invalid': invalid }" inputmode="numeric" pattern="[0-9]*"
        @change="onChange" />
</template>
