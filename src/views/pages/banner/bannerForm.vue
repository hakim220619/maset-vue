<script setup>
import InputError from '@/components/InputError.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import _ from 'lodash';
import { inject, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import { storeSchema } from './schema.js';

const router = useRouter();
const route = useRoute();
const swal = inject('$swal');
// const validityTypesData = ref([]);

const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]

const selectedDays = ref([])


const form = ref({
    data: {
        title: "",
        icon: "",
        description: "",
        start_date: "",
        end_date: "",
        file: "",
        color: "",
        days: "",
        link_url: "",
        is_active: "",
        is_only_intranet: "",
        is_mailing: "",
        is_special_case: "",
        timing_day_start: "",
        timing_day_end: "",
        placement: ""
    },

    errors: {
        title: null,
        icon: null,
        description: null,
        start_date: null,
        end_date: null,
        file: null,
        color: null,
        days: null,
        link_url: null,
        is_active: null,
        is_only_intranet: null,
        is_mailing: null,
        is_special_case: null,
        timing_day_start: null,
        timing_day_end: null,
        placement: null
    },
    assign: (data = {}) => {
        for (const key in data) {
            if (_.has(form.value.data, key)) {
                const newValue = data[key];

                if (typeof newValue === 'boolean' ||
                    (newValue && typeof newValue === typeof form.value.data[key]) ||
                    (Number.isInteger(newValue) && !isNaN(newValue))) {

                    form.value.data[key] = newValue;
                }
            }
        }
    },
    loading: false
});

const save = async () => {
    form.value.loading = true;

    const url = route.params.id ? 'gateway/main_service/banner/' + route.params.id : 'gateway/main_service/banner';

    try {
        storeSchema.parse(form.value.data);

        const response = await AuthApi.client()({
            url: url,
            method: route.params.id ? 'put' : 'post',
            data: Helper.parseFormdata(form.value.data)
        });

        if (response.data.success) {
            swal.fire({
                title: 'Success',
                text: 'banner saved successfully',
                icon: 'success'
            });

            router.push({ name: 'banner List' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to save banner',
                icon: 'error'
            });
        }
    }

    form.value.loading = false;
};

for (const key in form.value.data) {
    watch(
        () => form.value.data[key],
        () => {
            form.value.errors[key] = '';
        }
    );
}

onBeforeMount(async () => {
    if (route.params.id) {
        const userData = await Helper.getDataById('gateway/main_service/banner', route.params.id);
        if (userData) {
            form.value.assign(userData);
        }
    }
});

onMounted(async () => {
    const title = route.params.id ? 'Edit banner' : 'Add banner';

    Helper.setTitle(title);

    // get master data
    // validityTypesData.value = await Helper.getMasterData({ endpoint: 'gateway/example/validityTypesData' });
});
const goBack = () => {
    router.push('/pages/banner');
};
</script>

<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid md:grid-cols-2 md:gap-x-32 gap-y-4">
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="title" class="text-surface-500 dark:text-white">Title</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.title" class="w-full" id="title" :invalid="!!form.errors.title" />
                    <InputError :message="form.errors.title" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="icon" class="text-surface-500 dark:text-white">Icon</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.icon" class="w-full" id="icon" :invalid="!!form.errors.icon" />
                    <InputError :message="form.errors.icon" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="description" class="text-surface-500 dark:text-white">Description</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.description" class="w-full" id="description" :invalid="!!form.errors.description" />
                    <InputError :message="form.errors.description" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="start_date" class="text-surface-500 dark:text-white">Start Date</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.start_date" class="w-full" id="start_date" :invalid="!!form.errors.start_date" />
                    <InputError :message="form.errors.start_date" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="end_date" class="text-surface-500 dark:text-white">End Date</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.end_date" class="w-full" id="end_date" :invalid="!!form.errors.end_date" />
                    <InputError :message="form.errors.end_date" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="file" class="text-surface-500 dark:text-white">File</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.file" class="w-full" id="file" :invalid="!!form.errors.file" />
                    <InputError :message="form.errors.file" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="color" class="text-surface-500 dark:text-white">Color</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.color" class="w-full" id="color" :invalid="!!form.errors.color" />
                    <InputError :message="form.errors.color" />
                </div>
            </div>

            <!-- input: days -->
            <!-- <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="days" class="text-surface-500 dark:text-white">Days</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.days" class="w-full" id="days" :invalid="!!form.errors.days" />
                    <InputError :message="form.errors.days" />
                </div>
            </div> -->
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="days" class="text-surface-500 dark:text-white">Days</label>
                <div class="md:col-span-3">
                    <div class="flex flex-wrap gap-2">
                        <div v-for="day in daysOfWeek" :key="day" class="flex items-center">
                            <Checkbox :inputId="`day-${day}`" :value="day" v-model="form.data.days" :binary="false" />
                            <label :for="`day-${day}`" class="ml-2">{{ day }}</label>
                        </div>
                    </div>
                    <InputError :message="form.errors.days" />
                </div>
            </div>
            <!-- ==================================================================== -->

            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="link_url" class="text-surface-500 dark:text-white">Link URL</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.link_url" class="w-full" id="link_url" :invalid="!!form.errors.link_url" />
                    <InputError :message="form.errors.link_url" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="is_active" class="text-surface-500 dark:text-white">Is Active</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.is_active" class="w-full" id="is_active" :invalid="!!form.errors.is_active" />
                    <InputError :message="form.errors.is_active" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="is_only_intranet" class="text-surface-500 dark:text-white">Only Intranet</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.is_only_intranet" class="w-full" id="is_only_intranet" :invalid="!!form.errors.is_only_intranet" />
                    <InputError :message="form.errors.is_only_intranet" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="is_mailing" class="text-surface-500 dark:text-white">Is Mailing</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.is_mailing" class="w-full" id="is_mailing" :invalid="!!form.errors.is_mailing" />
                    <InputError :message="form.errors.is_mailing" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="is_special_case" class="text-surface-500 dark:text-white">Is Special Case</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.is_special_case" class="w-full" id="is_special_case" :invalid="!!form.errors.is_special_case" />
                    <InputError :message="form.errors.is_special_case" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="timing_day_start" class="text-surface-500 dark:text-white">Timing Day Start</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.timing_day_start" class="w-full" id="timing_day_start" :invalid="!!form.errors.timing_day_start" />
                    <InputError :message="form.errors.timing_day_start" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="timing_day_end" class="text-surface-500 dark:text-white">Timing Day End</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.timing_day_end" class="w-full" id="timing_day_end" :invalid="!!form.errors.timing_day_end" />
                    <InputError :message="form.errors.timing_day_end" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="placement" class="text-surface-500 dark:text-white">Placement</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.placement" class="w-full" id="placement" :invalid="!!form.errors.placement" />
                    <InputError :message="form.errors.placement" />
                </div>
            </div>
        </div>

        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>
