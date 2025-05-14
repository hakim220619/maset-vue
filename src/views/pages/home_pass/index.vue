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
const first = ref(0);
const showImportModal = ref(false);
const selectedFile = ref(null);
const isUploading = ref(false);

const search = ref({
    home_code: null,
    site_code: null,
    fat_code: '',
    zip_code: null,
    sp_code: '',
    address_home_no: '',
    latitude: '',
    longitude: '',
    type_hp: '',
    fat_id: null,
    coveragearea_id: null,
    address_street_id: null,
    status_id: null,
    home_id_smt: null
});


async function getHomePass() {
    isFiltering.value = true;

    const params = Helper.formatSearchParams(search.value);

    try {
        const response = await AuthApi.client().get('gateway/main_service/home_pass/?' + new URLSearchParams(params));

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
            router.push({ name: 'Home Pass Edit', params: { id: e.item.data.id } });
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
                const response = await AuthApi.client().delete('gateway/main_service/home_pass/' + id);

                if (response.data.success) {
                    swal.fire({
                        title: 'Success',
                        text: 'Home Pass deleted successfully',
                        icon: 'success'
                    });

                    getHomePass();
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
    await Helper.exportExcelFromApi('gateway/main_service/home_pass/export', 'home_pass.xlsx', params);
};

const add = () => {
    router.push('/pages/home_pass/create');
    isRedirect.value = true;
};

onMounted(async () => {
    title.value = 'Home Pass';
});
const importExcel = async () => {
    router.push('/pages/home_pass/import');
    isRedirect.value = true;
};

// Function to close modal
const closeModal = () => {
    showImportModal.value = false;
};



</script>

<template>
    <div class="flex items-center justify-between flex-wrap">
        <h2 class="text-3xl text-slate-700 font-semibold leading-3 w-full md:w-auto dark:text-white">{{ title }}</h2>

        <ButtonGroup class="w-full md:w-auto flex justify-between mt-4 md:mt-0">
            <Button label="Search" icon="pi pi-search" @click="openSerach" class="w-full md:w-auto mb-2 md:mb-0" />
            <Button label="Export" icon="pi pi-download" @click="exportExcel" :loading="isExport"
                class="w-full md:w-auto mb-2 md:mb-0" />
            <Button label="Import" icon="pi pi-upload" @click="importExcel" :loading="isExport"
                class="w-full md:w-auto mb-2 md:mb-0" />
            <Button label="Create" icon="pi pi-plus" @click="add" class="w-full md:w-auto mb-2 md:mb-0" />
        </ButtonGroup>
    </div>

    <div class="mt-4" v-if="showSearchFields">
        <div class="card space-y-4 mt-2 p-4 rounded-lg shadow-md">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div class="flex flex-col">
                    <label for="home_code" class="text-sm font-medium text-gray-700 dark:text-white">Search by Home
                        Code</label>
                    <div class="relative">
                        <InputText v-model="search.home_code" type="text" class="mt-1 p-2 border rounded-md w-full" />
                        <button v-if="search.home_code" @click="search.home_code = ''"
                            class="absolute inset-y-0 right-2 text-gray-500 text-2xl">
                            &times;
                        </button>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label for="site_code" class="text-sm font-medium text-gray-700 dark:text-white">Search by Site
                        Code</label>
                    <div class="relative">
                        <InputText v-model="search.site_code" type="text" class="mt-1 p-2 border rounded-md w-full" />
                        <button v-if="search.site_code" @click="search.site_code = ''"
                            class="absolute inset-y-0 right-2 text-gray-500 text-2xl">
                            &times;
                        </button>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label for="fat_code" class="text-sm font-medium text-gray-700 dark:text-white">Search by Fat
                        Code</label>
                    <div class="relative">
                        <InputText v-model="search.fat_code" type="text" class="mt-1 p-2 border rounded-md w-full" />
                        <button v-if="search.fat_code" @click="search.fat_code = ''"
                            class="absolute inset-y-0 right-2 text-gray-500 text-2xl">
                            &times;
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex justify-end mt-6">
                <Button label="Search" @click="getHomePass" :loading="isFiltering" raised
                    class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </div>



        <div class="card mt-5" v-if="visible">
            <div class="font-semibold text-xl mb-2">List of Data</div>
            <div class="card mt-4">
                <DataTable :value="data" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="min-width: 150rem" row-hover data-key="id" v-model:first="first">
                    <Column header="#">
                        <template #body="{ index }">
                            {{ first + index + 1 }}
                        </template>
                    </Column>
                    <Column field="home_code" header="Home Code" style="width: 7%"></Column>
                    <Column field="site_code" header="Site Code" style="width: 7%"></Column>
                    <Column field="fat_code" header="Fat Code" style="width: 8%"></Column>
                    <Column field="zip_code" header="Zip Code" style="width: 7%"></Column>
                    <Column field="sp_code" header="Sp Code" style="width: 8%"></Column>
                    <Column field="address_home_no" header="Address No" style="width: 8%"></Column>
                    <Column field="latitude" header="Latitude" style="width: 8%"></Column>
                    <Column field="longitude" header="Longitude" style="width: 8%"></Column>
                    <Column field="type_hp" header="Type Hp" style="width: 10%"></Column>
                    <Column field="address_name" header="Address Street" style="width: 12%"></Column>
                    <Column field="status_name" header="Status" style="width: 6%"></Column>
                    <Column field="home_id_smt" header="Home Id Smt" style="width: 15%"></Column>



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
    <!-- Modal for Import -->



</template>
