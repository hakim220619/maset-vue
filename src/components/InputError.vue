<script setup>
defineProps({
    message: {
        type: String,
        default: ''
    }
});
</script>

<template>
    <span class="mt-1 inline-block text-red-600 text-sm" v-if="message">{{ message }}</span>
</template>
