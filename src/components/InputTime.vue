<script setup>
import moment from 'moment';
import { computed } from 'vue';

const props = defineProps({
    modelValue: String,
    inputId: String,
    dateFormat: String,
    invalid: Boolean
});

const emits = defineEmits(['update:modelValue']);

const value = computed({
    get() {
        return props.modelValue ? moment(props.modelValue, 'HH:mm:ss').toDate() : null;
    },
    set(newValue) {
        emits('update:modelValue', newValue ? moment(newValue).format('HH:mm:ss') : null);
    }
});
</script>

<template>
    <DatePicker v-model="value" input-id="join_date" :date-format="'HH:mm:ss'" :invalid="invalid" show-time />
</template>
