<script setup>
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { onMounted, ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const menu = ref([]);


onMounted(async () => {
    try {
        const { role, role_structure, role_access } = Helper.getUsersLocalStorage()

        // ✅ Kirim ke endpoint /menus sebagai query params
        const response = await AuthApi.client().get('/menus', {
            params: {
                role_id: role,
                role_structure_id: role_structure,
                role_access_id: role_access
            }
        });

        // ✅ Cek response dan ubah data ke format frontend
        if (response.data.success) {
            const apiMenu = response.data.data;
            menu.value = transformMenu(apiMenu);
        }
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
});
function transformMenu(apiMenu) {
    const grouped = apiMenu.reduce((acc, item) => {
        const { parent_id } = item;
        if (!acc[parent_id]) acc[parent_id] = [];
        acc[parent_id].push(item);
        return acc;
    }, {});

    function createMenuItems(parentId) {
        const items = (grouped[parentId] || []).sort((a, b) => a.order_list - b.order_list);


        return items.map(item => {

            const transformedItem = {
                label: item.name,
                icon: item.icon || 'pi pi-fw pi-cog',
                to: `/${item.address}`,
            };

            const children = createMenuItems(item.menu_id);
            if (children.length > 0) {
                transformedItem.items = children;
            }

            return transformedItem;
        });
    }

    return createMenuItems(null).sort((a, b) => a.order_list - b.order_list);
}



</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in menu" :key="item.label">
            <AppMenuItem :item="item" root :index="i" />
            <li class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
