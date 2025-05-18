<!-- components/StatusCard.vue -->
<template>
    <div :class="`p-4 bg-white rounded-lg shadow dark:bg-gray-800 flex items-center`">
        <div :class="`p-3 rounded-full ${iconBg}`">
            <slot name="icon" />
        </div>
        <div class="ml-4">
            <div class="text-sm text-gray-500 dark:text-gray-300">{{ label }}</div>
            <div :class="`text-2xl font-bold ${valueColor}`">{{ value }}</div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    value: [String, Number],
    iconBg: String,
    valueColor: String
});
</script>