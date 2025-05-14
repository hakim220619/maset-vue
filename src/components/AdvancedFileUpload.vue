<script setup>
import axios from 'axios';
import { usePrimeVue } from 'primevue/config';
import { computed, ref, watch } from 'vue';

const props = defineProps({
    modelValue: Array,
    multiple: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['update:modelValue']);

const $primevue = usePrimeVue();

const fileUpload = ref();

const totalSize = ref(0);
const totalSizePercent = ref(0);

const files = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emits('update:modelValue', newValue);
    }
});

const onSelectedFiles = (event) => {
    files.value = event.files;
};

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;

    emits('update:modelValue', fileUpload.value.files);
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

const getKey = (file) => {
    return file instanceof File ? file.name + file.type + file.size : file;
};

const getFilename = (file) => {
    return file instanceof File ? file.name : file;
};

watch(
    () => props.modelValue.length,
    () => {
        for (const url of props.modelValue) {
            if (typeof url === 'string') {
                axios
                    .get(url, {
                        responseType: 'blob'
                    })
                    .then((res) => {
                        const file = new File([res.data], url.split('/')[url.split('/').length - 1], {
                            type: res.headers['content-type'],
                            lastModified: Date.now()
                        });

                        fileUpload.value.files.push(file);
                    });
            }
        }

        emits('update:modelValue', fileUpload.value.files);
    }
);
</script>

<template>
    <FileUpload
        name="demo[]"
        url="/api/upload"
        ref="fileUpload"
        :maxFileSize="10000000"
        choose-icon="pi pi-upload"
        :show-upload-button="false"
        :show-cancel-button="false"
        @select="onSelectedFiles"
        :multiple="props.multiple"
        :choose-button-props="{
            outlined: true,
            disabled: props.multiple ? props.multiple : files.length
        }"
        :pt="{
            root: {
                class: '!border-2 !border-dashed'
            }
        }"
    >
        <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
            <div class="flex flex-col gap-2">
                <div v-for="(file, index) of files" :key="getKey(file)" class="flex items-center gap-4 p-4 border rounded">
                    <div class="flex-1 text-ellipsis overflow-hidden">
                        <span class="font-semibold whitespace-nowrap overflow-hidden">{{ getFilename(file) }}</span>
                        <div>{{ formatSize(file.size) }}</div>
                    </div>
                    <Button icon="pi pi-trash" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded severity="danger" />
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
</template>
