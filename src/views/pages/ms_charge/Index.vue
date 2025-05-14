<script setup>
import DropdownButton from '@/components/DropdownButton.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { useTitle } from '@vueuse/core';
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


const swal = inject('$swal');
const title = useTitle();
const router = useRouter();

const data = ref([]);
const visible = ref(false);
const isFiltering = ref(false);
const isExport = ref(false);
const isRedirect = ref(false);
const showSearchFields = ref(false);

const search = ref({
    name: '',
    charge_pattern: null,
    charge_type: null
});


async function getms_charge() {
    isFiltering.value = true;

    const params = {};

    for (const key in search.value) {
        if (search.value[key] != '' && search.value[key] != null) {
            params[key] = search.value[key];
        }
    }

    try {
        const response = await AuthApi.client().get('gateway/main_service/ms_charge/?' + new URLSearchParams(params));

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
            router.push({ name: 'Ms Charge Edit', params: { id: e.item.data.id } });
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
                const response = await AuthApi.client().delete('gateway/main_service/ms_charge/' + id);

                if (response.data.success) {
                    swal.fire({
                        title: 'Success',
                        text: 'Ms Charge deleted successfully',
                        icon: 'success'
                    });

                    getms_charge();
                }
            }
        });
};


const openSerach = () => {
    showSearchFields.value = !showSearchFields.value;
    visible.value = false;
};


const exportExcel = async () => {
    const params = Helper.formatSearchParams(search.value);
    await Helper.exportExcelFromApi('gateway/main_service/ms_charge/export', 'ms_charge.xlsx', params);
};

const add = () => {
    router.push('/pages/ms_charge/create');
    isRedirect.value = true;
};

onMounted(async () => {
    title.value = 'Ms Charge';
});
</script>

<template>
    <div class="flex items-center justify-between flex-wrap">
        <h2 class="text-3xl text-slate-700 font-semibold leading-3 w-full md:w-auto dark:text-white">{{ title }}</h2>

        <ButtonGroup class="w-full md:w-auto flex justify-between mt-4 md:mt-0">
            <Button label="Search" icon="pi pi-search" @click="openSerach" class="w-full md:w-auto mb-2 md:mb-0" />
            <Button label="Export" icon="pi pi-upload" @click="exportExcel" :loading="isExport"
                class="w-full md:w-auto mb-2 md:mb-0" />
            <Button label="Create" icon="pi pi-plus" @click="add" class="w-full md:w-auto mb-2 md:mb-0" />
        </ButtonGroup>
    </div>

    <div class="mt-4" v-if="showSearchFields">
        <div class="card space-y-4 mt-2 p-4 rounded-lg shadow-md">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div class="flex flex-col">
                    <label for="name" class="text-sm font-medium text-gray-700 dark:text-white">Search by Name</label>
                    <div class="relative">
                        <InputText v-model="search.name" type="text" class="mt-1 p-2 border rounded-md w-full" />
                        <button v-if="search.name" @click="search.name = ''"
                            class="absolute inset-y-0 right-2 text-gray-500 text-2xl">
                            &times;
                        </button>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label for="charge_pattern" class="text-sm font-medium text-gray-700 dark:text-white">Search by
                        Charge
                        Pattern</label>
                    <div class="relative">
                        <InputText v-model="search.charge_pattern" type="number"
                            class="mt-1 p-2 border rounded-md w-full" />
                        <button v-if="search.charge_pattern" @click="search.charge_pattern = ''"
                            class="absolute inset-y-0 right-2 text-gray-500 text-2xl">
                            &times;
                        </button>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label for="charge_type" class="text-sm font-medium text-gray-700 dark:text-white">Search by Charge
                        Type</label>
                    <div class="relative">
                        <InputText v-model="search.charge_type" type="number"
                            class="mt-1 p-2 border rounded-md w-full" />
                        <button v-if="search.charge_type" @click="search.charge_type = ''"
                            class="absolute inset-y-0 right-2 text-gray-500 text-2xl">
                            &times;
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex justify-end mt-6">
                <Button label="Search" @click="getms_charge" :loading="isFiltering" raised
                    class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </div>

        <div class="card mt-5" v-if="visible">
            <div class="font-semibold text-xl mb-2">List of Data</div>
            <div class="card mt-4">
                <DataTable :value="data" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="min-width: 50rem" row-hover data-key="id">
                    <Column header="#">
                        <template #body="{ index }">{{ index + 1 }}</template>
                    </Column>
                    <Column field="name" header="Name" style="width: 25%"></Column>
                    <Column field="charge_pattern" header="Charge Pattern" style="width: 25%"></Column>
                    <Column field="charge_type" header="Charge Type" style="width: 25%"></Column>



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
x``