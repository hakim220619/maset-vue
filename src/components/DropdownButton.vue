<script setup>
import { ref } from 'vue';

const props = defineProps({
    items: Array,
    id: {
        type: String,
        default: 'overlay_menu'
    },
    severity: {
        type: String,
        default: 'secondary'
    },
    icon: {
        type: String,
        default: 'pi pi-ellipsis-h'
    },
    menuKey: {
        type: [String, Number]
    },
    data: {
        type: Object
    }
});

const menu = ref(null);

const menuItems = ref([]);

for (const item of props.items) {
    menuItems.value.push({
        ...item,
        data: props.data,
        key: props.menuKey
    });
}

const toggle = (event) => {
    menu.value.toggle(event);
};
</script>

<template>
    <Button type="button" :icon="icon" @click="toggle" :severity="severity" />
    <Menu ref="menu" :id="id" :model="menuItems" :popup="true" />
</template>
