import { useTitle } from '@vueuse/core';
import collect from 'collect.js';
import _ from 'lodash';
import { useRouter } from 'vue-router';
import { AuthApi } from './Api';


const title = useTitle();
const appName = import.meta.env.VITE_APP_NAME;

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
        const router = useRouter();
        try {
            const response = await AuthApi.client().get(`${endpoint}/${id}`);
            if (response.data.success) {
                return response.data.data[0]; // Return the first data element if success
            }
        } catch (error) {
            if ([400, 404].includes(error.status)) {
                router.push({ name: 'notfound' });
            }
        }
    },



};
