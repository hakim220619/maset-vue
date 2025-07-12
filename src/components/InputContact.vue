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

// Validasi dan format saat input
function onInput(e) {
    let raw = e.target.value;

    // Hapus semua non-digit
    let cleaned = raw.replace(/\D/g, '');

    // Tambahkan '62' jika belum ada
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned.replace(/^0+/, '');
    }

    // Maksimal 13–15 digit total
    cleaned = cleaned.slice(0, 15);

    value.value = cleaned;
    emits('update:modelValue', cleaned);
}

// Cegah input selain angka
function onKeyPress(e) {
    if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
}
</script>

<template>
    <InputText :id="inputId" v-model="value" :class="{ 'is-invalid': invalid }" inputmode="numeric" pattern="[0-9]*"
        @input="onInput" @keypress="onKeyPress" maxlength="15" placeholder="62xxxxxxxxxxx" />
</template>
