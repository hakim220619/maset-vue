<script setup>
import DropdownButton from '@/components/DropdownButton.vue';
import { AuthApi } from '@/service/Api';
import { CustomerService } from '@/service/CustomerService';
import { Helper } from '@/service/Helper';
import { useTitle } from '@vueuse/core';
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


const swal = inject('$swal');
const title = useTitle();
const router = useRouter();

const visible = ref(false);

const search = ref({
    name: '',
    country: null,
    status: null
});

const data = ref([]);
const countries = ref([]);
const statuses = ref([]);

const isFiltering = ref(false);
const isRedirect = ref(false);

async function getCustomers() {
    isFiltering.value = true;

    const params = {};

    for (const key in search.value) {
        if (search.value[key] != '' && search.value[key] != null) {
            params[key] = search.value[key];
        }
    }

    try {
        const response = await AuthApi.client().get('gateway/example/customers/?' + new URLSearchParams(params));

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
            router.push({ name: 'customer-edit', params: { id: e.item.data.id } });
        }
    },
    {
        label: 'Hapus',
        command: (e) => {
            destroy(e.item.data.id, e.item.data.name);
        }
    }
];

const destroy = (id, name) => {
    swal.mixin({
        customClass: {
            confirmButton: 'p-button p-component p-button-danger !mr-2',
            cancelButton: 'p-button p-component p-button-secondary'
        },
        buttonsStyling: false
    })
        .fire({
            icon: 'warning',
            title: 'Peringatan',
            text: `Apakah anda yakin ingin menghapus data ${name}?`,
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus Data!'
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                const response = await AuthApi.client().delete('gateway/example/customers/' + id);

                if (response.data.success) {
                    swal.fire({
                        title: 'Success',
                        text: 'Customer deleted successfully',
                        icon: 'success'
                    });

                    getCustomers();
                }
            }
        });
};

const add = () => {
    router.push('/pages/customer/create');
    isRedirect.value = true;
};

onMounted(async () => {
    title.value = 'Customers';

    countries.value = await Helper.getMasterData({ endpoint: 'gateway/example/countries' });
    statuses.value = await CustomerService.getStatuses();
});
</script>

<template>
    <div class="flex items-center justify-between">
        <h2 class="text-3xl text-slate-700 font-semibold leading-3">Customers</h2>

        <div class="flex gap-2">
            <Button label="Export" icon="pi pi-fw pi-download" text></Button>
            <Button label="Add Customer" @click="add" :loading="isRedirect" raised></Button>
        </div>
    </div>

    <div class="card mt-4">
        <div class="space-y-4 mt-2">
            <div class="grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-4">
                <label for="name3" class="">Search by Name</label>
                <InputText v-model="search.name" type="text" class="md:col-span-3" />
            </div>

            <div class="grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-4">
                <label for="name3" class="">Search by Country</label>
                <Select v-model="search.country" :options="countries" option-label="name" option-value="id" filter
                    placeholder="Select a Country" class="md:col-span-3" />
            </div>

            <div class="grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-4">
                <label for="name3" class="">Search by Status</label>
                <Select v-model="search.status" :options="statuses" placeholder="Select a Status"
                    class="md:col-span-3" />
            </div>
        </div>

        <div class="flex mt-12 justify-end">
            <Button label="Search" @click="getCustomers" :loading="isFiltering" raised />
        </div>

        <div class="mt-8" v-if="visible">
            <div class="font-semibold text-xl mb-2">List of Data</div>
            <div class="card mt-4">
                <DataTable :value="data" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="min-width: 50rem" row-hover data-key="id">
                    <Column header="#">
                        <template #body="{ index }">{{ index + 1 }}</template>
                    </Column>
                    <Column field="name" header="Name" style="width: 25%"></Column>
                    <Column field="country" header="Country" style="width: 25%"></Column>
                    <Column field="company" header="Company" style="width: 25%"></Column>
                    <Column field="balance" header="Representative" style="width: 25%"></Column>

                    <Column>
                        <template #body="{ data }">
                            <div class="flex gap-1 justify-end">
                                <DropdownButton :items="items" :data="data" :menu-key="data.id" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
