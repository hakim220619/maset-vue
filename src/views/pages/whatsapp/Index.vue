<script setup>
import { AuthApi } from '@/service/Api';
import QrcodeVue from "qrcode.vue";
import { onBeforeMount, ref, watch } from "vue";

const statuses = ref([
    { name: "Pesan Terkirim", value: 0, color: "bg-green-500" },
    { name: "Pesan Gagal", value: 0, color: "bg-red-500" },
    { name: "Session Aktif", value: 0, color: "bg-blue-500" },
]);

const qrCodeText = ref("");
const isLoading = ref(false);
const isConnected = ref(false);
const userInfo = ref(null);
const sessionId = "appgodigii1ea7f46c7f910a404938f7f8a8c184";

// ✅ Fetch message stats
async function getStatusMessage() {
    try {
        const response = await AuthApi.client()({
            url: '/whatsapp_gateway/getStatusMessage', // sesuaikan endpoint API Anda
            method: 'get'
        });

        const { sent = 0, not_sent = 0 } = response.data?.data || {};

        statuses.value = statuses.value.map(item => {
            if (item.name === "Pesan Terkirim") return { ...item, value: sent };
            if (item.name === "Pesan Gagal") return { ...item, value: not_sent };
            return item;
        });
    } catch (err) {
        console.error("Failed to fetch message stats:", err.message);
    }
}

async function checkSession() {
    try {
        const response = await AuthApi.client()({
            url: `/whatsapp_gateway/check-session/${sessionId}`,
            method: "get"
        });

        if (response.data?.connected) {
            isConnected.value = true;
            userInfo.value = response.data.user;
            qrCodeText.value = "";
            statuses.value = statuses.value.map((item) =>
                item.name === "Session Aktif" ? { ...item, value: 1 } : item
            );
        } else {
            isConnected.value = false;
            statuses.value = statuses.value.map((item) =>
                item.name === "Session Aktif" ? { ...item, value: 0 } : item
            );
        }
    } catch (err) {
        console.error("Check session failed:", err.message);
        isConnected.value = false;
    }
}

async function reconnectSession() {
    try {
        isLoading.value = true;
        const response = await AuthApi.client()({
            url: `/whatsapp_gateway/reconnect-session`,
            method: "post",
            data: { sessionId },
        });
        qrCodeText.value = response.data?.qr || "";
    } catch (err) {
        console.error("Failed to reconnect:", err.message);
    } finally {
        isLoading.value = false;
    }
}

async function logoutSession() {
    try {
        await AuthApi.client()({
            url: `/whatsapp_gateway/logout-session`,
            method: "post",
            data: { sessionId },
        });
        isConnected.value = false;
        userInfo.value = null;
        statuses.value = statuses.value.map((item) =>
            item.name === "Session Aktif" ? { ...item, value: 0 } : item
        );
        await reconnectSession();
    } catch (err) {
        console.error("Logout failed:", err.message);
    }
}

// 🔹 On mount, check session and fetch stats
onBeforeMount(async () => {
    await checkSession();
    if (!isConnected.value) await reconnectSession();
    await getStatusMessage(); // fetch message stats from API
});

// 🔹 Watch session or QR change
watch(
    [isConnected, qrCodeText],
    async ([connected, qr]) => {
        if (!connected && qr) {
            const interval = setInterval(async () => {
                await checkSession();
                if (isConnected.value) {
                    clearInterval(interval);
                    await getStatusMessage(); // refresh stats when session connected
                }
            }, 3000);
        }
    },
    { immediate: true }
);
</script>



<template>
    <div class="p-6 bg-gray-50 min-h-screen dark:bg-gray-900">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div v-for="(item, i) in statuses" :key="i"
                class="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-white mb-3"
                    :class="item.color">
                    💬
                </div>
                <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {{ item.value }}
                </h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm">
                    {{ item.name }}
                </p>
            </div>
        </div>

        <div
            class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                WhatsApp Session
            </h3>

            <div v-if="isConnected" class="flex flex-col items-center p-6 rounded-xl shadow-md">
                <!-- WhatsApp Icon -->
                <div class="flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#25D366" viewBox="0 0 24 24" class="w-10 h-10">
                        <path
                            d="M20.52 3.48A11.73 11.73 0 0012 0C5.37 0 .06 5.31.06 11.87c0 2.09.55 4.13 1.6 5.94L0 24l6.38-1.66A11.86 11.86 0 0012 23.74c6.63 0 12.02-5.31 12.02-11.87 0-3.17-1.27-6.15-3.5-8.39zM12 21.5a9.7 9.7 0 01-5.06-1.41l-.36-.21-3.78.99 1.01-3.69-.24-.38a9.54 9.54 0 01-1.53-5.02C2.04 6.17 6.44 1.9 12 1.9c2.54 0 4.93.98 6.72 2.76A9.5 9.5 0 0121.96 12c0 5.23-4.4 9.5-9.96 9.5zm5.37-7.08c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.63.15-.18.3-.72.94-.88 1.14-.16.2-.33.23-.62.08-.29-.15-1.22-.45-2.33-1.43a8.68 8.68 0 01-1.6-1.97c-.17-.3 0-.46.13-.6.14-.14.3-.38.45-.57.15-.2.2-.34.3-.56.1-.23.05-.43-.02-.6-.07-.15-.63-1.53-.87-2.1-.23-.55-.47-.47-.63-.48h-.54c-.18 0-.47.07-.72.34-.25.26-.95.93-.95 2.28s.97 2.64 1.11 2.83c.14.2 1.9 2.9 4.6 4.05.64.28 1.13.44 1.52.56.64.2 1.22.17 1.68.1.51-.08 1.7-.7 1.94-1.37.24-.67.24-1.24.17-1.36-.06-.12-.26-.19-.55-.34z" />
                    </svg>
                </div>

                <!-- Connected Info -->
                <div class="flex items-center gap-2 text-green-600 font-semibold mb-3">
                    <span>Connected as <b>{{ userInfo?.name || "Unknown" }}</b></span>
                </div>

                <!-- User ID -->
                <div class="text-gray-500 text-sm mb-4">
                    ID: {{ userInfo?.id || "Unknown" }}
                </div>

                <!-- Logout Button -->
                <button @click="logoutSession"
                    class="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 9V5.25a.75.75 0 00-.75-.75H5.25A1.5 1.5 0 003.75 6v12a1.5 1.5 0 001.5 1.5h9.75a.75.75 0 00.75-.75V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Logout
                </button>
            </div>


            <div v-else class="flex flex-col items-center">
                <div v-if="isLoading" class="text-gray-500 dark:text-gray-400">
                    🔄 Loading QR...
                </div>

                <div v-else-if="qrCodeText && qrCodeText.startsWith('data:image')" class="mb-3">
                    <img :src="qrCodeText" alt="WhatsApp QR Code" class="border rounded-xl shadow-lg p-3 bg-white"
                        width="250" height="250" />
                </div>

                <div v-else-if="qrCodeText" class="mb-3">
                    <QrcodeVue :value="qrCodeText" :size="250" />
                </div>

                <div v-else class="text-red-500 mt-4">
                    ⚠️ QR code tidak tersedia.
                </div>

                <button @click="reconnectSession"
                    class="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    🔄 Refresh QR
                </button>
            </div>
        </div>
    </div>
</template>
