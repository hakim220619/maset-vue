import AppLayout from '@/layout/AppLayout.vue';
import { AuthApi } from '@/service/Api';
import nprogress from 'nprogress';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/',
                name: 'dashboard',
                exact: true,
                component: () => import('@/views/dashboards/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Dashboard' }]
                }
            },
            {
                path: '/dashboard-banking',
                name: 'dashboard-banking',
                component: () => import('@/views/dashboards/Banking.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Banking Dashboard' }]
                }
            },
            {
                path: '/apps/blog/list',
                component: () => import('@/views/apps/blog/List.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Apps', label: 'Blog', item: 'List' }]
                }
            },
            {
                path: '/apps/blog/detail',
                component: () => import('@/views/apps/blog/Detail.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Apps', label: 'Blog', item: 'Detail' }]
                }
            },
            {
                path: '/apps/blog/edit',
                name: 'blog-edit',
                component: () => import('@/views/apps/blog/Edit.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Apps', label: 'Blog', item: 'Edit' }]
                }
            },
            {
                path: '/apps/files',
                name: 'files',
                component: () => import('@/views/apps/Files.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Apps', label: 'Files' }]
                }
            },
            {
                path: '/apps/chat',
                name: 'chat',
                component: () => import('@/views/apps/chat/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Apps', label: 'Chat' }]
                }
            },
            {
                path: '/apps/tasklist',
                name: 'tasklist',
                component: () => import('@/views/apps/tasklist/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Apps', label: 'Task List' }]
                }
            },
            {
                path: '/apps/mail',
                component: () => import('@/views/apps/mail/Index.vue'),
                children: [
                    {
                        path: '/apps/mail/inbox',
                        name: 'mail-inbox',
                        component: () => import('@/views/apps/mail/MailTypes.vue'),
                        meta: {
                            requiresAuth: true,
                            breadcrumb: [{ parent: 'Apps', label: 'Mail', item: 'Inbox' }]
                        }
                    },
                    {
                        path: '/apps/mail/compose',
                        name: 'mail-compose',
                        component: () => import('@/views/apps/mail/ComposeNew.vue'),
                        meta: {
                            requiresAuth: true,
                            breadcrumb: [{ parent: 'Apps', label: 'Mail', item: 'Compose' }]
                        }
                    },
                    {
                        path: '/apps/mail/detail/:id',
                        name: 'mail-detail',
                        component: () => import('@/views/apps/mail/Detail.vue'),
                        meta: {
                            requiresAuth: true,
                            breadcrumb: [{ parent: 'Apps', label: 'Mail', item: 'Detail' }]
                        }
                    },
                    {
                        path: '/apps/mail/starred',
                        component: () => import('@/views/apps/mail/MailTypes.vue'),
                        meta: {
                            requiresAuth: true,
                            breadcrumb: [{ parent: 'Apps', label: 'Mail', item: 'Starred' }]
                        }
                    },
                    {
                        path: '/apps/mail/spam',
                        component: () => import('@/views/apps/mail/MailTypes.vue'),
                        meta: {
                            requiresAuth: true,
                            breadcrumb: [{ parent: 'Apps', label: 'Mail', item: 'Spam' }]
                        }
                    },
                    {
                        path: '/apps/mail/important',
                        component: () => import('@/views/apps/mail/MailTypes.vue'),
                        meta: {
                            requiresAuth: true,
                            breadcrumb: [{ parent: 'Apps', label: 'Mail', item: 'Important' }]
                        }
                    },
                    {
                        path: '/apps/mail/sent',
                        component: () => import('@/views/apps/mail/MailTypes.vue'),
                        meta: {
                            requiresAuth: true,
                            breadcrumb: [{ parent: 'Apps', label: 'Mail', item: 'Sent' }]
                        }
                    },
                    {
                        path: '/apps/mail/archived',
                        component: () => import('@/views/apps/mail/MailTypes.vue'),
                        meta: {
                            requiresAuth: true,
                            breadcrumb: [{ parent: 'Apps', label: 'Mail', item: 'Archived' }]
                        }
                    },
                    {
                        path: '/apps/mail/trash',
                        component: () => import('@/views/apps/mail/MailTypes.vue'),
                        meta: {
                            requiresAuth: true,
                            breadcrumb: [{ parent: 'Apps', label: 'Mail', item: 'Trash' }]
                        }
                    }
                ]
            },
            {
                path: '/uikit/formlayout',
                name: 'formlayout',

                component: () => import('@/views/uikit/FormLayoutDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'Form Layout' }]
                }
            },
            {
                path: '/uikit/input',
                name: 'input',
                component: () => import('@/views/uikit/InputDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'Input' }]
                }
            },
            {
                path: '/uikit/button',
                name: 'button',
                component: () => import('@/views/uikit/ButtonDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'Button' }]
                }
            },
            {
                path: '/uikit/table',
                name: 'table',
                component: () => import('@/views/uikit/TableDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'Table' }]
                }
            },

            {
                path: '/uikit/tree',
                name: 'tree',
                component: () => import('@/views/uikit/TreeDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'Tree' }]
                }
            },
            {
                path: '/uikit/panel',
                name: 'panel',
                component: () => import('@/views/uikit/PanelsDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'Panel' }]
                }
            },
            {
                path: '/uikit/overlay',
                name: 'overlay',
                component: () => import('@/views/uikit/OverlayDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'Overlay' }]
                }
            },
            {
                path: '/uikit/media',
                name: 'media',
                component: () => import('@/views/uikit/MediaDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'Media' }]
                }
            },
            {
                path: '/uikit/menu/',
                component: () => import('@/views/uikit/MenuDoc.vue')
            },
            {
                path: '/uikit/message',
                name: 'message',
                component: () => import('@/views/uikit/MessagesDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'Messages' }]
                }
            },
            {
                path: '/uikit/file',
                name: 'file',
                component: () => import('@/views/uikit/FileDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'File' }]
                }
            },
            {
                path: '/uikit/charts',
                name: 'charts',
                component: () => import('@/views/uikit/ChartDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'Charts' }]
                }
            },
            {
                path: '/uikit/timeline',
                name: 'timeline',
                component: () => import('@/views/uikit/TimelineDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'Timeline' }]
                }
            },
            {
                path: '/uikit/misc',
                name: 'misc',
                component: () => import('@/views/uikit/MiscDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'Misc' }]
                }
            },
            {
                path: '/uikit/list',
                name: 'list',
                component: () => import('@/views/uikit/ListDoc.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'UI Kit', label: 'List' }]
                }
            },
            {
                path: '/pages/crud',
                name: 'crud',
                component: () => import('@/views/pages/Crud.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Pages', label: 'Crud' }]
                }
            },
            {
                path: 'pages/invoice',
                name: 'invoice',
                component: () => import('@/views/pages/Invoice.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Pages', label: 'Invoice' }]
                }
            },
            {
                path: 'pages/help',
                name: 'help',
                component: () => import('@/views/pages/Help.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Pages', label: 'Help' }]
                }
            },
            {
                path: 'pages/empty',
                name: 'empty',
                component: () => import('@/views/pages/Empty.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Pages', label: 'Empty Page' }]
                }
            },
            {
                path: 'pages/generator',
                name: 'generator',
                component: () => import('@/views/pages/Generator.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Form Generator' }]
                }
            },
            {
                path: 'pages/customer',
                name: 'customer-list',
                component: () => import('@/views/pages/customer/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Customer' }]
                }
            },
            {
                path: 'pages/customer/create',
                name: 'customer-create',
                component: () => import('@/views/pages/customer/CustomerForm.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Customer', item: 'Add Customer' }]
                }
            },
            {
                path: 'pages/customer/:id/edit',
                name: 'customer-edit',
                component: () => import('@/views/pages/customer/CustomerForm.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Customer', item: 'Add Customer' }]
                }
            },
            {
                path: 'pages/users',
                name: 'Users-list',
                component: () => import('@/views/pages/users/index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Users' }]
                }
            },
            {
                path: 'pages/users/create',
                name: 'Users-create',
                component: () => import('@/views/pages/users/form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Users', item: 'Add Users' }]
                }
            },
            {
                path: 'pages/users/:id/edit',
                name: 'Users-edit',
                component: () => import('@/views/pages/users/form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Users', item: 'Edit Users' }]
                }
            },

            {
                path: 'pages/broadcast/whatsapp',
                name: 'Whatsapp-list',
                component: () => import('@/views/pages/broadcast/whatsapp/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Whatsapp' }]
                }
            },
            {
                path: 'pages/pembanding',
                name: 'Pembanding List',
                component: () => import('@/views/pages/pembanding/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Tanah' }]
                }
            },

            {
                path: 'pages/pembanding/create',
                name: 'Pembanding Create',
                component: () => import('@/views/pages/pembanding/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Pembanding', item: 'Add Pembanding' }]
                }
            },
            {
                path: 'pages/pembanding/:id/edit',
                name: 'Tanah Edit',
                component: () => import('@/views/pages/pembanding/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Pembanding', item: 'Edit Pembanding' }]
                }
            },

            {
                path: 'pages/object/tanah',
                name: 'Tanah List',
                component: () => import('@/views/pages/object/tanah/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Tanah' }]
                }
            },
            {
                path: 'pages/object/tanah/create',
                name: 'Tanah Create',
                component: () => import('@/views/pages/object/tanah/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Tanah', item: 'Add Tanah' }]
                }
            },
            {
                path: 'pages/object/tanah/:id/edit',
                name: 'Tanah Edit',
                component: () => import('@/views/pages/object/tanah/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Tanah', item: 'Edit Tanah' }]
                }
            },
            {
                path: 'pages/object/bangunan',
                name: 'Bangunan List',
                component: () => import('@/views/pages/object/bangunan/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Bangunan' }]
                }
            },
            {
                path: 'pages/object/bangunan/create',
                name: 'Bangunan Create',
                component: () => import('@/views/pages/object/bangunan/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Bangunan', item: 'Add Bangunan' }]
                }
            },
            {
                path: 'pages/object/bangunan/:id/edit',
                name: 'Bangunan Edit',
                component: () => import('@/views/pages/object/bangunan/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Bangunan', item: 'Edit Bangunan' }]
                }
            },

            {
                path: 'pages/ms_icons',
                name: 'Icons List',
                component: () => import('@/views/pages/ms_icons/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Icons' }]
                }
            },
            {
                path: 'pages/ms_icons/create',
                name: 'Icons Create',
                component: () => import('@/views/pages/ms_icons/msIconsForm.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Icons', item: 'Add Icons' }]
                }
            },
            {
                path: 'pages/ms_icons/:id/edit',
                name: 'Icons Edit',
                component: () => import('@/views/pages/ms_icons/msIconsForm.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Icons', item: 'Edit Icons' }]
                }
            },

            {
                path: 'pages/sys_company',
                name: 'Company List',
                component: () => import('@/views/pages/sys_company/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Company' }]
                }
            },
            {
                path: 'pages/sys_company/create',
                name: 'Company Create',
                component: () => import('@/views/pages/sys_company/sysCompanyForm.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Company', item: 'Add Company' }]
                }
            },
            {
                path: 'pages/sys_company/:id/edit',
                name: 'Company Edit',
                component: () => import('@/views/pages/sys_company/sysCompanyForm.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Company', item: 'Edit Company' }]
                }
            },

            {
                path: 'pages/attribute',
                name: 'Attribute',
                component: () => import('@/views/pages/attribute/index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Attribute' }]
                }
            },
            {
                path: 'pages/attribute/create',
                name: 'attribute-create',
                component: () => import('@/views/pages/attribute/create.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Attribute', item: 'Add Attribute' }]
                }
            },

            {
                path: '/pages/ms_role',
                name: 'msrole',
                component: () => import('@/views/pages/ms_role/index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Master Role', item: 'Edit Master Role' }]
                }
            },
            {
                path: '/pages/ms_role/create',
                name: 'msrole.create',
                component: () => import('@/views/pages/ms_role/MasterRoleForm.vue'),
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/ms_role/:id/edit',
                name: 'Master Roles Edit',
                component: () => import('@/views/pages/ms_role/MasterRoleForm.vue'),
                meta: {
                    requiresAuth: true
                }
            },

            {
                path: 'pages/menu_management',
                name: 'menuManagement-list',
                component: () => import('@/views/pages/menu_management/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Setting', label: 'Menu Management' }]
                }
            },
            {
                path: 'pages/menu_management/create',
                name: 'menuManagement-create',
                component: () => import('@/views/pages/menu_management/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Setting', label: 'Menu Management', item: 'Add Menu Management' }]
                }
            },
            {
                path: 'pages/menu_management/:id/edit',
                name: 'menuManagement-edit',
                component: () => import('@/views/pages/menu_management/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Setting', label: 'Menu Management', item: 'Edit Menu Management' }]
                }
            },
            {
                path: 'pages/role_structure',
                name: 'roleStructure-list',
                component: () => import('@/views/pages/role_structure/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Setting', label: 'Role Structure' }]
                }
            },
            {
                path: 'pages/role_structure/create',
                name: 'roleStructure-create',
                component: () => import('@/views/pages/role_structure/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Setting', label: 'Role Structure', item: 'Add Role Structure' }]
                }
            },
            {
                path: 'pages/role_structure/:id/edit',
                name: 'roleStructure-edit',
                component: () => import('@/views/pages/role_structure/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Setting', label: 'Role Structure', item: 'Edit Role Structure' }]
                }
            },
            {
                path: 'pages/role_access',
                name: 'roleAccess-list',
                component: () => import('@/views/pages/role_access/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Setting', label: 'Role Access' }]
                }
            },
            {
                path: 'pages/role_access/create',
                name: 'roleAccess-create',
                component: () => import('@/views/pages/role_access/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Setting', label: 'Role Access', item: 'Add Role Access' }]
                }
            },
            {
                path: 'pages/role_access/:id/edit',
                name: 'roleAccess-edit',
                component: () => import('@/views/pages/role_access/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Setting', label: 'Role Access', item: 'Edit Role Access' }]
                }
            },
            {
                path: 'pages/role',
                name: 'role-list',
                component: () => import('@/views/pages/role/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Setting', label: 'Role' }]
                }
            },
            {
                path: 'pages/role/create',
                name: 'role-create',
                component: () => import('@/views/pages/role/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Setting', label: 'Role', item: 'Add Role' }]
                }
            },
            {
                path: 'pages/role/:id/edit',
                name: 'role-edit',
                component: () => import('@/views/pages/role/Form.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Setting', label: 'Role', item: 'Edit Role' }]
                }
            },

            {
                path: '/ecommerce/product-overview',
                name: 'product-overview',
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'E-Commerce', label: 'Product Overview' }]
                },
                component: () => import('@/views/e-commerce/ProductOverview.vue')
            },
            {
                path: 'pages/tbl_header',
                name: 'tbl-header-list',
                component: () => import('@/views/pages/header/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Tbl Header' }]
                }
            },
            {
                path: 'pages/tbl_header/create',
                name: 'tbl-header-create',
                component: () => import('@/views/pages/header/HeaderForm.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Tbl Header' }]
                }
            },
            {
                path: 'pages/tbl_header/:id/edit',
                name: 'tbl-header-edit',
                component: () => import('@/views/pages/header/HeaderForm.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Tbl Header' }]
                }
            },
            {
                path: '/ecommerce/product-list',
                name: 'product-list',
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'E-Commerce', label: 'Product List' }]
                },
                component: () => import('@/views/e-commerce/ProductList.vue')
            },
            {
                path: '/ecommerce/shopping-cart',
                name: 'shopping-cart',
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'E-Commerce', label: 'Shopping Chart' }]
                },
                component: () => import('@/views/e-commerce/ShoppingCart.vue')
            },
            {
                path: '/ecommerce/new-product',
                name: 'new-product',
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'E-Commerce', label: 'New Product' }]
                },
                component: () => import('@/views/e-commerce/NewProduct.vue')
            },
            {
                path: '/ecommerce/order-history',
                name: 'order-history',
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'E-Commerce', label: 'Order History' }]
                },
                component: () => import('@/views/e-commerce/OrderHistory.vue')
            },
            {
                path: '/ecommerce/order-summary',
                name: 'order-summary',
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'E-Commerce', label: 'Order Summary' }]
                },
                component: () => import('@/views/e-commerce/OrderSummary.vue')
            },
            {
                path: '/ecommerce/checkout-form',
                name: 'checkout-form',
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'E-Commerce', label: 'Checkout Form' }]
                },
                component: () => import('@/views/e-commerce/CheckoutForm.vue')
            },
            {
                path: '/documentation',
                name: 'documentation',
                component: () => import('@/views/utilities/Documentation.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ label: 'Documentation' }]
                }
            },

            {
                path: '/blocks',
                name: 'blocks',
                component: () => import('@/views/utilities/Blocks.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'Utilities', label: 'Blocks' }]
                }
            },
            {
                path: 'pages/profile',
                name: 'profile',
                component: () => import('@/views/pages/profile/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'User Management', label: 'Profile' }]
                }
            },
            {
                path: 'pages/aplikasi',
                name: 'aplikasi',
                component: () => import('@/views/pages/aplikasi/Index.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'User Management', label: 'Aplikasi' }]
                }
            },
            {
                path: '/profile/list',
                name: 'profile-list',
                component: () => import('@/views/user-management/UserList.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'User Management', label: 'List' }]
                }
            },
            {
                path: '/profile/create',
                name: 'user-create',
                component: () => import('@/views/user-management/UserCreate.vue'),
                meta: {
                    requiresAuth: true,
                    breadcrumb: [{ parent: 'User Management', label: 'Create' }]
                }
            }
        ]
    },
    {
        path: '/auth/login',
        name: 'login',
        component: () => import('@/views/pages/auth/Login3.vue')
    },
    {
        path: '/auth/register',
        name: 'register',
        component: () => import('@/views/pages/auth/Register.vue')
    },
    {
        path: '/auth/forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/pages/auth/ForgotPassword.vue')
    },
    {
        path: '/auth/reset-password',
        name: 'reset-password',
        component: () => import('@/views/pages/auth/ResetPassword.vue')
    },
    {
        path: '/auth/login2',
        name: 'login2',
        component: () => import('@/views/pages/auth/Login2.vue')
    },
    {
        path: '/auth/access',
        name: 'accessDenied',
        component: () => import('@/views/pages/auth/AccessDenied.vue')
    },
    {
        path: '/auth/access2',
        name: 'accessDenied2',
        component: () => import('@/views/pages/auth/AccessDenied2.vue')
    },
    {
        path: '/auth/error',
        name: 'error',
        component: () => import('@/views/pages/auth/Error.vue')
    },
    {
        path: '/auth/error2',
        name: 'error2',
        component: () => import('@/views/pages/auth/Error2.vue')
    },
    {
        path: '/pages/notfound',
        name: 'notfound',
        component: () => import('@/views/pages/NotFound.vue')
    },
    {
        path: '/pages/notfound2',
        name: 'notfound2',
        component: () => import('@/views/pages/NotFound2.vue')
    },
    {
        path: '/landing',
        name: 'landing',
        component: () => import('@/views/pages/Landing.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: () => import('@/views/pages/NotFound.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { left: 0, top: 0 };
    }
});

router.beforeEach(async (to, from, next) => {
    nprogress.start();

    const response = await AuthApi.checkAuth();

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (response) {
            next();
        } else {
            next({ name: 'login' });
        }
    } else {
        if (['login', 'reset-password', 'forgot-password'].includes(to.name) && response) {
            next({ name: 'dashboard' });
        }

        next();
    }
});

router.afterEach(() => {
    nprogress.done();
});

router.onError(() => {
    nprogress.done();
});

export default router;
