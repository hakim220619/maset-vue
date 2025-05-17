<script setup>
defineProps({
    value: String,
    required: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <label class="font-medium text-black dark:text-white">
        <slot>
            <span>{{ value }}</span>
        </slot>

        <span v-if="required" class="text-red-500">*</span>
    </label>
</template>
