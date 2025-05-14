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
const provinceData = ref([]);
const citiesData = ref([]);
const districtData = ref([]);
const subDistrictData = ref([]);
const fatData = ref([]);
const serviceData = ref([]);
const ikrRegionData = ref([]);
const areaData = ref([]);
const siteCategoryData = ref([]);
const selectedProvince = ref(null);
const selectedCity = ref(null);
const selectedDistrict = ref(null);
const filteredCities = ref([]);
const filteredDistrict = ref([]);
const filteredSubDistrict = ref([]);
const areaDataFilter = ref([]);

const statusData = ref([
    { name: 'Live', id: true },
    { name: 'Inactive', id: false }
]);

const thirdPartyTypeData = ref([
    { id: 'Internal', name: 'Internal' },
    { id: 'External', name: 'External' }
]);


const form = ref({
    data: {
        cluster: "",
        cluster_code: "",
        third_party_type: "",
        total_homepass: "",
        hp_ok: "",
        hp_idle: "",
        total_hp: "",
        is_active: "",
        total_fat: 0,
        subdistrict_id: "",
        service_id: "",
        site_category_id: "",
        ikr_region_id: "",
        fat_id: "",
        area_id: "",
        province_id: "",
        city_id: "",
        district_id: "",
    },

    errors: {
        cluster: null,
        cluster_code: null,
        third_party_type: null,
        total_homepass: null,
        hp_ok: null,
        hp_idle: null,
        total_hp: null,
        is_active: null,
        total_fat: null,
        subdistrict_id: null,
        service_id: null,
        site_category_id: null,
        ikr_region_id: null,
        fat_id: null,
        area_id: null
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
    const { province_id, city_id, district_id, total_fat, ...formData } = { ...form.value.data };

    const url = route.params.id ? 'gateway/main_service/coverage_area/' + route.params.id : 'gateway/main_service/coverage_area';

    try {
        storeSchema.parse(formData);
        console.log(Helper.parseFormdata(formData));

        const response = await AuthApi.client()({
            url: url,
            method: route.params.id ? 'put' : 'post',
            data: Helper.parseFormdata(formData)
        });

        if (response.data.success) {
            swal.fire({
                title: 'Success',
                text: 'Coverage Area saved successfully',
                icon: 'success'
            });

            router.push({ name: 'Coverage Area List' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to save coverageArea',
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

async function fetchData(endpoint, dataProperty) {
    try {
        const response = await AuthApi.client().get(endpoint);
        dataProperty.value = response.data.data;
    } catch (error) {
        console.log(error);
    }
}

function filterDataById(data, id, idProperty) {
    return id ? data.filter(item => item[idProperty] === id) : [];
}

const getProvince = () => fetchData('gateway/main_service/ms_provinces', provinceData);

const getCities = async (id) => {
    try {
        const response = await AuthApi.client().get('gateway/main_service/ms_cities?province_id=' + id);
        citiesData.value = response.data.data;

        if (selectedProvince.value) {
            filteredCities.value = filterDataById(citiesData.value, selectedProvince.value, 'province_id');
        } else {
            filteredCities.value = citiesData.value;
        }
    } catch (error) {
        console.log(error);
    }
};
const getDistricts = async (id) => {
    try {
        const response = await AuthApi.client().get('gateway/main_service/ms_districts?city_id=' + id);
        districtData.value = response.data.data;

        if (selectedCity.value) {
            filteredDistrict.value = filterDataById(districtData.value, selectedCity.value, 'city_id');
        } else {
            filteredDistrict.value = districtData.value;
        }

    } catch (error) {
        console.log(error);
    }
};
const getSubDistricts = async (id) => {
    try {
        const response = await AuthApi.client().get('gateway/main_service/ms_subdistricts?district_id=' + id);
        subDistrictData.value = response.data.data;

        if (selectedDistrict.value) {
            filteredSubDistrict.value = filterDataById(subDistrictData.value, selectedDistrict.value, 'district_id');
        } else {
            filteredSubDistrict.value = subDistrictData.value;
        }
    } catch (error) {
        console.log(error);
    }
};

const onProvinceSelect = async (provinceId) => {
    selectedProvince.value = provinceId;
    form.value.data.city_id = null;
    form.value.data.district_id = null;
    filteredCities.value = filterDataById(citiesData.value, provinceId, 'province_id');
    filteredDistrict.value = [];
    filteredSubDistrict.value = [];
    await getCities(provinceId);

};

const onCitiesSelect = async (cityId) => {
    selectedCity.value = cityId;
    form.value.data.district_id = null;
    filteredDistrict.value = filterDataById(districtData.value, cityId, 'city_id');
    filteredSubDistrict.value = [];
    await getDistricts(cityId);

}

const onDistrictSelect = async (districtId) => {
    selectedDistrict.value = districtId;
    filteredSubDistrict.value = [];
    form.value.data.subdistrict_id = null;
    await getSubDistricts(districtId);
};

onBeforeMount(async () => {
    getProvince();
    getIkrRegion();
    getArea();
    filteredAreaData(form.value.data.ikr_region_id);

    siteCategoryData.value = await Helper.getMasterData({ endpoint: 'gateway/main_service/ms_site_category' });
    fatData.value = await Helper.getMasterData({ endpoint: 'gateway/main_service/ms_fat' });
    serviceData.value = await Helper.getMasterData({ endpoint: 'gateway/main_service/ms_service' });

    if (route.params.id) {
        const userData = await Helper.getDataById('gateway/main_service/coverage_area', route.params.id);
        if (userData) {
            form.value.assign(userData);
            selectedProvince.value = userData.province_id;
            selectedDistrict.value = userData.district_id;
            await getCities(userData.province_id);
            await getDistricts(userData.city_id);
            await getSubDistricts(userData.district_id);

        }
    }
});

const getIkrRegion = () => fetchData('gateway/main_service/ms_ikr_region', ikrRegionData);
const getArea = () => fetchData('gateway/main_service/ms_area', areaData);

function filteredAreaData(regionId) {
    if (regionId) {
        const region = ikrRegionData.value.find(r => r.id === regionId);
        if (region) {
            if (region.area_id === null) {
                areaDataFilter.value = null;
            } else {
                areaDataFilter.value = areaData.value.filter(area => area.id === region.area_id);
            }
        }
    } else {
        areaDataFilter.value = null;
        areaData.value = [...areaData.value];
    }
}


watch(
    [
        () => form.value.data.ikr_region_id,
        () => form.value.data.hp_ok,
        () => form.value.data.hp_idle
    ],
    ([newRegionId, newHpOk, newHpIdle]) => {
        filteredAreaData(newRegionId);

        const ok = parseInt(newHpOk) || 0;
        const idle = parseInt(newHpIdle) || 0;
        form.value.data.total_hp = ok + idle;
    }
);

onMounted(async () => {
    const title = route.params.id ? 'Edit Coverage Area' : 'Add Coverage Area';
    Helper.setTitle(title);

});


const goBack = () => {
    router.push('/pages/coverage_area');
};
</script>


<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div class="space-y-4">
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 dark:text-white">Province</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.province_id" :options=provinceData show-clear
                            @change="onProvinceSelect(form.data.province_id)" option-label="province_name"
                            option-value="province_id" filter :virtualScrollerOptions="{ itemSize: 38 }"
                            placeholder="Select a province" class="w-full" :invalid="!!form.errors.province" />
                        <InputError :message="form.errors.province" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 dark:text-white">District</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.district_id" @change="onDistrictSelect(form.data.district_id)"
                            :options=filteredDistrict show-clear option-label="district_name" option-value="district_id"
                            filter :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a district"
                            class="w-full" :invalid="!!form.errors.district" />
                        <InputError :message="form.errors.district" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label for="cluster" class="text-surface-500 dark:text-white">Cluster</label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.cluster" class="w-full" id="cluster"
                            :invalid="!!form.errors.cluster" />
                        <InputError :message="form.errors.cluster" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label for="cluster_code" class="text-surface-500 dark:text-white">Cluster Id</label>
                    <div class="md:w-3/4">
                        <InputNumber v-model="form.data.cluster_code" class="w-full" id="cluster_code"
                            :invalid="!!form.errors.cluster_code" inputId="withoutgrouping" :useGrouping="false"
                            fluid />
                        <InputError :message="form.errors.cluster_code" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label for="hp_ok" class="text-surface-500 dark:text-white">Hp Ok</label>
                    <div class="md:w-3/4">
                        <InputNumber v-model="form.data.hp_ok" class="w-full" id="hp_ok" :invalid="!!form.errors.hp_ok"
                            inputId="withoutgrouping" :useGrouping="false" fluid />
                        <InputError :message="form.errors.hp_ok" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label for="third_party_type" class="text-surface-500 dark:text-white">Third Party Type</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.third_party_type" :options=thirdPartyTypeData show-clear
                            option-label="name" option-value="id" :virtualScrollerOptions="{ itemSize: 38 }"
                            placeholder="Select a Third Party Type" class="w-full"
                            :invalid="!!form.errors.third_party_type" />
                        <InputError :message="form.errors.third_party_type" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label for="site_category_id" class="text-surface-500 dark:text-white">Site Category</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.site_category_id" :options=siteCategoryData show-clear
                            option-label="name" option-value="id" :virtualScrollerOptions="{ itemSize: 38 }"
                            placeholder="Select a Site Category" class="w-full"
                            :invalid="!!form.errors.site_category_id" />
                        <InputError :message="form.errors.site_category_id" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label for="fat_id" class="text-surface-500 dark:text-white">Type FAT</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.fat_id" :options=fatData show-clear option-label="name"
                            option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a Type FAT"
                            class="w-full" :invalid="!!form.errors.fat_id" />
                        <InputError :message="form.errors.fat_id" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label for="is_active" class="text-surface-500 dark:text-white" >Status</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.is_active" :options=statusData show-clear option-label="name"
                            option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a Status"
                            class="w-full" :invalid="!!form.errors.is_active" />
                        <InputError :message="form.errors.is_active" />
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 dark:text-white">City</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.city_id" @change="onCitiesSelect(form.data.city_id)"
                            :options=filteredCities show-clear option-label="city_name" option-value="city_id" filter
                            :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a city" class="w-full"
                            :invalid="!!form.errors.city" />
                        <InputError :message="form.errors.city" />
                    </div>
                </div>

                <div class="flex justify-between items-center gap-4">
                    <label class="text-surface-500 dark:text-white">Subdistrict</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.subdistrict_id" :options=filteredSubDistrict show-clear
                            option-label="subdistrict_name" option-value="subdistrict_id" filter
                            :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a subdistrict" class="w-full"
                            :invalid="!!form.errors.subdistrict_id" />
                        <InputError :message="form.errors.subdistrict_id" />
                    </div>
                </div>

                <div class="flex justify-between items-center gap-4">
                    <label for="total_homepass" class="text-surface-500 dark:text-white">Total Homepass</label>
                    <div class="md:w-3/4">
                        <InputNumber v-model="form.data.total_homepass" class="w-full" id="total_homepass"
                            :invalid="!!form.errors.total_homepass" inputId="withoutgrouping" :useGrouping="false"
                            fluid />
                        <InputError :message="form.errors.total_homepass" />
                    </div>
                </div>

                <div class="flex justify-between items-center gap-4">
                    <label for="hp_idle" class="text-surface-500 dark:text-white">Hp Idle</label>
                    <div class="md:w-3/4">
                        <InputNumber v-model="form.data.hp_idle" class="w-full" id="hp_idle"
                            :invalid="!!form.errors.hp_idle" inputId="withoutgrouping" :useGrouping="false" fluid />
                        <InputError :message="form.errors.hp_idle" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label for="total_hp" class="text-surface-500 dark:text-white">Total Hp</label>
                    <div class="md:w-3/4">
                        <InputText v-model="form.data.total_hp" class="w-full" id="total_hp" readonly
                            :invalid="!!form.errors.total_hp" />
                        <InputError :message="form.errors.total_hp" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label for="service_id" class="text-surface-500 dark:text-white">Service</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.service_id" :options=serviceData show-clear option-label="name"
                            option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a Service"
                            class="w-full" :invalid="!!form.errors.service_id" />
                        <InputError :message="form.errors.service_id" />
                    </div>
                </div>

                <div class="flex justify-between items-center gap-4">
                    <label for="ikr_region_id" class="text-surface-500 dark:text-white">Ikr Region</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.ikr_region_id" :options=ikrRegionData show-clear option-label="name"
                            option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" filter
                            placeholder="Select a Ikr Region" class="w-full" :invalid="!!form.errors.ikr_region_id" />
                        <InputError :message="form.errors.ikr_region_id" />
                    </div>
                </div>
                <div class="flex justify-between items-center gap-4">
                    <label for="area_id" class="text-surface-500 dark:text-white">Area</label>
                    <div class="md:w-3/4">
                        <Select v-model="form.data.area_id" :options=areaDataFilter show-clear option-label="name"
                            option-value="id" :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a Area"
                            class="w-full" :invalid="!!form.errors.area_id" />
                        <InputError :message="form.errors.area_id" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>
