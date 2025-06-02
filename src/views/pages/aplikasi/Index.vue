<script setup>
import TextContact from '@/components/InputContact.vue';
import InputError from '@/components/InputError.vue';
import Label from '@/components/Label.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import _ from 'lodash';
import { inject, onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import { storeSchema } from './schema.js';


const router = useRouter();
const swal = inject('$swal');

const form = ref({
    data: {
        owner: '',
        address: '',
        contact: '',
        title: '',
        name: '',
        logo: '',
        copyright: '',
        version: '',
        whatsapp_token: '',
        whatsapp_url: ''
    },
    errors: {
        owner: null,
        address: null,
        contact: null,
        title: null,
        name: null,
        logo: null,
        copyright: null,
        version: null,
        whatsapp_token: null,
        whatsapp_url: null
    },
    assign: (data = {}) => {
        for (const key in data) {
            if (_.has(form.value.data, key)) {
                form.value.data[key] = data[key];
            }
        }
    },
    loading: false
});

const save = async () => {
    form.value.loading = true;
    const url = 'aplikasi/1/aplikasi';

    try {
        storeSchema.parse(form.value.data);

        const formData = new FormData();
        for (const key in form.value.data) {
            formData.append(key, form.value.data[key]);
        }

        const response = await AuthApi.client()({
            url,
            method: 'put',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.success) {

            swal.fire({
                title: 'Success',
                text: 'Application saved successfully',
                icon: 'success'
            });
            router.push({ name: 'aplikasi' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to save application data',
                icon: 'error'
            });
        }
    }

    form.value.loading = false;
};


for (const key in form.value.data) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}

onBeforeMount(async () => {
    const appData = await Helper.getDataById('aplikasi', 1);
    if (appData) {
        form.value.assign(appData);
    }

});


const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.value.data.logo = file;
    }
};


const goBack = () => {
    router.push('/pages/aplikasi');
};
</script>

<template>
    <form class="card mt-8 p-6" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div>
                <Label for="name" class="block mb-1 text-gray-700">Name</Label>
                <InputText v-model="form.data.name" id="name" class="w-full" :invalid="!!form.errors.name" />
                <InputError :message="form.errors.name" />
            </div>

            <!-- Title -->
            <div>
                <Label for="title" class="block mb-1 text-gray-700">Title</Label>
                <InputText v-model="form.data.title" id="title" class="w-full" :invalid="!!form.errors.title" />
                <InputError :message="form.errors.title" />
            </div>

            <!-- Owner -->
            <div>
                <Label for="owner" class="block mb-1 text-gray-700">Owner</Label>
                <InputText v-model="form.data.owner" id="owner" class="w-full" :invalid="!!form.errors.owner" />
                <InputError :message="form.errors.owner" />
            </div>

            <!-- Address -->


            <!-- Contact -->
            <div>
                <Label for="contact" class="block mb-1 text-gray-700">Contact</Label>
                <TextContact v-model="form.data.contact" id="contact" class="w-full" :invalid="!!form.errors.contact" />
                <InputError :message="form.errors.contact" />
            </div>

            <!-- Logo Upload -->
            <div>
                <Label for="logo" class="block mb-1 text-gray-700">Logo</Label>
                <InputText type="file" @change="e => form.data.logo = e.target.files[0]" class="w-full" />
                <InputError :message="form.errors.logo" />
            </div>

            <!-- Copyright -->
            <div>
                <Label for="copyright" class="block mb-1 text-gray-700">Copyright</Label>
                <InputText v-model="form.data.copyright" id="copyright" class="w-full"
                    :invalid="!!form.errors.copyright" />
                <InputError :message="form.errors.copyright" />
            </div>

            <!-- Version -->
            <div>
                <Label for="version" class="block mb-1 text-gray-700">Version</Label>
                <InputText v-model="form.data.version" id="version" class="w-full" :invalid="!!form.errors.version" />
                <InputError :message="form.errors.version" />
            </div>

            <!-- WhatsApp Token -->
            <div>
                <Label for="whatsapp_token" class="block mb-1 text-gray-700">WhatsApp Token</Label>
                <InputText v-model="form.data.whatsapp_token" id="whatsapp_token" class="w-full"
                    :invalid="!!form.errors.whatsapp_token" />
                <InputError :message="form.errors.whatsapp_token" />
            </div>
            <div>
                <Label for="whatsapp_url" class="block mb-1 text-gray-700">WhatsApp Url</Label>
                <Textarea v-model="form.data.whatsapp_url" id="whatsapp_url" class="w-full"
                    :invalid="!!form.errors.whatsapp_url" />
                <InputError :message="form.errors.whatsapp_url" />
            </div>
            <div>
                <Label for="address" class="block mb-1 text-gray-700">Address</Label>
                <Textarea v-model="form.data.address" id="address" class="w-full" :invalid="!!form.errors.address" />
                <InputError :message="form.errors.address" />
            </div>

        </div>

        <div class="flex justify-end items-center gap-2 mt-8">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>