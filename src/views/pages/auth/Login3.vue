<script setup>
import { AuthApi } from '@/service/Api';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';

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
    form.value.loading = true;
    try {
        form.value.errors.email = '';
        form.value.errors.password = '';
        visivleErrorMessage.value = false;

        schema.parse(form.value.data);

        const response = await AuthApi.login(form.value.data);

        if (response.data.success) {
            const { token, data } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(data));

            router.push('/');
        } else {
            visivleErrorMessage.value = true;
            errorMessage.value = response.data.message || 'Login failed';
            form.value.data.password = ''; // clear password on error
        }
    } catch (err) {
        if (err instanceof z.ZodError) {
            for (const error of err.errors) {
                form.value.errors[error.path[0]] = error.message;
            }
        } else {
            console.error('An error occurred during login:', err);
            visivleErrorMessage.value = true;
            errorMessage.value = 'Something went wrong. Please try again.';
        }
    } finally {
        form.value.loading = false;
    }
}

// Clear errors on input
for (const key in form.value.errors) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}
</script>

<template>
    <div class="overflow-hidden relative h-screen bg-surface-100">
        <div class="grid sm:grid-cols-3 lg:grid-cols-2 h-full">
            <div class="hidden sm:block bg-gradient-to-br from-[#536976] to-[#292E49] overflow-hidden"></div>

            <div class="col-span-2 lg:col-span-1 flex items-center justify-center">
                <div>
                    <Fluid class="w-full text-center">
                        <form class="px-12 md:p-0 w-[29rem]" @submit.prevent="onFormSubmit">
                            <div class="text-left mb-8">
                                <h2 class="mb-1 text-3xl font-serif text-surface-700 dark:text-surface-900">Welcome Back
                                </h2>
                                <span class="text-surface-500 dark:text-surface-300">
                                    Enter your email and password to access your account
                                </span>
                            </div>

                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12">
                                    <Message v-if="visivleErrorMessage" severity="error" closable
                                        @close="visivleErrorMessage = false">
                                        {{ errorMessage }}
                                    </Message>
                                </div>

                                <div class="col-span-12 text-left">
                                    <label class="text-surface-400 mb-1">Email</label>
                                    <div class="mt-1">
                                        <InputText v-model="form.data.email" type="text" placeholder="Email"
                                            class="w-full" :invalid="!!form.errors.email" />
                                        <span v-if="form.errors.email" class="mt-1 text-red-600 text-sm">{{
                                            form.errors.email }}</span>
                                    </div>
                                </div>

                                <div class="col-span-12 text-left">
                                    <label class="text-surface-400 mb-1">Password</label>
                                    <div class="mt-1">
                                        <Password v-model="form.data.password" type="password" placeholder="Password"
                                            :feedback="false" :invalid="!!form.errors.password" toggleMask />
                                        <span v-if="form.errors.password" class="mt-1 text-red-600 text-sm">{{
                                            form.errors.password }}</span>
                                    </div>
                                </div>

                                <div class="col-span-12 flex justify-between items-center">
                                    <div class="flex items-center gap-2">
                                        <Checkbox v-model="form.data.remember_me" inputId="remember_me"
                                            name="remember_me" :binary="true" />
                                        <label for="remember_me"
                                            class="text-surface-500 select-none cursor-pointer">Remember me</label>
                                    </div>
                                    <Button class="text-gray-500 whitespace-nowrap px-1 py-0.5 text-sm" text
                                        style="min-width: unset; max-width: max-content;"
                                        @click="router.push('/auth/forgot-password')">
                                        Forgot Password?
                                    </Button>

                                </div>



                                <div class="col-span-12">
                                    <Button type="submit" :disabled="form.loading" class="w-full">
                                        <template #default>
                                            <span v-if="form.loading" class="pi pi-spin pi-spinner mr-2"></span>
                                            Sign In
                                        </template>
                                    </Button>
                                </div>

                                <div class="col-span-12 text-center mt-4">
                                    <span class="text-sm text-surface-500">Don't have an account?</span>
                                    <Button label="Register" link class="ml-2" @click="router.push('/auth/register')" />
                                </div>
                            </div>
                        </form>
                    </Fluid>
                </div>
            </div>
        </div>
    </div>
</template>
