<script setup>
import InputError from '@/components/InputError.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import MultiSelect from 'primevue/multiselect';
import { inject, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';


// Validasi Zod untuk form sewa
const storeSchema = z.object({
    object_id: z.array(z.number()).min(1, 'Wajib pilih minimal 1 Object'),
    pembanding_id: z.array(z.number()).min(1, 'Wajib pilih minimal 1 Pembanding')
});


const router = useRouter();
const route = useRoute();
const swal = inject('$swal');

const objectOptions = ref([]);
const pembandingOptions = ref([]);

const form = ref({
    data: {
        object_id: [],
        pembanding_id: []
    },
    errors: {
        object_id: null,
        pembanding_id: null
    },
    assign: (data = {}) => {
        for (const key in data) {
            if (Array.isArray(form.value.data[key])) {
                form.value.data[key] = data[key] ?? [];
            } else if (key in form.value.data) {
                form.value.data[key] = data[key];
            }
        }
    },
    loading: false
});
const save = async () => {
    form.value.loading = true;
    const url = route.params.id ? `sewa/${route.params.id}` : 'sewa';

    try {
        storeSchema.parse(form.value.data);
        const selectedObjects = objectOptions.value.filter(obj =>
            form.value.data.object_id.includes(obj.value)
        );
        console.log(selectedObjects);


        const tanah_id = selectedObjects
            .filter(obj => obj.jenis_object === 'Tanah')
            .map(obj => obj.value);

        const bangunan_id = selectedObjects
            .filter(obj => obj.jenis_object === 'Bangunan')
            .map(obj => obj.value);

        const payload = {
            tanah_id,
            bangunan_id,
            pembanding_id: form.value.data.pembanding_id
        };

        const response = await AuthApi.client()({
            url,
            method: route.params.id ? 'put' : 'post',
            data: payload,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            swal.fire({
                title: 'Success',
                text: 'Data sewa berhasil disimpan',
                icon: 'success'
            });
            router.push({ name: 'Sewa List' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                const path = Array.isArray(err.path) ? err.path[0] : err.path;
                form.value.errors[path] = err.message;
            }
        } else {
            console.error(error);
            swal.fire({
                title: 'Error',
                text: 'Gagal menyimpan data sewa',
                icon: 'error'
            });
        }
    }

    form.value.loading = false;
};


const fetchOptions = async () => {
    try {
        const [objects, pembandings] = await Promise.all([
            Helper.getAllData('getAllObject'),
            Helper.getAllData('getAllPembanding')
        ]);

        objectOptions.value = objects.map(obj => ({
            label: `${obj.name} | ${obj.jenis_object}`,
            value: obj.id,
            jenis_object: obj.jenis_object
        }));

        pembandingOptions.value = pembandings.map(p => ({
            label: p.name,
            value: p.id
        }));
    } catch (error) {
        console.error('Gagal memuat opsi:', error);
    }
};

onBeforeMount(async () => {
    if (route.params.id) {
        const data = await Helper.getDataById('sewa', route.params.id);
        if (data) {
            form.value.assign(data);
        }
    }
});

onMounted(() => {
    fetchOptions();
});

for (const key in form.value.data) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        },
        { deep: true }
    );
}

const goBack = () => {
    router.push('/pages/sewa');
};
</script>

<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <!-- Kiri: Object ID -->
            <div>
                <Label for="object_id" class="block mb-1 text-gray-700 dark:text-white">
                    Object ID <span class="text-red-500">*</span>
                </Label>
                <MultiSelect v-model="form.data.object_id" :options="objectOptions" optionLabel="label"
                    optionValue="value" display="chip" filter placeholder="Pilih Object" class="w-full"
                    :class="{ 'p-invalid': !!form.errors.object_id }" />
                <InputError :message="form.errors.object_id" />
            </div>

            <!-- Kanan: Pembanding ID -->
            <div>
                <Label for="pembanding_id" class="block mb-1 text-gray-700 dark:text-white">
                    Pembanding ID <span class="text-red-500">*</span>
                </Label>
                <MultiSelect v-model="form.data.pembanding_id" :options="pembandingOptions" optionLabel="label"
                    optionValue="value" display="chip" filter placeholder="Pilih Pembanding" class="w-full"
                    :class="{ 'p-invalid': !!form.errors.pembanding_id }" />
                <InputError :message="form.errors.pembanding_id" />
            </div>
        </div>

        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>
