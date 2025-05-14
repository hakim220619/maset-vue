<script setup>
import DropdownButton from '@/components/DropdownButton.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { useTitle } from '@vueuse/core';
import moment from 'moment';
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
    icon_code: '',
    is_active: null
});


const activeOptions = [
    { label: 'Select', value: null },
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
];



async function getMsIcons() {
    isFiltering.value = true;

    const params = Helper.formatSearchParams(search.value);

    try {
        const response = await AuthApi.client().get('gateway/main_service/ms_icons/?' + new URLSearchParams(params));

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
            router.push({ name: 'Icons Edit', params: { id: e.item.data.id } });
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
                const response = await AuthApi.client().delete('gateway/main_service/ms_icons/' + id);

                if (response.data.success) {
                    swal.fire({
                        title: 'Success',
                        text: 'Icons deleted successfully',
                        icon: 'success'
                    });

                    getMsIcons();
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
    await Helper.exportExcelFromApi('gateway/main_service/ms_icons/export', 'ms_icons.xlsx', params);
};

const add = () => {
    router.push('/pages/ms_icons/create');
    isRedirect.value = true;
};

onMounted(async () => {
    title.value = 'Icons';
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
                    <label for="icon_code" class="text-sm font-medium text-gray-700 dark:text-white">Search by Icon
                        Code</label>
                    <div class="relative">
                        <InputText v-model="search.icon_code" type="text" class="mt-1 p-2 border rounded-md w-full" />
                        <button v-if="search.icon_code" @click="search.icon_code = ''"
                            class="absolute inset-y-0 right-2 text-gray-500 text-2xl">
                            &times;
                        </button>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label for="is_active" class="text-sm font-medium text-gray-700 dark:text-white">Search by
                        Active</label>
                    <Dropdown v-model="search.is_active" :options="activeOptions" optionLabel="label"
                        optionValue="value" class="mt-1 border rounded-md w-full" placeholder="Select Active Status" />
                </div>
            </div>

            <div class="flex justify-end mt-6">
                <Button label="Search" @click="getMsIcons" :loading="isFiltering" raised
                    class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </div>



        <div class="card mt-5" v-if="visible">
            <div class="font-semibold text-xl mb-2">List of Data</div>
            <div class="card mt-4">
                <DataTable :value="data" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="min-width: 50rem" row-hover data-key="id" v-model:first="first">
                    <Column header="#">
                        <template #body="{ index }">
                            {{ first + index + 1 }}
                        </template>
                    </Column>

                    <Column field="icon_code" header="STATUS" style="width: 25%">
                        <template #body="{ data }">
                            <i :class="data.icon_code" class="layout-menuitem-icon"></i>&nbsp;
                            <span style="margin-right: 8px;">{{ data.icon_code }}</span>

                        </template>
                    </Column>

                    <Column field="is_active" header="STATUS" style="width: 25%">
                        <template #body="{ data }">
                            <span>{{ data.is_active ? 'Live' : 'Inactive' }}</span>
                        </template>
                    </Column>

                    <Column field="created_at" header="STATUS" style="width: 25%">
                        <template #body="{ data }">
                            <span>{{ data.updated_at == null ? moment(data.created_at).format('YYYY-MM-DD HH:mm:ss') :
                                moment(data.updated_at).format('YYYY-MM-DD HH:mm:ss') }}</span>
                        </template>
                    </Column>

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
