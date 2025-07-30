<script setup>
import DropdownButton from '@/components/DropdownButton.vue';
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const swal = inject('$swal');
const router = useRouter();

const data = ref([]);
const visible = ref(false);
const isFiltering = ref(false);
const isExport = ref(false);
const isRedirect = ref(false);
const firstRowIndex = ref(0);
const rows = ref(10);
const loading = ref(true);

const filters = ref({
    global: { value: '', matchMode: 'contains' },
    judul_penilaian: { value: '', matchMode: 'contains' },
    tanggal_penilaian: { value: '', matchMode: 'contains' }
});

const search = ref({
    judul_penilaian: ''
});
const baseUrl = import.meta.env.VITE_API_URL;
async function getPembandingData() {
    isFiltering.value = true;
    const params = Helper.formatSearchParams(search.value);
    try {
        const response = await AuthApi.client().get('/pembanding/?' + new URLSearchParams(params));
        const filteredData = response.data.data;
        const sortedData = filteredData.sort((a, b) => {
            return new Date(b.tanggal_penilaian) - new Date(a.tanggal_penilaian);
        });
        data.value = sortedData;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

const items = [
    {
        label: 'Ubah',
        command: (e) => {
            router.push({ name: 'Pembanding Edit', params: { id: e.item.data.id } });
        }
    },
    {
        label: 'Hapus',
        command: (e) => {
            destroy(e.item.data.id, e.item.data.judul_penilaian);
        }
    }
];

const destroy = (id, name) => {
    swal.mixin({
        customClass: {
            confirmButton: 'p-button p-component p-button-danger !mr-2',
            cancelButton: 'p-button p-component p-button-secondary'
        },
        buttonsStyling: false
    })
        .fire({
            icon: 'warning',
            title: 'Peringatan',
            text: `Apakah anda yakin ingin menghapus data ${name}?`,
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus Data!'
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                const response = await AuthApi.client().delete('pembanding/' + id);
                console.log(response);

                if (response.data.success) {
                    swal.fire({
                        title: 'Success',
                        text: 'Data pembanding berhasil dihapus',
                        icon: 'success'
                    });
                    getPembandingData();
                }
            }
        });
};

const exportExcel = async () => {
    const params = Helper.formatSearchParams(search.value);
    await Helper.exportExcelFromApi('gateway/idp/pembanding/export', 'pembanding.xlsx', params);
};

const add = () => {
    router.push('/pages/pembanding/create');
    isRedirect.value = true;
};

onMounted(() => {
    getPembandingData();
});
</script>

<template>
    <div class="flex items-center justify-between flex-wrap">
        <p></p>
        <ButtonGroup class="w-full md:w-auto flex justify-between mt-4 md:mt-0">
            <Button label="Export" icon="pi pi-upload" @click="exportExcel" :loading="isExport"
                class="w-full md:w-auto mb-2 md:mb-0" />
            <Button label="Create" icon="pi pi-plus" @click="add" class="w-full md:w-auto mb-2 md:mb-0" />
        </ButtonGroup>
    </div>

    <div class="mt-4">
        <div class="card mt-4">
            <DataTable ref="dt" :value="data" dataKey="id" :paginator="true" v-model:first="firstRowIndex"
                v-model:rows="rows" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[10, 20, 50]" currentPageReportTemplate="{first} to {last} of {totalRecords}">
                <template #header>
                    <div class="flex justify-between">
                        <p></p>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </IconField>
                    </div>
                </template>
                <template #empty> Tidak ada data ditemukan. </template>
                <template #loading> Memuat data, mohon tunggu... </template>

                <Column field="no" header="No" style="min-width: 6rem">
                    <template #body="{ index }">
                        {{ firstRowIndex + index + 1 }}
                    </template>
                </Column>

                <Column field="jenis_property" sortable header="Jenis Properti" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.jenis_property }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" placeholder="Cari Jenis Properti" />
                    </template>
                </Column>

                <Column field="foto" header="Foto" style="min-width: 14rem">
                    <template #body="{ data }">
                        <div v-if="data.foto">
                            <template v-if="typeof data.foto === 'string'">
                                <template v-if="data.foto.startsWith('[') || data.foto.startsWith('{')">
                                    <img v-for="(foto, index) in JSON.parse(data.foto)" :key="index"
                                        :src="`${baseUrl}/${foto.path}`" alt="Foto Properti"
                                        style="max-width: 100px; max-height: 100px" />
                                </template>
                                <template v-else>
                                    <img :src="`${baseUrl}/${data.foto}`" alt="Foto Properti"
                                        style="max-width: 100px; max-height: 100px" />
                                </template>
                            </template>
                            <template v-else>
                                <img v-for="(foto, index) in data.foto" :key="index" :src="`${baseUrl}${foto.path}`"
                                    alt="Foto Properti" style="max-width: 100px; max-height: 100px" />
                            </template>
                        </div>
                        <span v-else>Tidak ada foto</span>
                    </template>
                </Column>

                <Column field="sumber_informasi" sortable header="Sumber Informasi" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.sumber_informasi }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" placeholder="Cari Sumber Informasi" />
                    </template>
                </Column>

                <Column field="kategori_sumber_informasi" sortable header="Kategori Sumber Informasi"
                    style="min-width: 14rem">
                    <template #body="{ data }">{{ data.kategori_sumber_informasi }}</template>
                </Column>

                <Column field="no_hp" sortable header="No. HP" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.no_hp }}</template>
                </Column>

                <Column field="jenis_data" sortable header="Jenis Data" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.jenis_data }}</template>
                </Column>

                <Column field="tgl_penawaran" sortable header="Tanggal Penawaran" style="min-width: 14rem">
                    <template #body="{ data }">
                        {{ data.tgl_penawaran ? new Date(data.tgl_penawaran).toLocaleDateString() : '-' }}
                    </template>
                </Column>

                <Column field="harga_penawaran" sortable header="Harga Penawaran" style="min-width: 14rem">
                    <template #body="{ data }">
                        {{
                            data.harga_penawaran
                                ? data.harga_penawaran.toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                })
                                : '-'
                        }}
                    </template>
                </Column>

                <Column field="diskon" sortable header="Diskon" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.diskon ? data.diskon : '-' }}</template>
                </Column>

                <Column field="alamat_aset" sortable header="Alamat Aset" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.alamat_aset }}</template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" placeholder="Cari Alamat Aset" />
                    </template>
                </Column>

                <Column field="koordinat" header="Koordinat" style="min-width: 14rem">
                    <template #body="{ data }">
                        {{ data.koordinat ? (typeof data.koordinat === 'string' ? data.koordinat :
                            JSON.stringify(data.koordinat)) : '-' }}
                    </template>
                </Column>

                <Column field="hak_kepemilikan" sortable header="Hak Kepemilikan" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.hak_kepemilikan }}</template>
                </Column>

                <Column field="luas_tanah" sortable header="Luas Tanah" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.luas_tanah ? data.luas_tanah + ' m²' : '-' }}</template>
                </Column>

                <Column field="luas_bangunan" sortable header="Luas Bangunan" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.luas_bangunan ? data.luas_bangunan + ' m²' : '-' }}</template>
                </Column>

                <Column field="tahun_dibangun" sortable header="Tahun Dibangun" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.tahun_dibangun ? data.tahun_dibangun : '-' }}</template>
                </Column>

                <Column field="tahun_renovasi" sortable header="Tahun Renovasi" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.tahun_renovasi ? data.tahun_renovasi : '-' }}</template>
                </Column>

                <Column field="tipe_bangunan" sortable header="Tipe Bangunan" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.tipe_bangunan }}</template>
                </Column>

                <Column field="jumlah_lantai" sortable header="Jumlah Lantai" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.jumlah_lantai ? data.jumlah_lantai : '-' }}</template>
                </Column>

                <Column field="kondisi_bangunan" sortable header="Kondisi Bangunan" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.kondisi_bangunan }}</template>
                </Column>

                <Column field="row_jalan" sortable header="ROW Jalan" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.row_jalan }}</template>
                </Column>

                <Column field="perkerasan_jalan" sortable header="Perkerasan Jalan" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.perkerasan_jalan }}</template>
                </Column>

                <Column field="posisi_aset" sortable header="Posisi Aset" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.posisi_aset }}</template>
                </Column>

                <Column field="bentuk_tanah" sortable header="Bentuk Tanah" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.bentuk_tanah }}</template>
                </Column>

                <Column field="lebar_muka" sortable header="Lebar Muka" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.lebar_muka ? data.lebar_muka + ' m' : '-' }}</template>
                </Column>

                <Column field="elevansi_terhadap_jalan" sortable header="Elevansi Terhadap Jalan"
                    style="min-width: 14rem">
                    <template #body="{ data }">{{ data.elevansi_terhadap_jalan }}</template>
                </Column>

                <Column field="topografi" sortable header="Topografi" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.topografi }}</template>
                </Column>

                <Column field="orientasi" sortable header="Orientasi" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.orientasi }}</template>
                </Column>

                <Column field="peruntukan" sortable header="Peruntukan" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.peruntukan }}</template>
                </Column>

                <Column field="jarak_thd_pusat_kota" sortable header="Jarak ke Pusat Kota" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.jarak_thd_pusat_kota ? data.jarak_thd_pusat_kota + ' km' : '-'
                    }}</template>
                </Column>

                <Column field="aksesibilitas_n_lokasi" sortable header="Aksesibilitas & Lokasi"
                    style="min-width: 14rem">
                    <template #body="{ data }">{{ data.aksesibilitas_n_lokasi }}</template>
                </Column>

                <Column field="kondisi_lingkungan" sortable header="Kondisi Lingkungan" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.kondisi_lingkungan }}</template>
                </Column>

                <Column field="syarat_pembiayaan" sortable header="Syarat Pembiayaan" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.syarat_pembiayaan }}</template>
                </Column>

                <Column field="kondisi_penjualan" sortable header="Kondisi Penjualan" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.kondisi_penjualan }}</template>
                </Column>

                <Column field="pengeluaran_stlh_pembelian" sortable header="Pengeluaran Setelah Pembelian"
                    style="min-width: 14rem">
                    <template #body="{ data }">
                        {{
                            data.pengeluaran_stlh_pembelian
                                ? data.pengeluaran_stlh_pembelian.toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                })
                                : '-'
                        }}
                    </template>
                </Column>

                <Column field="kondisi_pasar" sortable header="Kondisi Pasar" style="min-width: 14rem">
                    <template #body="{ data }">{{ data.kondisi_pasar }}</template>
                </Column>

                <Column>
                    <template #body="{ data }">
                        <div class="flex gap-1 justify-end">
                            <DropdownButton :items="items" :data="data" :menu-key="data.id" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
