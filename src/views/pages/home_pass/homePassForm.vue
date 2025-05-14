<script setup>
import InputError from '@/components/InputError.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import _ from 'lodash';
import AutoComplete from 'primevue/autocomplete';
import { inject, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';
import { storeSchema } from './schema.js';

const router = useRouter();
const route = useRoute();
const swal = inject('$swal');
const citiesData = ref([]);
const districtData = ref([]);
const subDistrictData = ref([]);
const StatusData = ref([]);
const AdrressStreetValue = ref();
const provinceData = ref([]);
const selectedProvince = ref(null);
const selectedCity = ref(null);
const selectedDistrict = ref(null);
const selectedSubDistrict = ref(null);
const filteredCities = ref([]);
const filteredDistrict = ref([]);
const filteredSubDistrict = ref([]);

const filteredAddress = ref([]);

const form = ref({
    data: {
        home_code: "",
        site_code: "",
        fat_code: "",
        zip_code: "",
        sp_code: "",
        address_home_no: "",
        latitude: "",
        longitude: "",
        type_hp: "",
        coveragearea_id: "",
        address_street_id: "",
        status_id: "",
        home_id_smt: "",
        subdistrict_id: "",
        province_id: "",
        city_id: "",
        district_id: "",
    },

    errors: {
        home_code: null,
        site_code: null,
        fat_code: null,
        zip_code: null,
        sp_code: null,
        address_home_no: null,
        latitude: null,
        longitude: null,
        type_hp: null,
        coveragearea_id: null,
        address_street_id: null,
        status_id: null,
        home_id_smt: null
    },
    assign: (data = {}) => {
        for (const key in data) {
            if (_.has(form.value.data, key)) {
                let newValue = data[key];

                // Ubah nilai number ke string
                if (typeof newValue === 'number') {
                    newValue = String(newValue);
                }

                // Jika validasi tipe data sesuai, set nilai baru
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

    const url = route.params.id ? 'gateway/main_service/home_pass/' + route.params.id : 'gateway/main_service/home_pass';

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
                text: 'Home Pass saved successfully',
                icon: 'success'
            });

            router.push({ name: 'Home Pass List' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            for (const err of error.errors) {
                form.value.errors[err.path] = err.message;
            }
        } else {
            swal.fire({
                title: 'Error',
                text: 'Failed to save homePass',
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
        const userData = await Helper.getDataById('gateway/main_service/home_pass', route.params.id);
        if (userData) {
            form.value.assign(userData);
        }
    }
});

onMounted(async () => {
    const title = route.params.id ? 'Edit Home Pass' : 'Add Home Pass';

    Helper.setTitle(title);

    // get master data
    StatusData.value = await Helper.getMasterData({ endpoint: 'gateway/main_service/ms_status' });
});


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

const getAddressStreet = async (id) => {
    try {
        const response = await AuthApi.client().get('gateway/main_service/ms_address_street/' + id);
        const address = response.data.data[0];
        filteredAddress.value = [address];

        AdrressStreetValue.value = address.name.replace(/\t/g, '');
        form.value.data.address_street_id = address.id;
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


const getCoverageArea = async (id) => {
    try {
        const response = await AuthApi.client().get('gateway/main_service/coverage_area?subdistrict_id=' + id);
        if (response.data.data && response.data.data[0]) {
            form.value.data.coveragearea_id = response.data.data[0]['id'];
            console.log(form.value.data.coveragearea_id);
            console.log(response.data.data[0]);
        } else {
            form.value.data.coveragearea_id = '';
            console.log('Coverage area data is not available, setting coveragearea_id to null');
        }
    } catch (error) {
        console.log(error);
    }
};


onBeforeMount(async () => {
    getProvince();

    if (route.params.id) {
        const userData = await Helper.getDataById('gateway/main_service/home_pass', route.params.id);

        if (userData) {
            form.value.assign(userData);
            selectedProvince.value = userData.province_id;
            selectedDistrict.value = userData.district_id;
            await getCities(userData.province_id);
            await getDistricts(userData.city_id);
            await getSubDistricts(userData.district_id);
            await getAddressStreet(userData.address_street_id);

        }
    }

    // AdrressStreetData.value = await Helper.getMasterData({ endpoint: 'gateway/main_service/ms_address_street' });

});

const goBack = () => {
    router.push('/pages/home_pass');
};


const search = async (event) => {
    const query = event.query;
    if (query && query.length > 3) {
        await getAddressStreetName(query);
    } else {
        filteredAddress.value = [];
    }
};

const getAddressStreetName = async (name) => {
    try {
        const response = await AuthApi.client().get(`gateway/main_service/ms_address_street?name=${name}`);
        filteredAddress.value = response.data.data;
    } catch (error) {
        console.error(error);
    }
};

const getIdFromAddress = async (selectedAddress) => {
    if (selectedAddress && selectedAddress.id) {
        form.value.data.address_street_id = selectedAddress.id; // setting the selected ID
        AdrressStreetValue.value = selectedAddress.name.replace(/\t/g, ''); // setting the selected address name
    }
};



</script>

<template>
    <form class="card mt-8" @submit.prevent="save">
        <div class="grid md:grid-cols-2 md:gap-x-32 gap-y-4">
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
                <label class="text-surface-500 dark:text-white">District</label>
                <div class="md:w-3/4">
                    <Select v-model="form.data.district_id" @change="onDistrictSelect(form.data.district_id)"
                        :options=filteredDistrict show-clear option-label="district_name" option-value="district_id"
                        filter :virtualScrollerOptions="{ itemSize: 38 }" placeholder="Select a district" class="w-full"
                        :invalid="!!form.errors.district" />
                    <InputError :message="form.errors.district" />
                </div>
            </div>
            <div class="flex justify-between items-center gap-4">
                <label class="text-surface-500 dark:text-white">Subdistrict</label>
                <div class="md:w-3/4">
                    <Select v-model="form.data.subdistrict_id" :options=filteredSubDistrict show-clear
                        @change="getCoverageArea(form.data.subdistrict_id)" option-label="subdistrict_name"
                        option-value="subdistrict_id" filter :virtualScrollerOptions="{ itemSize: 38 }"
                        placeholder="Select a subdistrict" class="w-full" :invalid="!!form.errors.subdistrict_id" />
                    <InputError :message="form.errors.subdistrict_id" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="home_code" class="text-surface-500 dark:text-white">Home Code</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.home_code" class="w-full" id="home_code"
                        :invalid="!!form.errors.home_code" />
                    <InputError :message="form.errors.home_code" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="site_code" class="text-surface-500 dark:text-white">Site Code</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.site_code" class="w-full" id="site_code"
                        :invalid="!!form.errors.site_code" />
                    <InputError :message="form.errors.site_code" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="fat_code" class="text-surface-500 dark:text-white">Fat Code</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.fat_code" class="w-full" id="fat_code"
                        :invalid="!!form.errors.fat_code" />
                    <InputError :message="form.errors.fat_code" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="zip_code" class="text-surface-500 dark:text-white">Zip Code</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.zip_code" class="w-full" id="zip_code"
                        :invalid="!!form.errors.zip_code" />
                    <InputError :message="form.errors.zip_code" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="sp_code" class="text-surface-500 dark:text-white">Sp Code</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.sp_code" class="w-full" id="sp_code"
                        :invalid="!!form.errors.sp_code" />
                    <InputError :message="form.errors.sp_code" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="address_home_no" class="text-surface-500 dark:text-white">Address Home No</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.address_home_no" class="w-full" id="address_home_no"
                        :invalid="!!form.errors.address_home_no" />
                    <InputError :message="form.errors.address_home_no" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="latitude" class="text-surface-500 dark:text-white">Latitude</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.latitude" class="w-full" id="latitude"
                        :invalid="!!form.errors.latitude" />
                    <InputError :message="form.errors.latitude" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="longitude" class="text-surface-500 dark:text-white">Longitude</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.longitude" class="w-full" id="longitude"
                        :invalid="!!form.errors.longitude" />
                    <InputError :message="form.errors.longitude" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="type_hp" class="text-surface-500 dark:text-white">Type Hp</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.type_hp" class="w-full" id="type_hp"
                        :invalid="!!form.errors.type_hp" />
                    <InputError :message="form.errors.type_hp" />
                </div>
            </div>

            <div class="flex justify-between items-center gap-4">
                <label class="text-surface-500 dark:text-white">Address Street</label>
                <div class="md:w-3/4">
                    <AutoComplete v-model="AdrressStreetValue" forceSelection optionLabel="name" class="w-full" dropdown
                        :virtualScrollerOptions="{ itemSize: 38 }" :suggestions="filteredAddress"
                        @change="getIdFromAddress(AdrressStreetValue)" placeholder="Minimal 3 Huruf"
                        @complete="search" />
                    <InputError :message="form.errors.address_street_id" class="text-sm text-red-500 mt-1" />
                </div>
            </div>
            <div class="flex justify-between items-center gap-4">
                <label class="text-surface-500 dark:text-white">Status</label>
                <div class="md:w-3/4">
                    <Select v-model="form.data.status_id" input-id="status_id" show-clear :options="StatusData"
                        option-label="name" option-value="id" :virtualScrollerOptions="{ itemSize: 38 }"
                        placeholder="Select Status" class="w-full" :invalid="!!form.errors.status_id" />
                    <InputError :message="form.errors.status_id" class="text-sm text-red-500 mt-1" />
                </div>
            </div>
            <div class="grid md:grid-cols-4 gap-1 md:gap-4">
                <label for="home_id_smt" class="text-surface-500 dark:text-white">Home Id Smt</label>
                <div class="md:col-span-3">
                    <InputText v-model="form.data.home_id_smt" class="w-full" id="home_id_smt"
                        :invalid="!!form.errors.home_id_smt" />
                    <InputError :message="form.errors.home_id_smt" />
                </div>
            </div>
        </div>

        <div class="flex justify-end items-center gap-2 mt-4">
            <Button label="Cancel" type="button" :loading="form.loading" severity="secondary" @click="goBack" />
            <Button label="Save" type="submit" :loading="form.loading" />
        </div>
    </form>
</template>
