import { AuthApi } from './Api';

export const MenuService = {
    getData() {
        return AuthApi.client().get('gateway/idp/menu');
    },

    getTreeData(apiMenu) {

        const grouped = apiMenu.reduce((acc, item) => {
            const { parent_id } = item;
            if (!acc[parent_id]) acc[parent_id] = [];
            acc[parent_id].push(item);
            return acc;
        }, {});

        function createMenuItems(parentId) {
            const items = (grouped[parentId] || []).sort((a, b) => a.order_list - b.order_list);
            return items.map((item) => {
                const transformedItem = {
                    key: item.id,
                    data: {
                        ...item
                    },
                    label: item.name,
                    icon: item.icon || 'pi pi-fw pi-cog',
                    to: `/${item.address}`
                };

                const children = createMenuItems(item.id);
                if (children.length > 0) {
                    transformedItem.children = children;
                }

                return transformedItem;
            });
        }

        return createMenuItems(null).sort((a, b) => a.order_list - b.order_list);
    },

    getMenuPermissions() {
        return AuthApi.client().get('gateway/idp/menu/has_permission');
    }
};
