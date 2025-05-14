<script setup>
import { CustomerService } from '@/service/CustomerService';
import { useTitle } from '@vueuse/core';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const title = useTitle();
const router = useRouter();

const visible = ref(false);

const search = ref({
    name: '',
    country: '',
    status: ''
});

const data = ref([]);
const countries = ref([]);
const statuses = ref([]);

const isFiltering = ref(false);

async function getCustomers() {
    isFiltering.value = true;

    const params = new URLSearchParams(search.value);

    try {
        const response = await axios.get(import.meta.env.VITE_API_URL + 'gateway/example/test_customers/?' + params, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('_token')
            }
        });

        data.value = response.data.data;
    } catch (error) {
        console.log(error);
    }

    visible.value = true;
    isFiltering.value = false;
}

const items = [
    {
        label: 'Ubah',
        command: (e) => {
            console.log(e);
        }
    },
    {
        label: 'Hapus',
        command: (e) => {
            console.log(e);
        }
    }
];

onMounted(async () => {
    title.value = 'Customers';

    countries.value = await CustomerService.getCountries();
    statuses.value = await CustomerService.getStatuses();
});
</script>

<template>
    <div class="flex items-center justify-between">
        <h2 class="text-3xl text-slate-700 font-bold leading-3">Customers</h2>
        <Button label="Add Customer" @click="router.push('/pages/customer/create')" raised></Button>
    </div>

    <div class="card mt-4">
        <div class="space-y-4 mt-2">
            <div class="grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-4">
                <label for="name3" class="">Search by Name</label>
                <InputText id="name3" type="text" class="md:col-span-3" />
            </div>

            <div class="grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-4">
                <label for="name3" class="">Search by Country</label>
                <Select v-model="search.country" :options="countries" filter placeholder="Select a Country" class="md:col-span-3" />
            </div>

            <div class="grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-4">
                <label for="name3" class="">Search by Status</label>
                <Select v-model="search.status" :options="statuses" placeholder="Select a Status" class="md:col-span-3" />
            </div>
        </div>

        <div class="flex mt-12 justify-end">
            <Button label="Search" @click="getCustomers" raised />
        </div>

        <div class="mt-8" v-if="visible">
            <Divider class="mt-12" />
            <div class="font-semibold text-xl mb-2">List of Data</div>
            <div class="card mt-4">
                <DataTable :value="data" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem" row-hover>
                    <Column header="#">
                        <template #body="{ index }">{{ index + 1 }}</template>
                    </Column>
                    <Column field="name" header="Name" style="width: 25%"></Column>
                    <Column field="country" header="Country" style="width: 25%"></Column>
                    <Column field="company" header="Company" style="width: 25%"></Column>
                    <Column field="balance" header="Representative" style="width: 25%"></Column>

                    <Column>
                        <template #body="{ index }">
                            <div class="flex gap-1 justify-end">
                                <DropdownButton :items="items" :menu-key="index" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
