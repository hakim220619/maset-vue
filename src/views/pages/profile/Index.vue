<template>
    <div class="w-full min-h-screen p-6 transition-colors duration-300">
        <div
            class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6 transition-colors duration-300">
            <!-- Kiri: Profil -->
            <div class="flex flex-col items-center md:items-start gap-6">
                <img class="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-md"
                    :src="profile.image" alt="Profile Picture" />
                <div class="text-center md:text-left">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ profile.name }}</h2>
                    <p class="text-gray-500 dark:text-gray-300">{{ profile.email }}</p>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ profile.bio }}</p>

                    <div class="mt-4 flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <div><strong>📍 Lokasi:</strong> {{ profile.location }}</div>
                        <div><strong>💼 Role Structure:</strong> {{ profile.rs_name }}</div>
                        <div><strong>📅 Bergabung:</strong> {{ profile.joined }}</div>
                    </div>
                </div>
                <button
                    class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition">
                    Edit Profil
                </button>
            </div>

            <!-- Kanan: Toggle Log Aktivitas & Reset Password -->
            <div class="flex flex-col gap-6">
                <!-- Tombol toggle -->
                <div class="flex space-x-4">
                    <button @click="activeRightTab = 'log'" :class="[
                        'flex-1 py-2 rounded-md font-semibold transition',
                        activeRightTab === 'log'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                    ]">
                        Log Aktivitas
                    </button>
                    <button @click="activeRightTab = 'reset'" :class="[
                        'flex-1 py-2 rounded-md font-semibold transition',
                        activeRightTab === 'reset'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                    ]">
                        Reset Password
                    </button>
                </div>

                <!-- Konten -->
                <div
                    class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow min-h-[180px] transition-colors duration-300">
                    <template v-if="activeRightTab === 'log'">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                            Aktivitas Terbaru
                        </h3>
                        <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                            <li>✅ Login terakhir: 3 Juni 2025, 08:30</li>
                            <li>📝 Mengubah profil pada 2 Juni 2025</li>
                            <li>🔒 Mengubah password pada 30 Mei 2025</li>
                        </ul>
                    </template>

                    <template v-else-if="activeRightTab === 'reset'">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Ganti Password
                        </h3>
                        <form class="space-y-3" @submit.prevent="handlePasswordSubmit">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password
                                    Lama</label>
                                <input v-model="passwords.old" type="password"
                                    class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                    required />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password
                                    Baru</label>
                                <input v-model="passwords.new" type="password"
                                    class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                    required />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Konfirmasi
                                    Password Baru</label>
                                <input v-model="passwords.confirm" type="password"
                                    class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                    required />
                            </div>
                            <button type="submit"
                                class="w-full mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                                Simpan Password
                            </button>
                        </form>
                        <p v-if="errorMsg" class="mt-2 text-red-600 text-sm dark:text-red-400">{{ errorMsg }}</p>
                        <p v-if="successMsg" class="mt-2 text-green-600 text-sm dark:text-green-400">{{ successMsg }}
                        </p>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { Helper } from '@/service/Helper';

import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const profile = ref({
    name: '',
    email: '',
    image: '',
    bio: '',
    location: '',
    rs_name: '',
    joined: '',
})

const appData = ref('')

onBeforeMount(async () => {
    // Ambil semua users dari localStorage
    appData.value = Helper.getUsersLocalStorage()

    // Jika ada route param id, fetch user dari API
    if (appData) {
        const response = await Helper.getDataById('users', appData.value.id)
        const data = response.data

        if (data) {
            // Assign data ke profile reactive object
            profile.value = {
                name: data.name || '',
                email: data.email || '',
                image: import.meta.env.VITE_API_URL + data.image || '',
                bio: data.bio || '',
                location: data.address || '',
                rs_name: data.rs_name || '',
                joined: data.created_at || '',
            }
        }
    }
})

const activeRightTab = ref("log");

const passwords = ref({
    old: "",
    new: "",
    confirm: "",
});

const errorMsg = ref("");
const successMsg = ref("");

function handlePasswordSubmit() {
    errorMsg.value = "";
    successMsg.value = "";

    if (passwords.value.new !== passwords.value.confirm) {
        errorMsg.value = "Password baru dan konfirmasi tidak cocok.";
        return;
    }

    if (passwords.value.new.length < 6) {
        errorMsg.value = "Password baru minimal 6 karakter.";
        return;
    }

    // Simulasi submit, bisa ganti dengan API call
    setTimeout(() => {
        successMsg.value = "Password berhasil diubah.";
        passwords.value.old = "";
        passwords.value.new = "";
        passwords.value.confirm = "";
    }, 1000);
}
</script>