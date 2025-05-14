<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const data = ref([
    { discountName: 'Discount 1st bill', discountValue: 100, discountMode: 'Percentage', recurrencePattern: 'All', applicableOn: '41100000206', startDate: '2024-08-01', noCycle: 3 },
    { discountName: 'DISCOUNT 3 MONTH 30 PERCENT', discountValue: 30, discountMode: 'Percentage', recurrencePattern: 'All', applicableOn: '41100199907', startDate: '2024-08-01', noCycle: 3 },
    { discountName: 'Discount Contributor', discountValue: 100, discountMode: 'Percentage', recurrencePattern: 'All', applicableOn: '41100231162', startDate: '2025-01-01', noCycle: 1 },
    { discountName: 'Discount Contributor', discountValue: 100, discountMode: 'Percentage', recurrencePattern: 'All', applicableOn: '41100207967', startDate: '2025-01-31', noCycle: 1 },
    { discountName: 'Discount Contributor', discountValue: 100, discountMode: 'Percentage', recurrencePattern: 'All', applicableOn: '41100227097', startDate: '2025-01-01', noCycle: 1 },
    { discountName: 'Discount Contributor', discountValue: 100, discountMode: 'Percentage', recurrencePattern: 'All', applicableOn: '41100208600', startDate: '2025-01-31', noCycle: 1 },
    { discountName: 'Discount Contributor', discountValue: 100, discountMode: 'Percentage', recurrencePattern: 'All', applicableOn: '41100224753', startDate: '2024-12-01', noCycle: 1 },
    { discountName: 'Discount Contributor', discountValue: 100, discountMode: 'Percentage', recurrencePattern: 'All', applicableOn: '41100226973', startDate: '2024-12-01', noCycle: 1 },
    { discountName: 'Discount Contributor', discountValue: 100, discountMode: 'Percentage', recurrencePattern: 'All', applicableOn: '41100224146', startDate: '2024-12-01', noCycle: 1 },
    { discountName: 'Discount Contributor', discountValue: 100, discountMode: 'Percentage', recurrencePattern: 'All', applicableOn: '41100222506', startDate: '2024-12-01', noCycle: 1 }
]);

const isRedirect = ref(false);

const add = () => {
    router.push('/pages/discountGlobal/create');
    isRedirect.value = true;
};
</script>

<template>
    <div class="card mt-4">
        <div class="flex mt-12 justify-end">
            <Button label="MANAGE DISCOUNT" @click="add" :loading="isRedirect" icon="pi pi-plus" raised />
        </div>

        <div class="mt-8">
            <Divider class="mt-12" />
            <div class="font-semibold text-xl mb-2">List of Discounts</div>
            <div class="card mt-4">
                <DataTable :value="data" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem" row-hover data-key="srNo">
                    <Column header="DISCOUNT NAME" field="discountName" style="width: 20%"></Column>
                    <Column header="DISCOUNT VALUE" field="discountValue" style="width: 15%"></Column>
                    <Column header="DISCOUNT MODE" field="discountMode" style="width: 15%"></Column>
                    <Column header="RECURRENCE PATTERN" field="recurrencePattern" style="width: 20%"></Column>
                    <Column header="APPLICABLE ON" field="applicableOn" style="width: 15%"></Column>
                    <Column header="START DATE" field="startDate" style="width: 10%"></Column>
                    <Column header="NO CYCLE" field="noCycle" style="width: 5%"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
