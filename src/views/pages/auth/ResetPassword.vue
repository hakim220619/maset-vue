<script setup>
import InputError from '@/components/InputError.vue';
import { useUrlSearchParams } from '@vueuse/core';
import axios from 'axios';
import { inject, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';

const router = useRouter();
const route = useRoute();

const swal = inject('$swal');

const form = ref({
    data: {
        password: '',
        password_confirmation: ''
    },
    errors: {
        password: null,
        password_confirmation: null
    },
    loading: false
});

const schema = z
    .object({
        password: z
            .string()
            .min(6)
            .max(100)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,100}$/, { message: 'Invalid format.' }),
        password_confirmation: z
            .string()
            .min(6)
            .max(100)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,100}$/, { message: 'Invalid format.' })
    })
    .superRefine(({ password, password_confirmation }, ctx) => {
        if (password !== password_confirmation) {
            ctx.addIssue({
                code: 'custom',
                message: 'Passwords confirmation do not match',
                path: ['password_confirmation']
            });
        }
    });

async function reset() {
    form.value.loading = true;

    try {
        schema.parse(form.value.data);

        const formData = new FormData();

        formData.append('token', useUrlSearchParams().token);
        formData.append('password', form.value.data.password);
        formData.append('confirm_password', form.value.data.password_confirmation);

        const response = await axios.post(import.meta.env.VITE_API_URL + 'gateway/idp/user/reset-password', formData);

        if (response.data.success) {
            swal.fire({
                title: 'Success',
                text: 'Successfully reset password. Please Relogin',
                icon: 'success'
            }).then(() => {
                router.push({ name: 'login' });
            });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Link has expired',
                text: 'Please resend the password reset link or contact the administrator.',
                icon: 'error'
            }).then(() => {
                router.push({ name: 'forgot-password' });
            });
        }
    }

    form.value.loading = false;
}

if (!route.query.token) {
    router.push({ name: 'login' });
}

for (const key in form.value.data) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}

onMounted(async () => {
    try {
        const formData = new FormData();
        formData.append('token', route.query.token);

        await axios.post(import.meta.env.VITE_API_URL + 'gateway/oauth/check-token', formData);
    } catch (error) {
        swal.fire({
            title: 'Link has expired',
            text: 'Please resend the password reset link or contact the administrator.',
            icon: 'error'
        }).then(() => {
            router.push({ name: 'forgot-password' });
        });
    }
});
</script>

<template>
    <div class="overflow-hidden margin-0 relative h-screen bg-surface-100">
        <div class="grid sm:grid-cols-3 lg:grid-cols-2 h-full">
            <div class="hidden sm:block bg-gradient-to-br from-[#536976] to-[#292E49] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1506620101082-6d82db519896?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" srcset="" class="w-full h-full object-cover" />
            </div>

            <div class="col-span-2 lg:col-span-1 flex items-center justify-center">
                <div>
                    <Fluid class="w-full text-center">
                        <form class="px-12 md:p-0 w-[29rem] relative" style="" @submit.prevent="reset">
                            <div class="col-span-9 text-left mb-8">
                                <h2 class="mb-1 text-3xl font-serif text-surface-700 dark:text-surface-900">Enter New Password</h2>
                                <span class="text-surface-500 dark:text-surface-300">Create a strong password for enhanced security</span>
                            </div>

                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 text-left">
                                    <label class="text-surface-400 dark:text-surface-400 mb-1">New Password</label>
                                    <div class="mt-1">
                                        <Password v-model="form.data.password" placeholder="Enter new password" toggleMask class="w-full" :invalid="!!form.errors.password">
                                            <template #footer>
                                                <Divider />
                                                <ul class="pl-2 ml-2 my-0 leading-normal">
                                                    <li>Harus mengandung 1 huruf kecil</li>
                                                    <li>Harus mengandung 1 harus besar</li>
                                                    <li>Harus mengandung angka</li>
                                                    <li>Harus mengandung karakter khusus</li>
                                                    <li>Minimum 8 characters</li>
                                                </ul>
                                            </template>
                                        </Password>
                                        <InputError :message="form.errors.password" />
                                    </div>
                                </div>

                                <div class="col-span-12 text-left">
                                    <label class="text-surface-400 dark:text-surface-400 mb-1">Password Confirmation</label>
                                    <div class="mt-1">
                                        <Password v-model="form.data.password_confirmation" placeholder="Enter new password" toggleMask :feedback="false" class="w-full" :invalid="!!form.errors.password_confirmation" />
                                        <InputError :message="form.errors.password_confirmation" />
                                    </div>
                                </div>

                                <div class="col-span-12 pt-4">
                                    <Button type="submit" label="Reset Password"></Button>
                                </div>
                            </div>
                        </form>
                    </Fluid>
                </div>
            </div>
        </div>
    </div>
</template>
