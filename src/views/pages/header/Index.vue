<script setup>
import DropdownButton from '@/components/DropdownButton.vue';
import { AuthApi } from '@/service/Api';
import { useTitle } from '@vueuse/core';
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const swal = inject('$swal');
const title = useTitle();
const router = useRouter();

const visible = ref(false);

const search = ref({
    page_title: null,
    service: null,
    database: null
});

const page = ref(0);
const rows = ref(10);
const data = ref([]);

const isFiltering = ref(false);
const isRedirect = ref(false);

async function getTblHeader() {
    isFiltering.value = true;

    const params = {};

    for (const key in search.value) {
        if (search.value[key] != '' && search.value[key] != null) {
            params[key] = search.value[key];
        }
    }

    try {
        const response = await AuthApi.client().get('gateway/example/tbl_header/?' + new URLSearchParams(params));

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
            router.push({ name: 'tbl-header-edit', params: { id: e.item.data.id } });
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
                const response = await AuthApi.client().delete('gateway/example/tbl_header/' + id);

                if (response.data.success) {
                    swal.fire({
                        title: 'Success',
                        text: 'Tbl header deleted successfully',
                        icon: 'success'
                    });

                    getTblHeader();
                }
            }
        });
};

const add = () => {
    router.push('/pages/tbl_header/create');
    isRedirect.value = true;
};

const onPageChange = (event) => {
    page.value = event.page;
    rows.value = event.rows;
};

onMounted(async () => {
    title.value = 'Header-Detail Example';
});
</script>

<template>
    <div class="flex items-center justify-between">
        <h2 class="text-3xl text-slate-700 font-semibold leading-3">Tbl Header</h2>

        <div class="flex gap-2">
            <Button label="Export" icon="pi pi-fw pi-download" text></Button>
            <Button label="Add Tbl Header" @click="add" :loading="isRedirect" raised></Button>
        </div>
    </div>

    <div class="card mt-4">
        <div class="space-y-4 mt-2">
            <div class="grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-4">
                <label for="page_title" class="">Search by Title</label>
                <InputText v-model="search.page_title" id="page_title" type="text" class="md:col-span-3" />
            </div>

            <div class="grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-4">
                <label for="service" class="">Search by Service</label>
                <InputText v-model="search.service" id="service" type="text" class="md:col-span-3" />
            </div>

            <div class="grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-4">
                <label for="database" class="">Search by Database</label>
                <InputText v-model="search.database" id="database" type="text" class="md:col-span-3" />
            </div>
        </div>

        <div class="flex mt-12 justify-end">
            <Button label="Search" @click="getTblHeader" :loading="isFiltering" raised />
        </div>

        <div class="mt-8" v-if="visible">
            <Divider class="mt-12" />
            <div class="font-semibold text-xl mb-2">List of Data</div>
            <div class="card mt-4">
                <DataTable :value="data" paginator :rows="rows" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem" row-hover data-key="id" @page="onPageChange">
                    <Column header="#">
                        <template #body="{ index }">{{ rows * page + index + 1 }}</template>
                    </Column>
                    <Column field="page_title" header="Page Title" style="width: 25%"></Column>
                    <Column field="service" header="Service" style="width: 25%"></Column>
                    <Column field="database" header="Database" style="width: 25%"></Column>

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
