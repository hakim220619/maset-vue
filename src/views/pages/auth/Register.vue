<script setup>
import InputError from '@/components/InputError.vue';
import { AuthApi } from '@/service/Api';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';


const router = useRouter();

const visibleErrorMessage = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const form = ref({
    data: {
        nik: '',
        name: '',
        email: '',
        password: '',
        entitas: '',
        image: null,
        contact: '',
        address: '',
    },
    errors: {
        nik: '',
        name: '',
        email: '',
        password: '',
        entitas: '',
        image: '',
        contact: '',
        address: '',
    },
});

const entitasOptions = ref([]);


const schema = z.object({
    nik: z.string().min(1, { message: 'NIK is required' }).max(20),
    name: z.string().min(1, { message: 'Full Name is required' }).max(100),
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(32),
    entitas: z.number().min(1, { message: 'Please select entitas' }),
    image: z
        .union([z.instanceof(File), z.null()])
        .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
            message: 'Image must be smaller than 2MB',
        }),
    contact: z.string().min(1, { message: 'contact is required' }),
    address: z.string().min(1, { message: 'address is required' }),
});


function onImageChange(event) {
    const file = event.target.files[0];
    form.value.data.image = file || null;
}

async function onFormSubmit() {
    loading.value = true;
    Object.keys(form.value.errors).forEach((key) => (form.value.errors[key] = ''));

    try {
        // Validasi dulu (image boleh null atau File)
        schema.parse(form.value.data);

        const formData = new FormData();
        // Append semua field ke formData
        for (const key in form.value.data) {
            if (key === 'image') {
                if (form.value.data.image) {
                    formData.append('image', form.value.data.image);
                }
            } else {
                formData.append(key, form.value.data[key]);
            }
        }
        console.log(formData);

        const response = await AuthApi.client().post('/auth/register/users', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.success) {
            router.push('/auth/login');
        } else {
            visibleErrorMessage.value = true;
            errorMessage.value = response.data.message || 'Registration failed';
        }
    } catch (err) {
        if (err instanceof z.ZodError) {
            for (const error of err.errors) {
                form.value.errors[error.path[0]] = error.message;
            }
        } else {
            console.error('Error during registration:', err);
            visibleErrorMessage.value = true;
            errorMessage.value = 'An unexpected error occurred';
        }
    } finally {
        loading.value = false;
    }
}


onMounted(async () => {
    try {
        const response = await AuthApi.client().get('/role_structure_public');

        entitasOptions.value = response.data.data.map(item => ({
            name: item.rs_name,
            id: item.rs_id,
        }));

    } catch (error) {
        console.error('Failed to fetch entitas options:', error);
    }
});

for (const key in form.value.data) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}

</script>

<template>
    <div class="overflow-hidden margin-0 relative h-screen bg-surface-100 flex items-center justify-center">
        <div class="w-full max-w-4xl">
            <div class="card p-8 shadow-lg rounded-lg bg-white">
                <h2 class="mb-4 text-3xl font-serif text-surface-700 dark:text-surface-900 text-center">
                    Register New Account
                </h2>
                <p class="mb-8 text-center text-surface-500 dark:text-surface-300">
                    Fill in your details to create an account
                </p>

                <form @submit.prevent="onFormSubmit" enctype="multipart/form-data" class="grid grid-cols-12 gap-6">
                    <div v-if="visibleErrorMessage" class="col-span-12">
                        <Message severity="error" closable @close="visibleErrorMessage = false">{{ errorMessage }}
                        </Message>
                    </div>

                    <!-- NIK -->
                    <div class="col-span-6">
                        <label for="nik" class="block mb-1 text-gray-700">NIK</label>
                        <InputText v-model="form.data.nik" id="nik" class="w-full" :invalid="!!form.errors.nik" />
                        <InputError :message="form.errors.nik" />
                    </div>

                    <!-- Full Name -->
                    <div class="col-span-6">
                        <label for="name" class="block mb-1 text-gray-700">Full Name</label>
                        <InputText v-model="form.data.name" id="name" class="w-full" :invalid="!!form.errors.name" />
                        <InputError :message="form.errors.name" />
                    </div>

                    <!-- Email -->
                    <div class="col-span-6">
                        <label for="email" class="block mb-1 text-gray-700">Email</label>
                        <InputText v-model="form.data.email" id="email" type="email" class="w-full"
                            :invalid="!!form.errors.email" />
                        <InputError :message="form.errors.email" />
                    </div>

                    <!-- Password -->
                    <div class="col-span-6">
                        <label for="password" class="block mb-1 text-gray-700">Password</label>

                        <InputText v-model="form.data.password" id="password" type="password" class="w-full"
                            :invalid="!!form.errors.password" />
                        <InputError :message="form.errors.password" />

                    </div>

                    <!-- Entitas -->
                    <div class="col-span-6">
                        <label for="entitas" class="block mb-1 text-gray-700">Entitas</label>
                        <Select v-model="form.data.entitas" :options=entitasOptions show-clear option-label="name"
                            filter option-value="id" :virtualScrollerOptions="{ itemSize: 38 }"
                            placeholder="Select a category" class="w-full" :invalid="!!form.errors.entitas" />
                        <InputError :message="form.errors.entitas" />
                    </div>

                    <!-- Image -->
                    <div class="col-span-6">
                        <label for="image" class="block mb-1 text-gray-700">Upload Image</label>
                        <input id="image" type="file" accept="image/*" @change="onImageChange"
                            class="w-full border border-gray-300 rounded px-3 py-2 file:mr-4  hover:file:bg-surface-300" />
                        <InputError :message="form.errors.image" />
                    </div>


                    <!-- contact -->
                    <div class="col-span-6">
                        <label for="contact" class="block mb-1 text-gray-700">contact</label>
                        <InputText v-model="form.data.contact" id="contact" class="w-full"
                            :invalid="!!form.errors.contact" />
                        <InputError :message="form.errors.contact" />
                    </div>

                    <!-- address -->
                    <div class="col-span-6">
                        <label for="address" class="block mb-1 text-gray-700">address</label>
                        <InputText v-model="form.data.address" id="address" rows="3"
                            class="w-full border border-gray-300 rounded p-2"
                            :class="{ 'border-red-600': !!form.errors.address }" placeholder="address"></InputText>
                        <InputError :message="form.errors.address" />
                    </div>

                    <div class="col-span-12 mt-6 flex justify-center gap-4">
                        <!-- Tombol Kembali -->
                        <Button label="Kembali" icon="pi pi-arrow-left" @click="router.push('/auth/login')"
                            class="min-w-[150px] py-3 text-lg" severity="secondary" />

                        <!-- Tombol Register -->
                        <Button type="submit" label="Register" :disabled="loading" :loading="loading"
                            :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'"
                            class="min-w-[200px] py-3 text-lg" />
                    </div>


                </form>
            </div>
        </div>
    </div>
</template>
