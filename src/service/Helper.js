import { useTitle } from '@vueuse/core';
import collect from 'collect.js';
import _ from 'lodash';
import { AuthApi } from './Api';


const title = useTitle();
const storedApp = localStorage.getItem('aplikasi');

// if (JSON.parse(storedApp) !== null) {
const appName = storedApp ? JSON.parse(storedApp).title : 'APP';
// } else {
//     const router = useRouter();
//     router.push({ name: 'notfound' });

// }



const objectToFormData = (obj = {}, form = new FormData(), namespace = '') => {
    for (const key in obj) {
        if (_.has(obj, key)) {
            const formKey = namespace ? `${namespace}[${key}]` : key;
            if (typeof obj[key] === 'object' && !(obj[key] instanceof File)) {
                objectToFormData(obj[key], form, formKey);
            } else {
                form.append(formKey, obj[key]);
            }
        }
    }
    return form;
};

export const Helper = {
    objectToFormData,
    getAppLocalStorage() {
        const raw = localStorage.getItem('aplikasi');

        if (!raw) return {};

        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error('Invalid JSON in localStorage.aplikasi');
            return {};
        }
    },
    getUsersLocalStorage() {
        const raw = localStorage.getItem('userData');

        if (!raw) return {};

        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error('Invalid JSON in localStorage.aplikasi');
            return {};
        }
    },


    parseFormdata(data = {}) {
        const formData = new FormData();

        for (const key in data) {
            if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
                if (typeof data[key] === 'object' && Array.isArray(data[key])) {
                    for (const item of data[key]) {
                        if (typeof item === 'object' && !(item instanceof File)) {
                            formData.append(key, JSON.stringify(item));
                        } else {
                            formData.append(key, item);
                        }
                    }
                } else {
                    formData.append(key, JSON.stringify(data[key]));
                }
            } else {
                formData.append(key, data[key]);
            }
        }

        return formData;
    },

    setTitle(str) {
        title.value = appName + ' - ' + str;
    },

    async getMasterData({ endpoint, params = {}, data = ['id', 'name'] }) {
        const response = await AuthApi.client().get(endpoint);

        const items = collect(response.data.data)
            .map((item) => {
                const newData = {};

                for (const field of data) {
                    newData[field] = item[field];
                }

                return newData;
            })
            .toArray();

        return items;
    },

    async exportExcelFromApi(endpoint, fileName, params = {}) {
        try {
            const response = await AuthApi.client().get(endpoint + '?' + new URLSearchParams(params), {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error during export:', error);
            throw new Error('There was an error during export.');
        }
    },

    formatSearchParams(searchValue) {
        const params = {};

        for (const key in searchValue) {
            if (searchValue[key] !== '' && searchValue[key] !== null) {
                params[key] = searchValue[key] === true ? 1 : searchValue[key] === false ? 0 : searchValue[key];
            }
        }

        return params;
    },
    async getDataById(endpoint, id) {
        try {
            const response = await AuthApi.client().get(`${endpoint}/${id}`);

            if (response.data.success) {
                return response.data.data; // Return the first data element if success
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Let the calling component handle the error instead of router navigation
            throw error;
        }
    },
    async getAllData(endpoint) {
        try {
            const response = await AuthApi.client().get(endpoint);

            if (response.data.success) {
                return response.data.data; // Mengembalikan semua data jika berhasil
            }
        } catch (error) {
            console.error('Gagal mengambil data:', error);
            return []; // Kembalikan array kosong sebagai fallback
        }
    },



    async getUserLocalStorage() {
        const raw = localStorage.getItem('userData');

        if (!raw) return {};

        try {
            const parsed = JSON.parse(raw);
            return {
                ...parsed,
                role_structure: parseInt(parsed.role_structure) || null,
                role_access: parseInt(parsed.role_access) || null,
                rs_name: (parsed.rs_name || ''),
            };
        } catch (e) {
            console.error('Invalid JSON in localStorage.userData');
            return {};
        }
    },
    async getRoleJson() {
        return [1, 2, 3, 4]

    },

    async getRoleStructures() {
        try {
            const { role_structure, rs_name } = await Helper.getUserLocalStorage();
            const roleJson = await Helper.getRoleJson();

            const response = await AuthApi.client().get('/role_structure');
            let data = response.data.data;

            if (role_structure === roleJson[0]) {
                data = response.data.data;
            } else {
                if ([33, 34, 35].includes(role_structure)) {
                    data = data.filter(item =>
                        item.rs_name.includes(rs_name)
                    )
                } else {
                    data = data.filter(item =>
                        item.rs_id === role_structure
                    )
                }
            }


            return data.map(item => ({
                name: item.rs_name,
                id: item.rs_id,
            }));
        } catch (error) {
            console.error('Failed to fetch role structures:', error);
            return [];
        }
    },
    async getRoleAccess() {
        try {
            const { role_access, role_structure } = await Helper.getUserLocalStorage();
            const roleJson = await Helper.getRoleJson();

            const response = await AuthApi.client().get('/role_access');
            let data = response.data.data;

            if (role_structure == roleJson[0]) {
                data = response.data.data;
            } else {
                data = data.filter(item =>
                    item.ra_id !== roleJson[0]
                );
            }

            return data.map(item => ({
                name: item.ra_name,
                id: item.ra_id,
            }));
        } catch (error) {
            console.error('Failed to fetch role structures:', error);
            return [];
        }
    },
    async getRole() {
        try {
            const { role_access, role_structure } = await Helper.getUserLocalStorage();
            const roleJson = await Helper.getRoleJson();

            const response = await AuthApi.client().get('/role');
            let data = response.data.data;

            if (role_structure == roleJson[0]) {
                data = response.data.data;
            } else {
                data = data.filter(item =>
                    item.role_id !== roleJson[0]
                );
            }

            return data.map(item => ({
                name: item.role_name,
                id: item.role_id,
            }));
        } catch (error) {
            console.error('Failed to fetch role structures:', error);
            return [];
        }
    },
    async getStatus() {
        try {

            const response = await AuthApi.client().get('/status');
            let data = response.data.data;

            return data.map(item => ({
                name: item.status_name,
                id: item.id,
            }));
        } catch (error) {
            console.error('Failed to fetch role structures:', error);
            return [];
        }
    },


    async fetchUsers() {
        try {
            const response = await AuthApi.client().get('/users');
            const allUsers = response.data.data;

            const { rs_name = '', role_structure } = await Helper.getUserLocalStorage();

            if (role_structure === 1) {
                return allUsers;
            }

            if ([33, 34, 35].includes(role_structure)) {
                const name = rs_name.toLowerCase();
                return allUsers.filter(user =>
                    user.rs_name?.toLowerCase().includes(name)
                );
            }

            return allUsers.filter(user =>
                user.role_structure === role_structure && user.role_access !== 1
            );

        } catch (error) {
            console.error('Failed to fetch users:', error);
            return [];
        }
    },
    getStatusLabel(status) {
        const statusMap = {
            1: 'ACTIVE',
            2: 'INACTIVE',
            3: 'SUSPENDED',
            4: 'VERIFICATION',
            ACTIVE: 'ACTIVE',
            INACTIVE: 'INACTIVE',
            SUSPENDED: 'SUSPENDED',
            VERIFICATION: 'VERIFICATION'
        };
        return statusMap[status] || 'UNKNOWN';
    },

    getStatusSeverity(status) {
        const severityMap = {
            ACTIVE: 'success',
            INACTIVE: 'danger',
            SUSPENDED: 'warning',
            VERIFICATION: 'info'
        };
        const normalized = this.getStatusLabel(status); // gunakan label yang telah dinormalisasi
        return severityMap[normalized] || null;
    }




};
