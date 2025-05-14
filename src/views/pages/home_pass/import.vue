<script setup>
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { usePrimeVue } from 'primevue/config';
import { inject, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as XLSX from 'xlsx';

const router = useRouter();
const route = useRoute();
const swal = inject('$swal');
const selectedFile = ref(null);
const isUploading = ref(false);
const fileData = ref([]);
const columns = ref([]);
const first = ref(0);
const dataLoaded = ref(false);
const validationErrors = ref([]);
const $primevue = usePrimeVue();
const totalSize = ref(0);
const totalSizePercent = ref(0);
const loading = ref(false);
const emits = defineEmits(['update:modelValue']);

const fileUpload = ref();

const handleFileChange = async (event) => {
    const selectedFile = event.files[0];
    if (selectedFile) {
        try {
            await uploadFile(selectedFile, 'validation');
            const parsedData = await parseExcel(selectedFile);
            fileData.value = parsedData.data;
            columns.value = parsedData.columns;
            dataLoaded.value = true;
        } catch (error) {
            console.error('Error parsing file:', error);
        }
    } else {
        console.error('No file selected or invalid event target');
    }
};

const uploadFile = async (selectedFile, type) => {


    type == 'save' ? loading.value = true : isUploading.value = true;

    const formData = new FormData();
    formData.append('data_excel', selectedFile == null ? fileUpload.value.files[0] : selectedFile);
    formData.append('type', type);


    try {
        const response = await AuthApi.client()({
            url: 'gateway/main_service/home_pass/import',
            method: 'post',
            data: formData,
        });


        if (response.data.success) {
            if (type == 'save') {
                loading.value = false;
                fileUpload.value.clear();
                swal.fire('Success', 'Data saved successfully.', 'success');
            }
            fileData.value = [];
            columns.value = [];
            dataLoaded.value = false;
            validationErrors.value = [];

        } else {

            validationErrors.value = response.data.validation_errors || [];
        }
    } catch (error) {
        console.error('Error during file upload:', error);
        swal.fire('Error', 'Something went wrong during the upload.', 'error');
    } finally {
        isUploading.value = false;
    }
};

const dateBodyTemplate = (rowData) => {
    const date = new Date(rowData.date);
    return date.toLocaleDateString();
};

const parseExcel = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length < 2) {
                reject('No data found in the sheet');
                return;
            }

            const columns = jsonData[0];
            const formattedColumns = columns.map(col => ({
                header: col,
                field: col.toLowerCase().replace(/\s+/g, '_')
            }));

            const dataRows = jsonData.slice(1).map(row => {
                let rowData = {};
                row.forEach((value, index) => {
                    rowData[columns[index].toLowerCase().replace(/\s+/g, '_')] = value;
                });
                return rowData;
            });

            resolve({
                columns: [...formattedColumns],
                data: [...dataRows]
            });
        };
        reader.onerror = (err) => {
            reject(err);
        };
        reader.readAsBinaryString(file);
    });
};

onMounted(async () => {
    const title = route.params.id ? 'Edit Ms Area' : 'Add Ms Area';
    Helper.setTitle(title);
});

const goBack = () => {
    router.push('/pages/home_pass');
};

const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
    fileData.value = [];
    columns.value = [];
    dataLoaded.value = false;
    validationErrors.value = [];
    emits('update:modelValue', fileUpload.value.files);
};

const getKey = (file) => {
    return file instanceof File ? file.name + file.type + file.size : file;
};

const getFilename = (file) => {
    return file instanceof File ? file.name : file;
};

const isColumnsEmpty = () => {
    return fileData.value.some(row => !row.provinsi || !row.kota || !row.kecamatan);
};

</script>

<template>
    <div class="card">
        <div class="flex flex-col space-y-4">
            <div class="flex justify-start">
                <Button
                    class="font-medium text-sm text-gray-700 dark:text-white bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    onclick="window.location.href='http://172.16.4.115:9001/appzone-dev/home_pass/TEMPLATE_UPLOAD_HOMEPASS.xlsx'">
                    Template File
                </Button>
            </div>
            <FileUpload name="demo" ref="fileUpload" :maxFileSize="10000000" file-limit="1" choose-icon="pi pi-upload"
                :show-upload-button="false" :show-cancel-button="false" @select="handleFileChange" :choose-button-props="{
                    outlined: true,
                }" :pt="{
                    root: {
                        class: '!border-2 !border-dashed'
                    }
                }">
                <template #content="{ files, removeFileCallback }">
                    <div class="flex flex-col gap-2">
                        <div v-for="(file, index) of files" :key="getKey(file)"
                            class="flex items-center gap-4 p-4 border rounded">
                            <div class="flex-1 text-ellipsis overflow-hidden">
                                <span class="font-semibold whitespace-nowrap overflow-hidden">{{ getFilename(file)
                                }}</span>
                                <div>{{ formatSize(file.size) }}</div>
                            </div>
                            <Button icon="pi pi-trash" @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                                outlined rounded severity="danger" />
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="flex items-center justify-center flex-col">
                        <div class="size-12 rounded-full border-2 flex justify-center items-center">
                            <i class="pi pi-plus !text-xl !text-muted-color" />
                        </div>
                        <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
                    </div>
                </template>
            </FileUpload>
        </div><br>

        <div v-if="isUploading" class="flex justify-center items-center">
            <span class="spinner-border text-primary" role="status">
                <i class="pi pi-spin pi-spinner text-primary dark:text-gray-300" style="font-size: 2rem; "></i>
            </span>

        </div>

        <div v-if="validationErrors.length > 0" class="card p-4 mb-4 dark:bg-black border border-red-300 ">
            <h3 class="font-medium text-lg text-red-600">Validation Errors</h3>
            <ul>
                <li v-for="(error, index) in validationErrors" :key="index">
                    <strong>Row {{ error.row }}:</strong>
                    <ul>
                        <li v-for="(detail, key) in error.errors" :key="key">
                            <strong>{{ key }}:</strong> {{ detail }}
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <DataTable v-if="dataLoaded" :value="fileData" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 150rem" row-hover data-key="home_id" v-model:first="first">
            <Column header="#" style="width: 5%">
                <template #body="{ index }">
                    {{ first + index + 1 }}
                </template>
            </Column>

            <Column field="home_id" header="Home Code" style="width: 6%"></Column>
            <Column field="provinsi" header="Provinsi" style="width: 8%"></Column>
            <Column field="kota" header="Kota" style="width: 10%"></Column>
            <Column field="kecamatan" header="Kecamatan" style="width: 7%"></Column>
            <Column field="cluster" header="Cluster" style="width: 10%"></Column>
            <Column field="fat_id" header="Fat ID" style="width: 8%"></Column>
            <Column field="kelurahan" header="Kelurahan" style="width: 10%"></Column>
            <Column field="nama_jalan" header="Nama Jalan" style="width: 10%"></Column>
            <Column field="no_rumah" header="No Rumah" style="width: 6%"></Column>
            <Column field="site_id" header="Site ID" style="width: 5%"></Column>
            <Column field="status" header="Status" style="width: 10%"></Column>
            <Column field="type_fat" header="Type FAT" style="width: 15%"></Column>
            <Column field="type_hp" header="Type HP" style="width: 15%"></Column>
        </DataTable>

        <div class="flex justify-start items-center gap-2 mt-4">
            <Button label="Kembali" type="button" severity="secondary" @click="goBack" />
            <Button label="Save" type="button"
                :disabled="validationErrors.length > 0 || !dataLoaded || isColumnsEmpty()" :loading="loading"
                @click="uploadFile(null, 'save')" />

        </div>
    </div>
</template>
