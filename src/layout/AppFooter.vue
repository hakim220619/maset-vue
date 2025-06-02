<script setup>
import Label from '@/components/Label.vue';
import { useLayout } from '@/layout/composables/layout';
import { Helper } from '@/service/Helper';
import { onBeforeMount, ref } from 'vue';


const appData = ref({});


onBeforeMount(async () => {
    appData.value = Helper.getAppLocalStorage();
});


const { isDarkTheme } = useLayout();
</script>

<template>
    <div class="layout-footer">
        <!-- <img :src="'/layout/images/logo/footer-' + (isDarkTheme ? 'avalon-dark' : 'avalon') + '.svg'"
            alt="avalon-footer-logo" /> -->
        <p></p>
        <div class="flex items-center gap-2 text-sm text-gray-600">
            <Label class="font-medium">{{ appData?.copyright }}</Label>
            <span class="text-gray-400">|</span>
            <Label>v{{ appData?.version }}</Label>
        </div>

    </div>
</template>
