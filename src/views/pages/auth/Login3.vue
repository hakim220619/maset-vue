<script setup>
import { AuthApi } from '@/service/Api';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import { Helper } from '@/service/Helper';
import axios from 'axios';

const router = useRouter();

const visivleErrorMessage = ref(false);
const errorMessage = ref('');

const form = ref({
    data: {
        email: '',
        password: '',
        remember_me: false
    },
    errors: {
        email: '',
        password: ''
    },
    loading: false
});

const schema = z.object({
    email: z.string().min(1, { message: 'Email is required.' }).max(100),
    password: z.string().min(1, { message: 'Password is required.' }).max(32),
    remember_me: z.boolean()
});

async function onFormSubmit() {
    try {
        schema.parse(form.value.data);


        const response = await axios.post('http://192.168.88.101:3000/auth/login', form.value.data, {

        });


        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            router.push('/');
        } else {
            visivleErrorMessage.value = true;
            errorMessage.value = response.data.message;
        }
    } catch (err) {
        if (err instanceof z.ZodError) {
            for (const error of err.errors) {
                form.value.errors[error.path[0]] = error.message;
            }
        } else {
            console.error('An error occurred during login:', err);
        }
    }
}

for (const key in form.value.errors) {
    watch(
        () => form.value.errors[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}
</script>

<template>
    <div class="overflow-hidden margin-0 relative h-screen bg-surface-100">
        <div class="grid sm:grid-cols-3 lg:grid-cols-2 h-full">
            <div class="hidden sm:block bg-gradient-to-br from-[#536976] to-[#292E49] overflow-hidden">
                <!-- <img src="https://images.unsplash.com/photo-1506620101082-6d82db519896?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="" srcset="" class="w-full h-full object-cover" /> -->
            </div>

            <div class="col-span-2 lg:col-span-1 flex items-center justify-center">
                <div>
                    <Fluid class="w-full text-center">
                        <form class="px-12 md:p-0 w-[29rem] relative" style="" @submit.prevent="onFormSubmit">
                            <div class="col-span-9 text-left mb-8">
                                <h2 class="mb-1 text-3xl font-serif text-surface-700 dark:text-surface-900">Welcome Back
                                </h2>
                                <span class="text-surface-500 dark:text-surface-300">Enter your email and password to
                                    access your account</span>
                            </div>

                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12">
                                    <Message v-if="visivleErrorMessage" severity="error" closable
                                        @close="visivleErrorMessage = false">
                                        {{ errorMessage }}
                                    </Message>
                                </div>

                                <div class="col-span-12 text-left">
                                    <label class="text-surface-400 dark:text-surface-400 mb-1">email</label>
                                    <div class="mt-1">
                                        <InputText v-model="form.data.email" type="text" placeholder="Email"
                                            class="w-full" :invalid="!!form.errors.email" />
                                        <span class="mt-1 inline-block text-red-600 text-sm" v-if="form.errors.email">{{
                                            errors.email }}</span>
                                    </div>
                                </div>

                                <div class="col-span-12 text-left">
                                    <label class="text-surface-400 dark:text-surface-400 mb-1">Password</label>
                                    <div class="mt-1">
                                        <Password v-model="form.data.password" type="password" placeholder="Password"
                                            :feedback="false" :invalid="!!form.errors.password" toggleMask />
                                        <span class="mt-1 inline-block text-red-600 text-sm"
                                            v-if="form.errors.password">{{ errors.password }}</span>
                                    </div>
                                </div>

                                <div class="col-span-12 flex justify-between">
                                    <div class="flex items-center gap-2">
                                        <Checkbox v-model="form.remember_me" inputId="remember_me" name="remember_me"
                                            value="1" />
                                        <label for="remember_me" class="text-surface-500"> Remember me </label>
                                    </div>

                                    <div>
                                        <Button class="text-gray-300 flex justify-center" text
                                            @click="router.push('/auth/forgot-password')">Forgot Password?</Button>
                                    </div>
                                </div>

                                <div class="col-span-12">
                                    <Button type="submit" label="Sign In" :disabled="form.loading"
                                        :loading="form.loading"></Button>
                                </div>
                            </div>
                        </form>
                    </Fluid>
                </div>
            </div>
        </div>
    </div>
</template>
