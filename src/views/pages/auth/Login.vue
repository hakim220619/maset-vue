<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateToDashboard() {
    router.push('/');
}
</script>

<template>
    <div class="overflow-hidden margin-0 relative h-screen">
        <div class="bg-cover bg-center" style="background: url('/layout/images/pages/login/bg-login.jpg'); height: calc(100% - 370px)"></div>
        <Fluid class="w-full absolute mb-0 bottom-0 text-center bg-surface-900 dark:bg-surface-0 rounded-none h-[27rem]">
            <div class="px-12 md:p-0 w-[29rem] relative text-white" style="margin-left: -200px; top: 30px; left: 50%">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-3 text-left">
                        <img src="/layout/images/pages/login/icon-login.svg" alt="avalon-ng" />
                    </div>
                    <div class="col-span-9 text-left">
                        <h2 class="mb-0 text-surface-0 dark:text-surface-900">Welcome Guest</h2>
                        <span class="text-surface-500 dark:text-surface-300 text-sm">Sign in to Avalon Network</span>
                    </div>
                    <div class="col-span-12 text-left">
                        <label class="text-surface-400 dark:text-surface-400 mb-1">Username</label>
                        <div class="mt-1">
                            <InputText type="text" placeholder="Username" />
                        </div>
                    </div>
                    <div class="col-span-12 text-left">
                        <label class="text-surface-400 dark:text-surface-400 mb-1">Password</label>
                        <div class="mt-1">
                            <InputText type="password" placeholder="Password" />
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <Button @click="navigateToDashboard" label="Sign In"></Button>
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <Button class="text-gray-300 flex justify-center" text>Forgot Password?</Button>
                    </div>
                </div>
            </div>
        </Fluid>
    </div>
</template>
