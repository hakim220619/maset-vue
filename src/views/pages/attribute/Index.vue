<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const data = ref([
    { srNo: 1, bssCode: 'B5G1 Ubud 30 Mbps A3', name: 'B5G1 Ubud 30 Mbps A3', serviceName: 'Singgih', fromDate: '2024-07-31', toDate: '2025-02-14' },
    { srNo: 2, bssCode: 'PRD05272', name: 'B10G2 New Metrolink 50', serviceName: 'YUSTINUS ANGGA KUSWAYA', fromDate: '2024-10-23', toDate: '2025-02-13' },
    { srNo: 3, bssCode: 'PRD05273', name: 'B10G2 New Metrolink 75', serviceName: 'YUSTINUS ANGGA KUSWAYA', fromDate: '2024-10-23', toDate: '2025-02-15' },
    { srNo: 4, bssCode: 'PRD05274', name: 'B10G2 New Metrolink 100 A', serviceName: 'YUSTINUS ANGGA KUSWAYA', fromDate: '2024-10-23', toDate: '2025-02-16' },
    { srNo: 5, bssCode: 'PRD05362', name: 'B11G1 Legian 60 Mbps DSBA', serviceName: 'YUSTINUS ANGGA KUSWAYA', fromDate: '2025-01-24', toDate: '2025-02-14' },
    { srNo: 6, bssCode: 'PRD04239', name: 'B9G3 Legian 60 Mbps R SC XS', serviceName: 'YUSTINUS ANGGA KUSWAYA', fromDate: '2024-01-16', toDate: '2025-01-17' },
    { srNo: 7, bssCode: 'PRD02301', name: 'Remote Replacement for OTT', serviceName: 'YUSTINUS ANGGA KUSWAYA', fromDate: '2023-05-30', toDate: '2025-02-17' }
]);
const isRedirect = ref(false);

const add = () => {
    router.push('/pages/attribute/create');
    isRedirect.value = true;
};
</script>

<template>
    <div class="card mt-4">
        <div class="flex mt-12 justify-end">
            <Button label="ATTRIBUTE" @click="add" :loading="isRedirect" icon="pi pi-plus" raised />
        </div>

        <div class="mt-8">
            <Divider class="mt-12" />
            <div class="font-semibold text-xl mb-2">List of Data</div>
            <div class="card mt-4">
                <DataTable :value="data" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem" row-hover data-key="srNo">
                    <Column header="SR. NO" :body="(rowData, { rowIndex }) => rowIndex + 1" style="width: 10%"></Column>
                    <Column field="bssCode" header="BSS CODE" style="width: 20%"></Column>
                    <Column field="name" header="NAME" style="width: 30%"></Column>
                    <Column field="serviceName" header="SERVICE NAME" style="width: 20%"></Column>
                    <Column field="fromDate" header="FROM DATE" style="width: 10%"></Column>
                    <Column field="toDate" header="TO DATE" style="width: 10%"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
