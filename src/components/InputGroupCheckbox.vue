<script setup>
import { Helper } from '@/service/Helper';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    },
    options: {
        type: Array,
        default: () => []
    },
    optionUrl: {
        type: String,
        default: ''
    },
    name: {
        type: String
    },
    optionValue: {
        type: String
    },
    optionLabel: {
        type: String
    }
});

const emits = defineEmits(['update:modelValue']);

const lazyLoading = ref(false);
const optionValues = ref([...props.options]);

const data = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emits('update:modelValue', newValue);
    }
});

const getKey = (item, index) => {
    return typeof item === 'object' ? (props.optionValue ? item[props.optionValue] : item.id) : index;
};

const getId = (item) => {
    return 'chk_' + getValue(item);
};

const getValue = (item) => {
    return typeof item === 'object' ? (props.optionValue ? item[props.optionValue] : item.id) : item.toLowerCase().replace(' ', '_');
};

const getLabel = (item) => {
    return typeof item === 'object' ? (props.optionLabel ? item[props.optionLabel] : item.name) : item;
};

const getOptions = async () => {
    lazyLoading.value = true;

    optionValues.value = await Helper.getMasterData({ endpoint: props.optionUrl });

    lazyLoading.value = false;

    return data;
};

onMounted(async () => {
    if (props.optionUrl) {
        await getOptions();
    }
});
</script>

<template>
    <div class="flex flex-wrap gap-x-6 gap-y-3">
        <template v-if="lazyLoading">
            <Skeleton width="7rem" height="1.25rem" v-for="i in 3" :key="i" />
        </template>

        <div v-else class="flex gap-2 items-center" v-for="(item, index) in optionValues" :key="getKey(item, index)">
            <Checkbox v-model="data" :inputId="getId(item, index)" name="category" :value="getValue(item, index)" />
            <label :for="getId(item, index)" class="cursor-pointer">{{ getLabel(item) }}</label>
        </div>
    </div>
</template>
