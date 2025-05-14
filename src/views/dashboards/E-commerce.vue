<script setup>
import AppConfig from '@/layout/AppConfig.vue';
import { useLayout } from '@/layout/composables/layout';
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref, watch } from 'vue';

const { getSurface, isDarkTheme } = useLayout();

const salesTableRef = ref(null);
const menu = ref(null);
const chartData = ref(null);
const chartOptions = ref(null);

const filterSalesTable = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const items = ref([
    {
        label: 'Options',
        items: [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Search', icon: 'pi pi-fw pi-search' }
        ]
    }
]);

const products = ref(null);

onMounted(async () => {
    initChart();
    products.value = await ProductService.getProductsSmall();
});

watch([getSurface, isDarkTheme], () => {
    initChart();
});

function initChart() {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-color') || 'rgba(0, 0, 0, 0.87)';
    const surface300 = getComputedStyle(document.body).getPropertyValue('--p-surface-300');

    chartData.value = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'New',
                data: [11, 17, 30, 60, 88, 92],
                backgroundColor: 'rgba(13, 202, 240, .2)',
                borderColor: '#0dcaf0',
                pointBackgroundColor: '#0dcaf0',
                pointBorderColor: '#0dcaf0',
                pointBorderWidth: 0,
                pointStyle: 'line',
                fill: false,
                tension: 0.4
            },
            {
                label: 'Completed',
                data: [11, 19, 39, 59, 69, 71],
                backgroundColor: 'rgba(253, 126, 20, .2)',
                borderColor: '#fd7e14',
                pointBackgroundColor: '#fd7e14',
                pointBorderColor: '#fd7e14',
                pointBorderWidth: 0,
                pointStyle: 'line',
                fill: false,
                tension: 0.4
            },
            {
                label: 'Canceled',
                data: [11, 17, 21, 30, 47, 83],
                backgroundColor: 'rgba(111, 66, 193, .2)',
                borderColor: '#6f42c1',
                pointBackgroundColor: '#6f42c1',
                pointBorderColor: '#6f42c1',
                pointBorderWidth: 0,
                pointStyle: 'line',
                fill: true,
                tension: 0.4
            }
        ]
    };

    chartOptions.value = {
        plugins: {
            legend: {
                fill: true,
                labels: {
                    color: textColor
                }
            }
        },
        maintainAspectRatio: false,
        scales: {
            y: {
                max: 100,
                min: 0,
                grid: {
                    color: surface300
                },
                ticks: {
                    color: textColor
                }
            },
            x: {
                grid: {
                    display: true,
                    color: surface300
                },
                ticks: {
                    color: textColor,
                    beginAtZero: true
                }
            }
        }
    };
}

function formatCurrency(value) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function exportCSV() {
    salesTableRef.value.exportCSV();
}

function getBadgeSeverity(status) {
    const stockStatus = {
        OUTOFSTOCK: 'danger',
        LOWSTOCK: 'warn',
        INSTOCK: 'success'
    };

    return stockStatus[status];
}
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="p-4 text-white h-24 rounded-border m-0 bg-center bg-cover bg-no-repeat bg-cyan-400" style="background-image: url('/demo/images/dashboard/effect-1.svg')">
                <div class="font-bold w-full mb-2">
                    <span>Sales</span>
                </div>
                <div class="text-white text-2xl font-bold w-full flex items-center py-1">150 <i class="pi pi-arrow-up ml-2 font-bold"></i></div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="p-4 text-white h-24 rounded-border m-0 bg-center bg-cover bg-no-repeat bg-orange-400" style="background-image: url('/demo/images/dashboard/effect-2.svg')">
                <div class="font-bold w-full mb-2">
                    <span>Revenue</span>
                </div>
                <div class="text-white text-2xl font-bold w-full flex items-center py-1">532 <i class="pi pi-arrow-up ml-2 font-bold"></i></div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="p-4 text-white h-24 rounded-border m-0 bg-center bg-cover bg-no-repeat bg-purple-400" style="background-image: url('/demo/images/dashboard/effect-3.svg')">
                <div class="font-bold w-full mb-2">
                    <span>New Customers</span>
                </div>
                <div class="text-white text-2xl font-bold w-full flex items-center py-1">450 <i class="pi pi-arrow-down ml-2 font-bold"></i></div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="p-4 text-white h-24 rounded-border m-0 bg-center bg-cover bg-no-repeat bg-slate-400" style="background-image: url('/demo/images/dashboard/effect-4.svg')">
                <div class="font-bold w-full mb-2">
                    <span>Stock</span>
                </div>
                <div class="text-white text-2xl font-bold w-full flex items-center py-1">143 <i class="pi pi-arrow-down ml-2 font-bold"></i></div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6">
            <div class="card h-full">
                <h5>Weekly Overview</h5>
                <Chart type="line" :data="chartData" :options="chartOptions" :height="335" id="nasdaq - chart"></Chart>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6">
            <div class="card">
                <div class="flex items-center justify-between mb-6">
                    <h5>Quarter Goals</h5>
                    <div class="ml-auto">
                        <Button icon="pi pi-ellipsis-v" rounded text plain @click="menu.toggle($event)"></Button>
                        <Menu ref="menu" :popup="true" :model="items"></Menu>
                    </div>
                </div>
                <div class="border border-surface p-4 mb-6">
                    <span class="font-medium text-3xl text-color">85% <span class="text-muted-color">(2125/2500)</span></span>
                    <ul class="m-0 p-0 list-none mt-4 flex">
                        <li class="bg-cyan-500 h-4 flex-1 rounded-l"></li>
                        <li class="bg-orange-500 h-4 flex-1"></li>
                        <li class="bg-pink-500 h-4 flex-1"></li>
                        <li class="bg-purple-500 h-4 flex-1"></li>
                        <li class="bg-blue-500 h-4 flex-1"></li>
                        <li class="bg-gray-500 h-4 flex-1 rounded-r"></li>
                    </ul>
                </div>

                <ul class="mt-6 p-0 mx-0">
                    <li class="flex items-center py-4">
                        <span class="rounded-border bg-cyan-500 mr-4 w-4 h-4"></span>
                        <span class="text-xl font-medium text-color">T-Shirt</span>
                        <span class="text-xl font-medium text-muted-color ml-auto">89</span>
                    </li>
                    <li class="flex items-center py-4">
                        <span class="rounded-md bg-orange-500 mr-4 w-4 h-4"></span>
                        <span class="text-xl font-medium text-color">Controller</span>
                        <span class="text-xl font-medium text-muted-color ml-auto">23</span>
                    </li>
                    <li class="flex items-center py-4">
                        <span class="rounded-md bg-pink-500 mr-4 w-4 h-4"></span>
                        <span class="text-xl font-medium text-color">Phone Case</span>
                        <span class="text-xl font-medium text-muted-color ml-auto">134</span>
                    </li>
                    <li class="flex items-center py-4">
                        <span class="rounded-md bg-purple-500 mr-4 w-4 h-4"></span>
                        <span class="text-xl font-medium text-color">Purple Band</span>
                        <span class="text-xl font-medium text-muted-color ml-auto">42</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-4">
            <div class="card">
                <div class="flex items-center justify-between">
                    <div>
                        <span class="font-bold text-3xl text-color">450</span>
                        <p class="mt-2 mb-0 text-2xl text-muted-color">Reviews Received</p>
                    </div>
                    <div>
                        <img src="/demo/images/dashboard/stats-illustration-1.svg" />
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-4">
            <div class="card">
                <div class="flex items-center justify-between">
                    <div>
                        <span class="font-bold text-3xl text-color">71K</span>
                        <p class="mt-2 mb-0 text-2xl text-muted-color">Unique Visitors</p>
                    </div>
                    <div>
                        <img src="/demo/images/dashboard/stats-illustration-2.svg" />
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-4">
            <div class="card">
                <div class="flex items-center justify-between">
                    <div>
                        <span class="font-bold text-3xl text-color">757</span>
                        <p class="mt-2 mb-0 text-2xl text-muted-color">Payments Processed</p>
                    </div>
                    <div>
                        <img src="/demo/images/dashboard/stats-illustration-3.svg" />
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 xl:col-span-6">
            <div class="card p-6">
                <div class="flex items-center justify-between mb-6">
                    <h5>Product Sales</h5>
                    <Button icon="pi pi-refresh" rounded outlined></Button>
                </div>

                <div class="grid grid-cols-12 gap-4 mr-0">
                    <div class="col-span-6 md:col-span-4 lg:col-span-3 p-4">
                        <div class="text-center">
                            <div class="flex items-center justify-center mb-4 mx-auto bg-surface-0 dark:bg-surface-950 border border-surface rounded-border" style="width: 90px; height: 90px">
                                <img src="/demo/images/dashboard/headphone.png" style="width: 48px; height: 48px" />
                            </div>
                            <span class="font-medium text-color">Headphone</span>
                            <div class="text-sm text-muted-color mt-2">220 Sales</div>
                        </div>
                    </div>
                    <div class="col-span-6 md:col-span-4 lg:col-span-3 p-4">
                        <div class="text-center">
                            <div class="flex items-center justify-center mb-4 mx-auto bg-surface-0 dark:bg-surface-950 border border-surface rounded-border" style="width: 90px; height: 90px">
                                <img src="/demo/images/dashboard/laptop.png" style="width: 48px; height: 48px" />
                            </div>
                            <span class="font-medium text-color">Laptop</span>
                            <div class="text-sm text-muted-color mt-2">110 Sales</div>
                        </div>
                    </div>
                    <div class="col-span-6 md:col-span-4 lg:col-span-3 p-4">
                        <div class="text-center">
                            <div class="flex items-center justify-center mb-4 mx-auto bg-surface-0 dark:bg-surface-950 border border-surface rounded-border" style="width: 90px; height: 90px">
                                <img src="/demo/images/dashboard/phone.png" style="width: 48px; height: 48px" />
                            </div>
                            <span class="font-medium text-color">Phone</span>
                            <div class="text-sm text-muted-color mt-2">90 Sales</div>
                        </div>
                    </div>
                    <div class="col-span-6 md:col-span-4 lg:col-span-3 p-4">
                        <div class="text-center">
                            <div class="flex items-center justify-center mb-4 mx-auto bg-surface-0 dark:bg-surface-950 border border-surface rounded-border" style="width: 90px; height: 90px">
                                <img src="/demo/images/dashboard/shoes.png" style="width: 48px; height: 48px" />
                            </div>
                            <span class="font-medium text-color">Shoes</span>
                            <div class="text-sm text-muted-color mt-2">77 Sales</div>
                        </div>
                    </div>
                    <div class="col-span-6 md:col-span-4 lg:col-span-3 p-4">
                        <div class="text-center">
                            <div class="flex items-center justify-center mb-4 mx-auto bg-surface-0 dark:bg-surface-950 border border-surface rounded-border" style="width: 90px; height: 90px">
                                <img src="/demo/images/dashboard/tshirt.png" style="width: 48px; height: 48px" />
                            </div>
                            <span class="font-medium text-color">Tshirt</span>
                            <div class="text-sm text-muted-color mt-2">454 Sales</div>
                        </div>
                    </div>
                    <div class="col-span-6 md:col-span-4 lg:col-span-3 p-4">
                        <div class="text-center">
                            <div class="flex items-center justify-center mb-4 mx-auto bg-surface-0 dark:bg-surface-950 border border-surface rounded-border" style="width: 90px; height: 90px">
                                <img src="/demo/images/dashboard/vacuum.png" style="width: 48px; height: 48px" />
                            </div>
                            <span class="font-medium text-color">Vacuum</span>
                            <div class="text-sm text-muted-color mt-2">330 Sales</div>
                        </div>
                    </div>
                    <div class="col-span-6 md:col-span-4 lg:col-span-3 p-4">
                        <div class="text-center">
                            <div class="flex items-center justify-center mb-4 mx-auto bg-surface-0 dark:bg-surface-950 border border-surface rounded-border" style="width: 90px; height: 90px">
                                <img src="/demo/images/dashboard/wallet.png" style="width: 48px; height: 48px" />
                            </div>
                            <span class="font-medium text-color">Wallet</span>
                            <div class="text-sm text-muted-color mt-2">42 Sales</div>
                        </div>
                    </div>
                    <div class="col-span-6 md:col-span-4 lg:col-span-3 p-4">
                        <div class="text-center">
                            <div class="flex items-center justify-center mb-4 mx-auto bg-surface-0 dark:bg-surface-950 border border-surface rounded-border" style="width: 90px; height: 90px">
                                <img src="/demo/images/dashboard/watch.png" style="width: 48px; height: 48px" />
                            </div>
                            <span class="font-medium text-color">Watch</span>
                            <div class="text-sm text-muted-color mt-2">112 Sales</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4 md:mb-0">Recent Sales</div>
                    <div class="inline-flex items-center">
                        <IconField iconPosition="left" class="flex-auto">
                            <InputIcon class="pi pi-search" />
                            <InputText type="text" v-model="filterSalesTable.global.value" placeholder="Search" :style="{ borderRadius: '2rem' }" class="w-full" />
                        </IconField>
                        <Button icon="pi pi-upload" class="mx-4 export-target-button" rounded v-tooltip="'Export'" @click="exportCSV()"></Button>
                    </div>
                </div>
                <DataTable ref="salesTableRef" :value="products" dataKey="id" paginator :rows="5" v-model:filters="filterSalesTable">
                    <template #empty> No products found.</template>
                    <Column field="name" header="Name" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="category" header="Category" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.category }}
                        </template>
                    </Column>
                    <Column field="price" header="Price" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column field="inventoryStatus" header="Status" sortable headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <Tag :severity="getBadgeSeverity(slotProps.data.inventoryStatus)">{{ slotProps.data.inventoryStatus }}</Tag>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
    <AppConfig />
</template>
