<script setup>
import { AuthApi } from '@/service/Api';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';

const router = useRouter();

const form = ref({
    email: ''
});

const errors = ref({
    email: ''
});

const isSendingEmail = ref(false);
const visibleMessage = ref(false);

const status = ref('');
const message = ref('');

const schema = z.object({
    email: z.string().min(1, { message: 'The field email is required' }).email()
});

async function sendEmail() {
    isSendingEmail.value = true;

    try {
        schema.parse(form.value);

        const myform = new FormData();

        myform.append('email', form.value.email);
        const response = await AuthApi.client().post('gateway/idp/mail/forgot-password', myform);

        if (response.data.success) {
            status.value = 'Success';
            message.value = 'Email sent successfully';
            visibleMessage.value = true;
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                errors.value[err.path] = err.message;
            }
        } else {
            status.value = 'Error';
            message.value = error.response.data.message;
            visibleMessage.value = true;
        }
    }

    isSendingEmail.value = false;
}

for (const key in form.value) {
    watch(
        () => form.value[key],
        () => {
            errors.value[key] = '';
        }
    );
}
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
                        <div class="px-12 md:p-0 w-[29rem] relative" style="">
                            <div class="col-span-9 text-left mb-8">
                                <h2 class="mb-1 text-3xl font-serif text-surface-700 dark:text-surface-900">Forgot Password</h2>
                                <span class="text-surface-500 dark:text-surface-300">No worries, we'll send you instructions for reset!</span>
                            </div>

                            <Message v-if="visibleMessage" :severity="status == 'Success' ? 'info' : 'error'" closable @close="visibleMessage = false" class="mb-4">
                                {{ message }}
                            </Message>

                            <div class="grid grid-cols-12 gap-8">
                                <div class="col-span-12 text-left">
                                    <label class="text-surface-400 dark:text-surface-400 mb-1">Email</label>
                                    <div class="mt-1">
                                        <InputText v-model="form.email" type="text" placeholder="Enter your email" class="w-full" :invalid="!!errors.email" />
                                        <span class="mt-1 inline-block text-red-600 text-sm" v-if="errors.email">{{ errors.email }}</span>
                                    </div>
                                </div>

                                <div class="col-span-12">
                                    <Button @click="sendEmail" label="Reset Password" :loading="isSendingEmail" :disabled="isSendingEmail"></Button>
                                    <Button label="Back" text class="mt-1" @click="router.push('/auth/login')" />
                                </div>
                            </div>
                        </div>
                    </Fluid>
                </div>
            </div>
        </div>
    </div>
</template>
