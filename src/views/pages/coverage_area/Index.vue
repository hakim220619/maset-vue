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


const search = ref({
    cluster: '',
    cluster_id: null,
    third_party_type: '',
    total_homepass: null,
    hp_ok: null,
    hp_idle: null,
    total_hp: null,
    status: '',
    total_fat: null,
    subdistrict_id: null,
    service_id: null,
    site_category_id: null,
    ikr_region_id: null,
    fat_id: null,
    area_id: null
});


async function getCoverageArea() {
    isFiltering.value = true;

    const params = Helper.formatSearchParams(search.value);

    try {
        const response = await AuthApi.client().get('gateway/main_service/coverage_area/?' + new URLSearchParams(params));

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
            router.push({ name: 'Coverage Area Edit', params: { id: e.item.data.id } });
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
                const response = await AuthApi.client().delete('gateway/main_service/coverage_area/' + id);

                if (response.data.success) {
                    swal.fire({
                        title: 'Success',
                        text: 'Coverage Area deleted successfully',
                        icon: 'success'
                    });

                    getCoverageArea();
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
    await Helper.exportExcelFromApi('gateway/main_service/coverage_area/export', 'coverage_area.xlsx', params);
};

const add = () => {
    router.push('/pages/coverage_area/create');
    isRedirect.value = true;
};

onMounted(async () => {
    title.value = 'Coverage Area';
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
                    <label for="cluster" class="text-sm font-medium text-gray-700 dark:text-white">Search by
                        Cluster</label>
                    <div class="relative">
                        <InputText v-model="search.cluster" type="text" class="mt-1 p-2 border rounded-md w-full" />
                        <button v-if="search.cluster" @click="search.cluster = ''"
                            class="absolute inset-y-0 right-2 text-gray-500 text-2xl">
                            &times;
                        </button>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label for="cluster_id" class="text-sm font-medium text-gray-700 dark:text-white">Search by Cluster
                        Id</label>
                    <div class="relative">
                        <InputText v-model="search.cluster_id" type="text" class="mt-1 p-2 border rounded-md w-full" />
                        <button v-if="search.cluster_id" @click="search.cluster_id = ''"
                            class="absolute inset-y-0 right-2 text-gray-500 text-2xl">
                            &times;
                        </button>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label for="third_party_type" class="text-sm font-medium text-gray-700 dark:text-white">Search by
                        Third Party Type</label>
                    <div class="relative">
                        <InputText v-model="search.third_party_type" type="text"
                            class="mt-1 p-2 border rounded-md w-full" />
                        <button v-if="search.third_party_type" @click="search.third_party_type = ''"
                            class="absolute inset-y-0 right-2 text-gray-500 text-2xl">
                            &times;
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex justify-end mt-6">
                <Button label="Search" @click="getCoverageArea" :loading="isFiltering" raised
                    class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </div>



        <div class="card mt-5" v-if="visible">
            <div class="font-semibold text-xl mb-2">List of Data</div>
            <div class="card mt-4">
                <DataTable :value="data" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="min-width: 180rem" row-hover data-key="id" v-model:first="first">
                    <Column header="#">
                        <template #body="{ index }">
                            {{ first + index + 1 }}
                        </template>
                    </Column>
                    <Column field="cluster_id" header="Cluster Id" style="width: 7%"></Column>
                    <Column field="cluster" header="Cluster" style="width: 7%"></Column>
                    <Column field="third_party_type" header="Third Party Type" style="width: 7%"></Column>
                    <Column field="total_homepass" header="Total Homepass" style="width: 7%"></Column>
                    <Column field="hp_ok" header="Hp Ok" style="width: 7%"></Column>
                    <Column field="hp_idle" header="Hp Idle" style="width: 7%"></Column>
                    <Column field="total_hp" header="Total Hp" style="width: 7%"></Column>
                    <Column field="is_active" header="STATUS" style="width: 7%">
                        <template #body="{ data }">
                            <span>{{ data.is_active ? 'Live' : 'Inactive' }}</span>
                        </template>
                    </Column>
                    <Column field="subdistrict_name" header="Subdistrict" style="width: 7%"></Column>
                    <Column field="service_name" header="Service" style="width: 7%"></Column>
                    <Column field="site_category_name" header="Site Category" style="width: 7%"></Column>
                    <Column field="ikr_region_name" header="Ikr Region" style="width: 7%"></Column>
                    <Column field="fat_name" header="Fat" style="width: 10%"></Column>
                    <Column field="area_name" header="Area" style="width: 15%"></Column>


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
