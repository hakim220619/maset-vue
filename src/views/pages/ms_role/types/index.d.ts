export interface Menu {
    id: string;
    parent_id: string | null;
    name: string;
    icon: string | null;
    module_name: string | null;
    address: string;
    order_list: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: string;
    name: string;
    group_id: string;
    group_name: string;
    is_active: boolean;
    permissions: string[];
    created_at: string;
    updated_at: string;
}

export interface Group {
    id: string;
    name: string;
    logo: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface NestedMenu extends Menu {
    children?: Menu[];
}

export interface MenuPermission {
    menu_id: string;
    menu_name: string;
    address?: string;
    permission_name: string;
    permission_id: string;
}

export interface CheckboxState {
    checked: boolean;
    partialChecked: boolean;
}

export interface TreeCheckboxEvent extends Event {
    node: any;
    target: any;
    checked: boolean;
}
