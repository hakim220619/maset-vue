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
        return props.modelValue ? new Date(props.modelValue) : null;
    },
    set(newValue) {
        emits('update:modelValue', newValue ? moment(newValue).format('YYYY-MM-DD') : null);
    }
});
</script>

<template>
    <DatePicker v-model="value" input-id="join_date" date-format="yy-mm-dd" :invalid="invalid" />
</template>
