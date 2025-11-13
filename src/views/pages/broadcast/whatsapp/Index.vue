<script setup>
import Label from '@/components/Label.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { inject, onMounted, ref, watch } from 'vue';


const swal = inject('$swal');

const data = ref([]);
const loading = ref(true);

const selectedRole = ref(null);
const broadcastMessage = ref('');
const sending = ref(false);

const roleAccessOptions = ref([]);
const usersOptions = ref([]);
const filteredUsers = ref([]);
const selectedUsers = ref([]);

const fetchOptions = async () => {
    try {
        const [statuses, usersData] = await Promise.all([
            Helper.getRoleAccess(),
            Helper.fetchUsers()
        ]);

        roleAccessOptions.value = statuses;
        usersOptions.value = usersData.map(user => ({
            ...user,
            label: `${user.name} - ${user.contact}`
        }));

        filteredUsers.value = [...usersOptions.value];
    } catch (error) {
        console.error('Failed to fetch options:', error);
    }
};

async function getMenuManagement() {
    const params = Helper.formatSearchParams({});
    try {
        const response = await AuthApi.client().get('/menus/?' + new URLSearchParams(params));
        const filteredData = response.data.data;
        const sortedData = filteredData.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
        });
        data.value = sortedData;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

async function sendBroadcast() {
    if (!selectedRole.value) {
        swal.fire('Error', 'Please select a menu to broadcast', 'error');
        return;
    }
    if (!broadcastMessage.value.trim()) {
        swal.fire('Error', 'Message cannot be empty', 'error');
        return;
    }

    if (!selectedUsers.value.length) {
        swal.fire('Error', 'No users selected for broadcast', 'error');
        return;
    }

    sending.value = true;

    try {
        const total = selectedUsers.value.length;
        let successCount = 0;
        let failCount = 0;

        for (const user of selectedUsers.value) {
            if (!user.contact) continue;

            const payload = {
                session_id: 'appgodigii1ea7f46c7f910a404938f7f8a8c184',
                number: user.contact, // ambil dari field contact
                message: broadcastMessage.value.trim(),
            };

            try {
                const response = await AuthApi.client().post('/whatsapp_gateway/send-message', payload);

                if (response.data?.success) {
                    successCount++;
                } else {
                    failCount++;
                }
            } catch (err) {
                console.error(`Failed to send to ${user.contact}:`, err.message);
                failCount++;
            }
        }

        swal.fire(
            'Broadcast Finished',
            `✅ Sent: ${successCount}\n❌ Failed: ${failCount}\n📱 Total: ${total}`,
            successCount === total ? 'success' : 'warning'
        );

        broadcastMessage.value = '';
        selectedRole.value = null;
        selectedUsers.value = [];

    } catch (error) {
        console.error(error);
        swal.fire('Error', 'Broadcast failed unexpectedly', 'error');
    } finally {
        sending.value = false;
    }
}


watch(selectedRole, (roleAccessId) => {
    if (roleAccessId) {
        filteredUsers.value = usersOptions.value.filter(
            user => user.role_access === roleAccessId
        );
    } else {
        filteredUsers.value = [...usersOptions.value];
    }
    selectedUsers.value = [];
});

function clearAll() {
    selectedRole.value = null;
    selectedUsers.value = [];
    broadcastMessage.value = '';
}
onMounted(() => {
    getMenuManagement();
    fetchOptions();
});
</script>

<template>
    <div class="mt-4">
        <div class="card space-y-4 mt-2 p-4 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Broadcast Message</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div class="mb-4">
                    <Label for="menuSelect" class="block text-gray-700 font-medium mb-1">Role Access</Label>
                    <Select v-model="selectedRole" :options="roleAccessOptions" show-clear option-label="name"
                        option-value="id" filter placeholder="Select a role access" class="w-full" />
                </div>

                <div class="mb-4">
                    <Label for="userSelect" class="block text-gray-700 font-medium mb-1">Select User</Label>
                    <MultiSelect v-model="selectedUsers" :options="filteredUsers" option-label="label" filter
                        placeholder="Select Users" :maxSelectedLabels="3" class="w-full" />
                </div>
            </div>

            <div class="mb-12">
                <Label for="message" class="block text-gray-700 font-medium mb-1">Message</Label>
                <textarea id="message" v-model="broadcastMessage" rows="5" class="w-full border rounded p-2"
                    placeholder="Type your broadcast message here..."></textarea>
            </div>

            <div class="flex space-x-4 justify-start pt-4">
                <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    :disabled="sending" @click="sendBroadcast">
                    {{ sending ? 'Sending...' : 'Send Broadcast' }}
                </button>

                <button class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" @click="clearAll">
                    Clear
                </button>
            </div>
        </div>
    </div>
</template>
