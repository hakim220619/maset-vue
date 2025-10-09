<script setup>
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';

const data = ref({
    pasar: [],
    object: [],
    pembanding: [],
    pembandings: [],
    tanahs: [],
    elemen_perbandingan: [],
    lokasi: [],
    karakter_fisik: [],
    summary: [],
    conclusions: {},
    final_summary: {},

});
const dataPasarAll = ref([]);
const dataHeaderAll = ref([]);

const dataEstimasiBangunan = ref([]);
const informasiUmumFields = ref([]);
const dataPropertiFields = ref([]);
const dataTransaksiFields = ref([]);
const dataUnitPerbandinganField = ref([]);
const dataElemenPerbandinganPasar = ref([])
const dataElemenPerbandinganLokasiPasar = ref([])
const dataElemenPerbandinganKarakterFisikPasar = ref([])
const dataSummaryPasar = ref([])
const dataJenisBangunan = ref([])
const pembandingOptions = ref([])


const selectedTahun = ref([])
const selectedIdJenisBangunan = ref([])
const kondisiFisikValues = ref([])
const keusanganFungsionalValues = ref([])
const keusanganEkonomisValues = ref([])


const hakAtasProperti = ref([]);
const syaratPembiayaan = ref([]);
const kondisiPenjualan = ref([]);
const pengeluaranSetelahPembelian = ref([]);
const kondisiPasar = ref([]);
const estimasi_nilai_pasar_tanah_per_m2 = ref([]);




const jarakPusatKota = ref([]);
const perkerasanJalan = ref([]);
const aksesibilitasLokasi = ref([]);
const kondisiLingkungan = ref([]);
const posisiAset = ref([]);
const lainnya = ref([]);
const perkiraanHargaTransaksiSetelahPenyesuaian = ref([]);

const route = useRoute();
async function getMasterJenisBangunan() {
    const res = await AuthApi.client().get(`/getMasterJenisBangunan`)
    dataJenisBangunan.value = res.data.data

    const grouped = {}
    dataJenisBangunan.value.forEach(item => {
        if (!grouped[item.type]) {
            grouped[item.type] = {
                label: item.type,
                code: item.type,
                items: []
            }
        }
        grouped[item.type].items.push({
            id: item.id,
            label: item.name,
            value: item.id,
            tahun: item.tahun,
            type: item.type
        })
    })

    pembandingOptions.value = Object.values(grouped)
}


const resetElemenPerbandingan = (idx, pbId) => {
    if (Array.isArray(dataElemenPerbandinganPasar.value)) {
        dataElemenPerbandinganPasar.value.forEach(item => {
            if (Array.isArray(item.pembanding)) {
                item.pembanding.forEach((pb, _idx) => {
                    if (pb.id === pbId) {
                        hakAtasProperti.value[_idx + 1] = 0
                        syaratPembiayaan.value[_idx + 1] = 0
                        kondisiPenjualan.value[_idx + 1] = 0
                        pengeluaranSetelahPembelian.value[_idx + 1] = 0
                        kondisiPasar.value[_idx + 1] = 0
                        pb[`persen_${_idx + 1}`] = 0
                        pb[`penyesuaian_${_idx + 1}`] = 0
                        pb[`hasil_${_idx + 1}`] = 0
                    }
                })
            }
        })
    }
}


const resetElemenPerbandinganLokasi = (idx, pbId) => {
    if (Array.isArray(dataElemenPerbandinganLokasiPasar.value)) {
        dataElemenPerbandinganLokasiPasar.value.forEach(item => {

            if (Array.isArray(item.pembanding)) {
                item.pembanding.forEach((pb, _idx) => {

                    if (pb.id === pbId) {
                        jarakPusatKota.value[_idx + 1] = 0;
                        perkerasanJalan.value[_idx + 1] = 0;
                        aksesibilitasLokasi.value[_idx + 1] = 0;
                        kondisiLingkungan.value[_idx + 1] = 0;
                        posisiAset.value[_idx + 1] = 0;
                        lainnya.value[_idx + 1] = 0;

                        pb[`persen_${_idx + 1}`] = 0;
                        pb[`penyesuaian_${_idx + 1}`] = 0;

                    }

                });
            }
        });
    }

    perkiraanHargaTransaksiSetelahPenyesuaian.value[idx] = 0;
};


const resetElemenPerbandinganKarakteristikFisik = (idx, pbId) => {

    // reset di state (ref)


    // reset langsung di dataElemenPerbandinganKarakterFisikPasar biar input kosong/0
    if (Array.isArray(dataElemenPerbandinganKarakterFisikPasar.value)) {
        dataElemenPerbandinganKarakterFisikPasar.value.forEach(item => {
            if (Array.isArray(item.pembanding)) {
                item.pembanding.forEach((pb, _idx) => {
                    if (pb.id === pbId) {
                        luasTanahFinal.value[_idx + 1] = 0;
                        luasBangunanFinal.value[_idx + 1] = 0;
                        bentukFinal.value[_idx + 1] = 0;
                        elevasiFinal.value[_idx + 1] = 0;
                        topografiFinal.value[_idx + 1] = 0;
                        lebarMukaFinal.value[_idx + 1] = 0;
                        peruntukanFinal.value[_idx + 1] = 0;
                        kondisiBangunanFinal.value[_idx + 1] = 0;
                        lainnyaFinal.value[_idx + 1] = 0;

                        // reset penyesuaian & hasil
                        pb[`persen_${_idx + 1}`] = 0;
                        pb[`penyesuaian_${_idx + 1}`] = 0;
                        pb[`tempPersen_${_idx + 1}`] = 0;
                    }
                });
            }
        });
    }

    // reset perkiraan harga juga
    perkiraanHargaTransaksiSetelahPenyesuaian.value[idx] = 0;
};


const onDataChangeEstimasiBangunan = async (fieldKey, selectedValue, idx, pbId) => {
    try {
        resetElemenPerbandingan(idx, pbId);
        resetElemenPerbandinganLokasi(idx, pbId)
        resetElemenPerbandinganKarakteristikFisik(idx, pbId)

        if (fieldKey === "jenis_bangunan") {
            let tahun = null;

            for (const group of pembandingOptions.value) {
                const found = group.items.find(i => i.value === selectedValue);
                if (found) {
                    tahun = found.tahun;
                    break;
                }
            }

            selectedIdJenisBangunan.value[idx] = selectedValue || null;
            selectedTahun.value[idx] = tahun || null;

            dataEstimasiBangunan.value.forEach(field => {
                if (!field.items[0]) field.items[0] = {};
                if (field.label === "Jenis Bangunan") {
                    field.items[0][`pembanding${idx + 1}`] = selectedValue;
                }
                if (field.label === "Umur Ekonomis") {
                    field.items[0][`pembanding${idx + 1}`] = tahun || "-";
                }
            });

        } else if (fieldKey === "kondisi_fisik_bangunan") {
            let value = parseFloat(selectedValue.value) || 0;
            kondisiFisikValues.value[idx] = Math.min(Math.max(value, 0), 100);

        } else if (fieldKey === "keusangan_fungsional") {
            let value = parseFloat(selectedValue.value) || 0;
            keusanganFungsionalValues.value[idx] = Math.min(Math.max(value, 0), 100);

        } else if (fieldKey === "keusangan_ekonomis") {
            let value = parseFloat(selectedValue.value) || 0;
            keusanganEkonomisValues.value[idx] = Math.min(Math.max(value, 0), 100);
        }

        const PasarId = route.params.id;
        const query = dataPasarAll.value.pembanding_id
            .map((pbId, i) => {
                let jenisBangunanId = selectedIdJenisBangunan.value[i] ?? null;
                let tahun = selectedTahun.value[i] ?? null;
                let kfisik = kondisiFisikValues.value[i] ?? null;
                let kfungsional = keusanganFungsionalValues.value[i] ?? null;
                let kekonomis = keusanganEkonomisValues.value[i] ?? null;

                jenisBangunanId = jenisBangunanId === 0 ? "data_kosong" : jenisBangunanId;
                tahun = tahun === 0 ? "data_kosong" : tahun;
                kfisik = kfisik === 0 ? "data_kosong" : kfisik;
                kfungsional = kfungsional === 0 ? "data_kosong" : kfungsional;
                kekonomis = kekonomis === 0 ? "data_kosong" : kekonomis;

                if (tahun !== null || kfisik !== null || kfungsional !== null || kekonomis !== null) {
                    return `pembanding_id=${pbId}&jenis_bangunan_id=${jenisBangunanId ?? ""}&tahun=${tahun ?? ""}&kfisik=${kfisik ?? ""}&kfungsional=${kfungsional ?? ""}&kekonomis=${kekonomis ?? ""}&list_data=${i + 1}&updateElemenPerbandingan=true`;
                }
                return null;
            })
            .filter(Boolean)
            .join("&");

        if (query) {
            const res = await AuthApi.client().get(`/getDataEstimasiBangunanPasar/${PasarId}?${query}`);

            if (res.data.success) {
                const newData = res.data.data;

                dataEstimasiBangunan.value = newData.map((newField, i) => {
                    const oldField = dataEstimasiBangunan.value[i] || { items: [{}] };

                    const mergedItems = {
                        ...oldField.items?.[0],
                        ...newField.items?.[0],
                    };

                    if (oldField.label === "Jenis Bangunan") {
                        for (const key in oldField.items?.[0]) {
                            if (key.startsWith("pembanding")) {
                                mergedItems[key] = oldField.items[0][key];
                            }
                        }
                    }

                    return {
                        ...newField,
                        items: [mergedItems]
                    };
                });
            }
        }
    } catch (err) {
        console.error("Error load data estimasi bangunan:", err);
    }
};

const onChangeElemenPerbandingan = async (fieldKey, selectedValue, idx, pbId) => {
    try {
        console.log(idx);

        resetElemenPerbandinganLokasi(idx, pbId)
        resetElemenPerbandinganKarakteristikFisik(idx, pbId)

        const clamp = (v) => Math.min(Math.max(parseFloat(v) || 0, 0), 100)

        if (fieldKey === "hak_atas_properti") {
            hakAtasProperti.value[idx] = clamp(selectedValue.value)
        } else if (fieldKey === "syarat_pembiayaan") {
            syaratPembiayaan.value[idx] = clamp(selectedValue.value)
        } else if (fieldKey === "kondisi_penjualan") {
            kondisiPenjualan.value[idx] = clamp(selectedValue.value)
        } else if (fieldKey === "pengeluaran_setelah_pembelian") {
            pengeluaranSetelahPembelian.value[idx] = clamp(selectedValue.value)
        } else if (fieldKey === "kondisi_pasar") {
            kondisiPasar.value[idx] = clamp(selectedValue.value)
        }

        const target = dataEstimasiBangunan.value.find(
            (d) => d.key === "estimasi_nilai_pasar_tanah_per_m2"
        )

        if (target?.items?.length) {
            estimasi_nilai_pasar_tanah_per_m2.value = Object.entries(target.items[0])
                .filter(([k]) => k.startsWith("pembanding"))
                .map(([_, v]) => v)
        }

        const PasarId = route.params.id
        const query = dataPasarAll.value.pembanding_id
            .map((pb, i) => {
                const idxPlus = i + 1
                let valHak = hakAtasProperti.value[idxPlus] ?? null
                let valSyarat = syaratPembiayaan.value[idxPlus] ?? null
                let valKondisi = kondisiPenjualan.value[idxPlus] ?? null
                let valPengeluaran = pengeluaranSetelahPembelian.value[idxPlus] ?? null
                let valPasar = kondisiPasar.value[idxPlus] ?? null
                let valEstimasi = estimasi_nilai_pasar_tanah_per_m2.value[idxPlus] ?? null

                const toKosong = (v) => (v === 0 ? "data_kosong" : v)
                valHak = toKosong(valHak)
                valSyarat = toKosong(valSyarat)
                valKondisi = toKosong(valKondisi)
                valPengeluaran = toKosong(valPengeluaran)
                valPasar = toKosong(valPasar)
                valEstimasi = toKosong(valEstimasi)

                if ([valHak, valSyarat, valKondisi, valPengeluaran, valPasar, valEstimasi].some(v => v !== null)) {
                    return `pembanding_id=${pb}&hak_atas_properti=${valHak ?? ""}&syarat_pembiayaan=${valSyarat ?? ""}&kondisi_penjualan=${valKondisi ?? ""}&pengeluaran_setelah_pembelian=${valPengeluaran ?? ""}&kondisi_pasar=${valPasar ?? ""}&estimasi_nilai_pasar_tanah_per_m2=${valEstimasi ?? ""}&list_data=${idxPlus}`
                }
                return null
            })
            .filter(Boolean)
            .join("&")

        if (!query) return

        const res = await AuthApi.client().get(`/getElemenPerbandinganPasar/${PasarId}?${query}`)

        if (res.data.success && Array.isArray(res.data.data)) {
            const newData = res.data.data

            dataElemenPerbandinganPasar.value = newData.map((newField) => {
                const objects = Array.isArray(newField.objects) ? newField.objects : []
                const pembanding = (newField.pembanding || []).map((pb, i) => {
                    const idxPlusOne = i + 1
                    return {
                        id: pb?.id ?? 0,
                        [`deskripsi_${idxPlusOne}`]: pb?.[`deskripsi_${idxPlusOne}`] ?? "-",
                        [`persen_${idxPlusOne}`]: pb?.[`persen_${idxPlusOne}`] ?? null,
                        [`penyesuaian_${idxPlusOne}`]: pb?.[`penyesuaian_${idxPlusOne}`] ?? null,
                        [`hasil_${idxPlusOne}`]: pb?.[`hasil_${idxPlusOne}`] ?? 0,
                    }
                })

                return { ...newField, objects, pembanding }
            })

            hitungTotalPenyesuaian()
            await updateTotalPenyesuaian(idx)
        }
    } catch (err) {
        console.error("Error load data elemen perbandingan:", err)
    }
}



const dataTotals = ref([]);
const dataPersent = ref([]);

function parseRpToFloat(rpString) {
    if (!rpString) return 0;
    const num = rpString.replace(/Rp\s?|\.|,/g, (match) => (match === ',' ? '.' : ''));
    return parseFloat(num) || 0;
}
function hitungTotalPenyesuaian() {
    const totals = [];
    const persets = [];

    const sumberData = [
        dataElemenPerbandinganKarakterFisikPasar.value || [],
        dataElemenPerbandinganLokasiPasar.value || []
    ];

    const labelExclude = ["Kondisi Bangunan"];

    sumberData.forEach(dataArray => {
        dataArray.forEach(field => {
            if (labelExclude.includes(field.label)) return;
            field.pembanding?.forEach((pb, i) => {
                totals[i] = (totals[i] || 0) + parseRpToFloat(pb.penyesuaian);
                persets[i] = (persets[i] || 0) + (pb.persen || 0);
            });
        });
    });

    dataTotals.value = totals;
    dataPersent.value = persets;
}


const onChangeElemenPerbandinganLokasi = async (fieldKey, selectedValue, idx, pbId) => {
    try {
        let value = parseFloat(selectedValue.value) || 0;
        if (value > 100) value = 100;
        if (value < 0) value = 0;

        resetElemenPerbandinganKarakteristikFisik(idx, pbId)

        if (fieldKey === "jarak_pusat_kota") {
            jarakPusatKota.value[idx] = value;
        } else if (fieldKey === "perkerasan_jalan") {
            perkerasanJalan.value[idx] = value;
        } else if (fieldKey === "aksesibilitas_lokasi") {
            aksesibilitasLokasi.value[idx] = value;
        } else if (fieldKey === "kondisi_lingkungan") {
            kondisiLingkungan.value[idx] = value;
        } else if (fieldKey === "posisi_aset") {
            posisiAset.value[idx] = value;
        } else if (fieldKey === "lainnya") {
            lainnya.value[idx] = value;
        }


        const target = dataElemenPerbandinganPasar.value.find(
            (d) => d.label === "Perkiraan Harga Transaksi setelah Penyesuaian"
        );
        // console.log(target);

        if (target && target.pembanding?.length) {
            // console.log(target);

            perkiraanHargaTransaksiSetelahPenyesuaian.value = target.pembanding.map(pb => pb.hasil);
        }


        const PasarId = route.params.id;
        const query = dataPasarAll.value.pembanding_id
            .map((pb, i) => {


                const idxPlus = i + 1;

                let valJarak = jarakPusatKota.value[idxPlus] ?? null;
                let valPerkerasan = perkerasanJalan.value[idxPlus] ?? null;
                let valAkses = aksesibilitasLokasi.value[idxPlus] ?? null;
                let valLingkungan = kondisiLingkungan.value[idxPlus] ?? null;
                let valPosisi = posisiAset.value[idxPlus] ?? null;
                let valLainnya = lainnya.value[idxPlus] ?? null;
                let valPerkiraan = perkiraanHargaTransaksiSetelahPenyesuaian.value[idxPlus] ?? null;

                // 🔹 helper ubah 0 → "data_kosong"
                const toKosong = (v) => (v === 0 ? "data_kosong" : v);

                valJarak = toKosong(valJarak);
                valPerkerasan = toKosong(valPerkerasan);
                valAkses = toKosong(valAkses);
                valLingkungan = toKosong(valLingkungan);
                valPosisi = toKosong(valPosisi);
                valLainnya = toKosong(valLainnya);
                valPerkiraan = toKosong(valPerkiraan);

                if ([valJarak, valPerkerasan, valAkses, valLingkungan, valPosisi, valLainnya, valPerkiraan].some(v => v !== null)) {
                    return `pembanding_id=${pbId}&jarak_pusat_kota=${valJarak ?? ""}&perkerasan_jalan=${valPerkerasan ?? ""}&aksesibilitas_lokasi=${valAkses ?? ""}&kondisi_lingkungan=${valLingkungan ?? ""}&posisi_aset=${valPosisi ?? ""}&lainnya=${valLainnya ?? ""}&perkiraan_harga_setelah_penyesuaian=${valPerkiraan ?? ""}&list_data=${idxPlus}&updateElemenPerbandingan=true`;
                }

                return null;
            })
            .filter(Boolean)
            .join("&");

        // console.log(query);

        if (!query) return;

        const res = await AuthApi.client().get(
            `/getElemenPerbandinganLokasiPasar/${PasarId}?${query}`
        );

        if (res.data.success) {
            const newData = res.data.data;
            dataElemenPerbandinganLokasiPasar.value = newData.map((newField) => {

                const objects = Array.isArray(newField.objects) ? newField.objects : []
                const pembanding = (newField.pembanding || []).map((pb, i) => {
                    const idxPlusOne = i + 1

                    return {
                        id: pb?.id ?? 0,
                        [`deskripsi_${idxPlusOne}`]: pb?.[`deskripsi_${idxPlusOne}`] ?? "-",
                        [`persen_${idxPlusOne}`]: pb?.[`persen_${idxPlusOne}`] ?? 0,
                        [`penyesuaian_${idxPlusOne}`]: pb?.[`penyesuaian_${idxPlusOne}`] ?? 0,
                        // [`hasil_${idxPlusOne}`]: pb?.[`hasil_${idxPlusOne}`] ?? 0,
                    }
                })

                return { ...newField, objects, pembanding }
            });
            hitungTotalPenyesuaian()
            await updateTotalPenyesuaian(idx)
        }
    } catch (err) {
        console.error("Error load data estimasi bangunan:", err);
    }
};

const luasTanahFinal = ref([]);
const luasBangunanFinal = ref([]);
const bentukFinal = ref([]);
const elevasiFinal = ref([]);
const topografiFinal = ref([]);
const lebarMukaFinal = ref([]);
const peruntukanFinal = ref([]);
const kondisiBangunanFinal = ref([]);
const lainnyaFinal = ref([]);

const fieldMap = {
    luas_tanah: luasTanahFinal,
    luas_bangunan: luasBangunanFinal,
    bentuk: bentukFinal,
    elevasi: elevasiFinal,
    topografi: topografiFinal,
    lebar_muka: lebarMukaFinal,
    peruntukan: peruntukanFinal,
    kondisi_bangunan: kondisiBangunanFinal,
    lainnya: lainnyaFinal,
};



const onChangeElemenPerbandinganKarakteristikFisik = async (fieldKey, selectedValue, idx, pbId) => {
    try {
        let value = parseFloat(selectedValue.value) || 0;

        if (value > 100) value = 100;
        if (value < 0) value = 0;

        if (fieldKey === "luas_tanah") {
            luasTanahFinal.value[idx] = value;
        } else if (fieldKey === "luas_bangunan") {
            luasBangunanFinal.value[idx] = value;
        } else if (fieldKey === "bentuk") {
            bentukFinal.value[idx] = value;
        } else if (fieldKey === "elevasi") {
            elevasiFinal.value[idx] = value;
        } else if (fieldKey === "topografi") {
            topografiFinal.value[idx] = value;
        } else if (fieldKey === "lebar_muka") {
            lebarMukaFinal.value[idx] = value;
        } else if (fieldKey === "peruntukan") {
            peruntukanFinal.value[idx] = value;
        } else if (fieldKey === "kondisi_bangunan") {
            kondisiBangunanFinal.value[idx] = value;
        } else if (fieldKey === "lainnya") {
            lainnyaFinal.value[idx] = value;
        } else if (fieldKey === "perkiraan_harga_transaksi_setelah_penyesuaian") {
            perkiraanHargaTransaksiSetelahPenyesuaian.value[idx] = value;
        }
        console.log(luasTanahFinal.value[idx]);

        const target = dataElemenPerbandinganPasar.value.find(
            d => d.label === "Perkiraan Harga Transaksi setelah Penyesuaian"
        );
        if (target?.pembanding?.length) {
            perkiraanHargaTransaksiSetelahPenyesuaian.value = target.pembanding.map(pb => pb.hasil);
        }

        const PasarId = route.params.id;
        const toKosong = (v) => (v === null ? "data_kosong" : v);

        const query = dataPasarAll.value.pembanding_id
            .map((pb, i) => {

                if (!pb) return null;

                const idxPlus = i + 1;

                let valLuasTanah = toKosong(luasTanahFinal.value[idxPlus] ?? 0);
                let valLuasBangunan = toKosong(luasBangunanFinal.value[idxPlus] ?? 0);
                let valBentuk = toKosong(bentukFinal.value[idxPlus] ?? 0);
                let valElevasi = toKosong(elevasiFinal.value[idxPlus] ?? 0);
                let valTopografi = toKosong(topografiFinal.value[idxPlus] ?? 0);
                let valLebarMuka = toKosong(lebarMukaFinal.value[idxPlus] ?? 0);
                let valPeruntukan = toKosong(peruntukanFinal.value[idxPlus] ?? 0);
                let valKondisiBangunan = toKosong(kondisiBangunanFinal.value[idxPlus] ?? 0);
                let valLainnya = toKosong(lainnyaFinal.value[idxPlus] ?? 0);
                let valPerkiraan = toKosong(perkiraanHargaTransaksiSetelahPenyesuaian.value[idxPlus] ?? 0);


                if (
                    [
                        valLuasTanah,
                        valLuasBangunan,
                        valBentuk,
                        valElevasi,
                        valTopografi,
                        valLebarMuka,
                        valPeruntukan,
                        valKondisiBangunan,
                        valLainnya,
                        valPerkiraan,
                    ].some((v) => v !== null)
                ) {
                    return (
                        `pembanding_id=${pb}` +
                        `&luas_tanah=${valLuasTanah}` +
                        `&luas_bangunan=${valLuasBangunan}` +
                        `&bentuk=${valBentuk}` +
                        `&elevasi=${valElevasi}` +
                        `&topografi=${valTopografi}` +
                        `&lebar_muka=${valLebarMuka}` +
                        `&peruntukan=${valPeruntukan}` +
                        `&kondisi_bangunan=${valKondisiBangunan}` +
                        `&lainnya=${valLainnya}` +
                        `&perkiraan_harga_setelah_penyesuaian=${valPerkiraan}` +
                        `&list_data=${idxPlus}`
                    );
                }

                return null;
            })
            .filter(Boolean)
            .join("&");


        console.log(query);

        if (!query) return;

        const res = await AuthApi.client().get(
            `/getElemenPerbandinganKarakterFisikPasar/${PasarId}?${query}`
        );

        if (!res.data.success) return;

        const newData = res.data.data;

        dataElemenPerbandinganKarakterFisikPasar.value = newData.map(newField => {
            const objects = Array.isArray(newField.objects) ? newField.objects : []

            const pembanding = (newField.pembanding || []).map((pb, i) => {
                const idxPlusOne = i + 1
                // console.log(pb);

                return {
                    id: pb?.id ?? 0,
                    [`deskripsi_${idxPlusOne}`]: pb?.[`deskripsi_${idxPlusOne}`] ?? "-",
                    [`tempPersen_${idxPlusOne}`]: pb?.[`tempPersen_${idxPlusOne}`] ?? 0,
                    [`persen_${idxPlusOne}`]: pb?.[`persen_${idxPlusOne}`] ?? 0,
                    [`penyesuaian_${idxPlusOne}`]: pb?.[`penyesuaian_${idxPlusOne}`] ?? 0,
                    // [`hasil_${idxPlusOne}`]: pb?.[`hasil_${idxPlusOne}`] ?? 0,
                }
            })

            return { ...newField, objects, pembanding }
        });


        // Hitung total setelah update
        hitungTotalPenyesuaian();

        // Update backend
        await updateTotalPenyesuaian(idx);

    } catch (err) {
        console.error("Error load data karakteristik fisik:", err);
    }
};

const updateTotalPenyesuaian = async () => {
    try {
        const PasarId = route.params.id;


        const res = await AuthApi.client().get(`/getSummaryPasar/${PasarId}`);
        if (!res.data.success) return;

        dataSummaryPasar.value = res.data.data;

    } catch (err) {
        console.error("Error update total penyesuaian:", err);
    }
};
const getHeaderAll = async (idx) => {
    try {
        const PasarId = route.params.id;


        const res = await AuthApi.client().get(`/headerPasar/${PasarId}`);
        if (!res.data.success) return;

        dataHeaderAll.value = res.data.data;

    } catch (err) {
        console.error("Error update total penyesuaian:", err);
    }
};

var totalObject = ref(0);
var totalPembanding = ref(0);


onBeforeMount(async () => {

    if (route.params.id) {
        await getMasterJenisBangunan();
        await getHeaderAll()
        // await loadPasarDetail(route.params.id);

        if (data.value.pembandings && data.value.pembandings.length > 0) {
            selectedTahun.value = Array(data.value.pembandings.length).fill(null);
        }
        const dataHeader = await Helper.getDataById('headerPasar', route.params.id);
        const dataPasar = await Helper.getDataById('pasar', route.params.id);
        const dataUnitPerbandingan = await Helper.getDataById('getDataUnitPerbandinganPasar', route.params.id);
        const dataTransaksi = await Helper.getDataById('getDataTransaksiPasar', route.params.id);
        const dataInformasiUmum = await Helper.getDataById('getInformasiUmumPasar', route.params.id);
        const dataProperti = await Helper.getDataById('getDataPropertiPasar', route.params.id);
        const dataElemenPerbandingan = await Helper.getDataById('getElemenPerbandinganPasar', route.params.id);
        const dataElemenPerbandinganLokasi = await Helper.getDataById('getElemenPerbandinganLokasiPasar', route.params.id);
        const dataElemenPerbandinganKarakterFisik = await Helper.getDataById('getElemenPerbandinganKarakterFisikPasar', route.params.id);

        const dataSummary = await Helper.getDataById('getSummaryPasar', route.params.id);
        const EstimasiBangunan = await Helper.getDataById(
            'getDataEstimasiBangunanPasar',
            route.params.id,
            selectedTahun.value ? { tahun_id: selectedTahun.value } : {}
        );

        totalObject = 1;
        totalPembanding = dataPasar.pembanding_id.length;
        dataPasarAll.value = dataPasar
        dataHeaderAll.value = dataHeader

        informasiUmumFields.value = dataInformasiUmum;
        dataTransaksiFields.value = dataTransaksi;
        dataPropertiFields.value = dataProperti;
        dataUnitPerbandinganField.value = dataUnitPerbandingan;
        dataElemenPerbandinganPasar.value = dataElemenPerbandingan;
        dataElemenPerbandinganLokasiPasar.value = dataElemenPerbandinganLokasi;
        dataElemenPerbandinganKarakterFisikPasar.value = dataElemenPerbandinganKarakterFisik;
        dataSummaryPasar.value = dataSummary;

        dataEstimasiBangunan.value = EstimasiBangunan;

        dataEstimasiBangunan.value.forEach(field => {
            if (field.key === "estimasi_nilai_pasar_tanah_per_m2") {

                estimasi_nilai_pasar_tanah_per_m2.value = Object.entries(field.items[0] || {})
                    .filter(([k]) => k.startsWith("pembanding"))
                    .map(([_, v]) => v);
            }
        });

        dataElemenPerbandinganPasar.value = dataElemenPerbandinganPasar.value.map((field) => {

            if (!Array.isArray(field.objects) || field.objects.length === 0) {
                field.objects = [{ keterangan: "", deskripsi: "" }];
            }

            const totalPb = totalPembanding;
            field.pembanding = Array.from({ length: totalPb }, (_, _idx) => {
                const existing = field.pembanding?.[_idx] || {};

                return {
                    id: existing?.id ?? null,
                    [`deskripsi_${_idx + 1}`]: existing?.[`deskripsi_${_idx + 1}`] ?? "",
                    [`persen_${_idx + 1}`]: existing?.[`persen_${_idx + 1}`] ?? null,
                    [`penyesuaian_${_idx + 1}`]: existing?.[`penyesuaian_${_idx + 1}`] ?? null,
                    [`hasil_${_idx + 1}`]: existing?.[`hasil_${_idx + 1}`] ?? 0,
                };

            });

            return field;
        });

        dataElemenPerbandinganLokasiPasar.value = dataElemenPerbandinganLokasiPasar.value.map((field) => {

            if (!Array.isArray(field.objects) || field.objects.length === 0) {
                field.objects = [{ keterangan: "", deskripsi: "" }];
            }

            const totalPb = totalPembanding;
            field.pembanding = Array.from({ length: totalPb }, (_, idx) => {
                const existing = field.pembanding?.[idx] || {};


                return {
                    id: existing?.id ?? null,
                    [`deskripsi_${idx + 1}`]: existing?.[`deskripsi_${idx + 1}`] ?? "",
                    [`persen_${idx + 1}`]: existing?.[`persen_${idx + 1}`] ?? null,
                    [`penyesuaian_${idx + 1}`]: existing?.[`penyesuaian_${idx + 1}`] ?? null,
                    [`hasil_${idx + 1}`]: existing?.[`hasil_${idx + 1}`] ?? 0,
                };

            });

            return field;
        });
        dataElemenPerbandinganKarakterFisikPasar.value = dataElemenPerbandinganKarakterFisikPasar.value.map((field) => {
            if (!Array.isArray(field.objects) || field.objects.length === 0) {
                field.objects = [{ keterangan: "", deskripsi: "" }];
            }

            const totalPb = totalPembanding;
            field.pembanding = Array.from({ length: totalPb }, (_, idx) => {
                const existing = field.pembanding?.[idx] || {};

                return {
                    id: existing?.id ?? 0,
                    [`deskripsi_${idx + 1}`]: existing?.[`deskripsi_${idx + 1}`] ?? "",
                    [`persen_${idx + 1}`]: existing?.[`persen_${idx + 1}`] ?? 0,
                    [`penyesuaian_${idx + 1}`]: existing?.[`penyesuaian_${idx + 1}`] ?? 0,
                    [`hasil_${idx + 1}`]: existing?.[`hasil_${idx + 1}`] ?? 0,
                };
            });

            return field;
        });


    }
});

</script>
<template>
    <div class="max-w-3xl ml-0 space-y-6">
        <!-- Card 1 -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 space-y-4 w-96">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">Jenis Penilaian</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300">Nilai Pasar</p>

            <div class="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
                <!-- ID Data Aset -->
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Nomor ID Data Aset:</span>
                    {{ dataHeaderAll?.object?.id }}
                </p>

                <!-- Loop ID Data Pembanding -->
                <p v-for="(item, index) in dataHeaderAll?.pembanding" :key="item.id"
                    class="text-sm text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Nomor ID Data Pembanding {{ index + 1 }}:</span>
                    {{ item.id }}
                </p>
            </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 space-y-5">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Judul Penilaian</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">
                Penilaian Nilai Pasar Tempat Usaha
            </p>

            <div class="border-t border-gray-200 dark:border-gray-600 pt-5 space-y-3">
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Nama Entitas:</span> {{ dataHeaderAll?.object?.nama_entitas }}
                </p>
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Tanggal Inspeksi:</span>
                    {{ new Date(dataHeaderAll?.object?.tanggal_inspeksi).toLocaleDateString('id-ID') }}
                </p>

                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Tanggal Penilaian:</span>
                    {{ new Date(dataHeaderAll?.object?.tanggal_penilaian).toLocaleDateString('id-ID') }}
                </p>

                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Penilai / Surveyor:</span> {{ dataHeaderAll?.object?.penilai_surveyor }}
                </p>
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Tahun Penilaian:</span>{{ new
                        Date(dataHeaderAll?.object?.created_at).getFullYear() }}
                </p>
            </div>
        </div>

    </div>
    <br><br>
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <div class="overflow-auto">

            <table class="min-w-full border border-gray-300 text-sm dark:border-gray-600">
                <tbody>
                    <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                        <!-- Judul utama -->
                        <td class="p-2 border dark:border-gray-600 dark:text-white">
                            INFORMASI UMUM
                        </td>

                        <!-- Header Object dinamis -->
                        <template v-for="(obj, idx) in totalObject" :key="'obj-head-' + idx">
                            <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                                OBJECT {{ idx + 1 }}
                            </td>
                        </template>

                        <!-- Header Pembanding dinamis -->
                        <template v-for="(pb, idx) in totalPembanding" :key="'pb-head-' + idx">
                            <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                                PEMBANDING {{ idx + 1 }}
                            </td>
                        </template>
                    </tr>



                    <!-- Isi dinamis -->
                    <tr v-for="field in informasiUmumFields" :key="'inf-' + field.key">
                        <!-- Label kolom -->
                        <td class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ field.label }}
                        </td>

                        <!-- Data Object -->
                        <template v-for="(item, idx) in field.items" :key="'obj-' + field.key + '-' + idx">
                            <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ item.object || '-' }}
                            </td>
                        </template>

                        <!-- Data Pembanding -->
                        <template
                            v-for="(key, idx) in Object.keys(field.items?.[0] || {}).filter(k => k.startsWith('pembanding'))"
                            :key="'info-pb-' + field.key + '-' + idx">
                            <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ field.items[0][key] || '-' }}
                            </td>
                        </template>
                    </tr>



                    <!-- DATA PROPERTI -->
                    <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                        <td class="p-2 border dark:border-gray-600 dark:text-white"
                            :colspan="5 + (totalObject * 2) + (totalPembanding * 3)">
                            DATA TRANSAKSI
                        </td>
                    </tr>

                    <tr v-for="field in dataTransaksiFields" :key="'prop-' + field.key">
                        <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                        <template v-for="(item, idx) in field.items" :key="'obj-' + idx">
                            <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ item.object || '-' }}
                            </td>
                        </template>


                        <!-- Kolom Pembanding Dinamis -->
                        <template
                            v-for="(key, idx) in Object.keys(field.items?.[0] || {}).filter(k => k.startsWith('pembanding'))"
                            :key="'info-pb-' + field.key + '-' + idx">
                            <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ field.items[0][key] || '-' }}
                            </td>
                        </template>
                    </tr>
                    <!-- DATA PROPERTI -->
                    <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                        <td class="p-2 border dark:border-gray-600 dark:text-white"
                            :colspan="5 + (totalObject * 2) + (totalPembanding * 3)">
                            DATA PROPERTI
                        </td>
                    </tr>
                    <tr v-for="field in dataPropertiFields" :key="'prop-' + field.key">
                        <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                        <template v-for="(item, idx) in field.items" :key="'obj-' + field.key">
                            <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ item.object || '-' }}
                            </td>
                        </template>

                        <!-- Kolom Pembanding Dinamis -->
                        <template
                            v-for="(key, idx) in Object.keys(field.items?.[0] || {}).filter(k => k.startsWith('pembanding'))"
                            :key="'info-pb-'">
                            <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ field.items[0][key] || '-' }}
                            </td>
                        </template>

                    </tr>
                    <!-- UNIT PERBANDINGAN -->
                    <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                        <td class="p-2 border dark:border-gray-600 dark:text-white"
                            :colspan="5 + (totalObject * 2) + (totalPembanding * 3)">
                            UNIT PERBANDINGAN
                        </td>
                    </tr>
                    <tr v-for="(field, index) in dataUnitPerbandinganField" :key="'unit-field-' + index">
                        <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                        <template v-for="(item, idx) in field.items" :key="'obj-' + index + '-' + idx">
                            <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ item.object || '-' }}
                            </td>
                        </template>

                        <!-- Kolom Pembanding Dinamis -->
                        <template
                            v-for="(key, idx) in Object.keys(field.items?.[0] || {}).filter(k => k.startsWith('pembanding'))"
                            :key="'info-pb-' + field.key + '-' + idx">
                            <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ field.items[0][key] || '-' }}
                            </td>
                        </template>
                    </tr>


                    <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                        <td class="p-2 border dark:border-gray-600 dark:text-white"
                            :colspan="5 + (totalObject * 2) + (totalPembanding * 3)">
                            ESTIMASI BANGUNAN
                        </td>
                    </tr>
                    <tr v-for="(field, index) in dataEstimasiBangunan" :key="'unit-field-' + index">
                        <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                        <template v-for="(item, idx) in field.items" :key="'obj-' + index + '-' + idx">
                            <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ item.object || '-' }}
                            </td>
                        </template>



                        <!-- Loop pembanding -->
                        <template
                            v-for="(pb, idx) in Object.keys(field.items?.[0] || {}).filter(k => k.startsWith('pembanding'))">

                            <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">

                                <!-- Jenis Bangunan -->
                                <template v-if="field.label === 'Jenis Bangunan'">
                                    <Select :model-value="field.items[0]['pembanding' + (idx + 1)]"
                                        :options="pembandingOptions" optionGroupLabel="label"
                                        optionGroupChildren="items" optionLabel="label" optionValue="value"
                                        placeholder="Pilih Jenis Bangunan" class="w-full"
                                        @change="e => onDataChangeEstimasiBangunan('jenis_bangunan', e.value, idx, field.items[0]['data_id_' + (idx + 1)])" />
                                </template>

                                <!-- Umur Ekonomis -->
                                <template v-else-if="field.label === 'Umur Ekonomis'">
                                    {{ field.items[0]?.['pembanding' + (idx + 1)] || '-' }}
                                </template>

                                <!-- Kondisi Fisik Bangunan (Visual) -->
                                <template v-else-if="field.label === 'Kondisi Fisik Bangunan (Visual)'">
                                    <InputNumber v-model="field.items[0]['pembanding' + (idx + 1)]" class="w-full"
                                        input-style="border: 2px solid;" :min="0" :max="100" :useGrouping="false"
                                        placeholder="Isi angka (%)"
                                        @input="val => onDataChangeEstimasiBangunan('kondisi_fisik_bangunan', val, idx, field.items[0]['data_id_' + (idx + 1)])" />
                                </template>



                                <!-- Keusangan Fungsional -->
                                <template v-else-if="field.label === 'Keusangan Fungsional'">
                                    <InputNumber v-model="field.items[0]['pembanding' + (idx + 1)]" class="w-full"
                                        input-style="border: 2px solid;" :min="0" :max="100" :useGrouping="false"
                                        placeholder="Isi angka (%)"
                                        @input="val => onDataChangeEstimasiBangunan('keusangan_fungsional', val, idx, field.items[0]['data_id_' + (idx + 1)])" />
                                </template>

                                <!-- Keusangan Ekonomis -->
                                <template v-else-if="field.label === 'Keusangan Ekonomis'">
                                    <InputNumber v-model="field.items[0]['pembanding' + (idx + 1)]" class="w-full"
                                        input-style="border: 2px solid;" :min="0" :max="100" :useGrouping="false"
                                        placeholder="Isi angka (%)"
                                        @input="val => onDataChangeEstimasiBangunan('keusangan_ekonomis', val, idx, field.items[0]['data_id_' + (idx + 1)])" />
                                </template>

                                <!-- Default fallback -->
                                <template v-else>
                                    {{ field.items[0]?.['pembanding' + (idx + 1)] || '-' }}
                                </template>
                            </td>
                        </template>




                    </tr>



                    <!-- Table Header -->

                    <!-- Header Elemen Perbandingan -->
                    <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                        <td class="p-2 border dark:border-gray-600 dark:text-white" :colspan="1">
                            ELEMEN PERBANDINGAN
                        </td>

                        <!-- Object headers (2 kolom per object) -->
                        <template v-for="(_, objIdx) in (dataElemenPerbandinganPasar[0]?.objects || [])"
                            :key="'obj-head-' + objIdx">
                            <th class="p-2 border dark:border-gray-600 dark:text-white">Keterangan</th>
                            <th class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">Deskripsi</th>
                        </template>

                        <!-- Pembanding headers (3 kolom per pembanding) -->
                        <template v-for="(_, pbIdx) in (dataElemenPerbandinganPasar[0]?.pembanding || [])"
                            :key="'pb-head-elemen-perbandingan' + pbIdx">
                            <th class="p-2 border dark:border-gray-600 dark:text-white">Deskripsi</th>
                            <th class="p-2 border dark:border-gray-600 dark:text-white">(%)</th>
                            <th class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">+/- Penyesuaian (Rp)
                            </th>
                        </template>
                    </tr>



                    <template v-for="item in dataElemenPerbandinganPasar" :key="item.label">
                        <!-- Baris utama -->
                        <tr>
                            <!-- Label -->
                            <td class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ item.label }}
                            </td>

                            <!-- Objects -->
                            <template v-for="(obj, objIdx) in item.objects" :key="'obj-' + objIdx">
                                <td class="p-2 border dark:border-gray-600 dark:text-white">
                                    {{ obj.keterangan }}
                                </td>
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ obj.deskripsi }}
                                </td>
                            </template>

                            <!-- Pembanding -->
                            <template v-for="(pb, pbIdx) in item.pembanding" :key="'pb-elemen-perbandingan-' + pbIdx">
                                <!-- Kiri -->
                                <td class="p-2 border dark:border-gray-600 dark:text-white">
                                    {{ pb[`deskripsi_${pbIdx + 1}`] || '-' }}
                                </td>

                                <!-- Hak Atas Properti -->
                                <template v-if="item.label === 'Hak Atas Properti yang dialihkan'">
                                    <td class="p-2 border dark:border-gray-600">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandingan('hak_atas_properti', val, pbIdx + 1, pb.id)" />
                                    </td>
                                </template>

                                <!-- Kondisi Lingkungan -->
                                <template v-else-if="item.label === 'Syarat Pembiayaan'">
                                    <td class="p-2 border dark:border-gray-600">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandingan('syarat_pembiayaan', val, pbIdx + 1, pb.id)" />
                                    </td>
                                </template>

                                <!-- Jarak Pusat Kota -->
                                <template v-else-if="item.label === 'Kondisi Penjualan'">
                                    <td class="p-2 border dark:border-gray-600">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandingan('kondisi_penjualan', val, pbIdx + 1, pb.id)" />
                                    </td>
                                </template>

                                <!-- Keusangan Fungsional -->
                                <template
                                    v-else-if="item.label === 'Pengeluaran yang dilakukan segera setelah pembelian'">
                                    <td class="p-2 border dark:border-gray-600">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandingan('pengeluaran_setelah_pembelian', val, pbIdx + 1, pb.id)" />
                                    </td>
                                </template>

                                <template v-else-if="item.label === 'Kondisi Pasar'">
                                    <td class="p-2 border dark:border-gray-600">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandingan('kondisi_pasar', val, pbIdx + 1, pb.id)" />
                                    </td>
                                </template>

                                <template v-else>
                                    <td class="p-2 border dark:border-gray-600">

                                    </td>
                                </template>

                                <!-- Default kalau ada field lain -->

                                <!-- Kanan -->
                                <td v-if="item.label !== 'Perkiraan Harga Transaksi setelah Penyesuaian'"
                                    class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ pb[`penyesuaian_${pbIdx + 1}`] || 'Rp 0' }}
                                </td>
                                <td v-else class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ pb[`hasil_${pbIdx + 1}`] || 'Rp 0' }}
                                </td>

                            </template>



                        </tr>

                        <!-- Baris tambahan dengan sekat lurus -->
                        <tr>
                            <!-- Label kosong -->
                            <template v-if="item.label !== 'Perkiraan Harga Transaksi setelah Penyesuaian'">
                                <td class="p-2 border dark:border-gray-600 dark:text-white">&nbsp;</td>
                            </template>
                            <!-- Objects kosong -->
                            <template v-for="(obj, objIdx) in item.objects" :key="'obj-empty-' + objIdx">
                                <template v-if="item.label !== 'Perkiraan Harga Transaksi setelah Penyesuaian'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white">&nbsp;</td>
                                    <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">&nbsp;</td>
                                </template>
                            </template>
                            <!-- Pembanding kosong -->
                            <template v-for="(pb, pbIdx) in item.pembanding" :key="'pb-empty-' + pbIdx">
                                <template v-if="item.label !== 'Perkiraan Harga Transaksi setelah Penyesuaian'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white">&nbsp;</td>
                                    <td class="p-2 border dark:border-gray-600">&nbsp;</td>
                                    <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                        {{ pb[`hasil_${pbIdx + 1}`] || 'Rp 0' }}
                                    </td>
                                </template>

                            </template>


                        </tr>
                    </template>



                    <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                        <td class="p-2 border dark:border-gray-600 dark:text-white"
                            :colspan="11 + (totalObject * 1) + (totalPembanding * 3)">
                            LOKASI
                        </td>
                        <!-- Dynamic Object Headers (2 columns each) -->

                    </tr>
                    <template v-for="item in dataElemenPerbandinganLokasiPasar" :key="item.label">
                        <!-- Baris utama -->
                        <tr>
                            <!-- Label -->
                            <td class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ item.label }}
                            </td>

                            <!-- Objects -->
                            <template v-for="(obj, objIdx) in item.objects" :key="'obj-' + objIdx">
                                <td class="p-2 border dark:border-gray-600 dark:text-white">
                                    {{ obj.keterangan }}
                                </td>
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ obj.deskripsi }}
                                </td>
                            </template>

                            <!-- Pembanding -->
                            <template v-for="(pb, pbIdx) in item.pembanding" :key="'pb-' + pbIdx">
                                <!-- Kiri -->
                                <td class="p-2 border dark:border-gray-600 dark:text-white">
                                    {{ pb[`deskripsi_${pbIdx + 1}`] || '-' }}
                                </td>

                                <!-- Input angka sesuai label -->
                                <td class="p-2 border dark:border-gray-600">
                                    <!-- Jarak terhadap pusat kota -->
                                    <template v-if="item.label === 'Jarak terhadap pusat kota'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganLokasi('jarak_pusat_kota', val, pbIdx + 1, pb.id)" />
                                    </template>

                                    <!-- Perkerasan Jalan/Lebar Jalan -->
                                    <template v-else-if="item.label === 'Perkerasan Jalan/Lebar Jalan'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganLokasi('perkerasan_jalan', val, pbIdx + 1, pb.id)" />
                                    </template>

                                    <!-- Aksesibilitas & Lokasi -->
                                    <template v-else-if="item.label === 'Aksesibilitas & Lokasi'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganLokasi('aksesibilitas_lokasi', val, pbIdx + 1, pb.id)" />
                                    </template>

                                    <!-- Kondisi Lingkungan -->
                                    <template v-else-if="item.label === 'Kondisi Lingkungan'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganLokasi('kondisi_lingkungan', val, pbIdx + 1, pb.id)" />
                                    </template>

                                    <!-- Posisi Aset -->
                                    <template v-else-if="item.label === 'Posisi Aset'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganLokasi('posisi_aset', val, pbIdx + 1, pb.id)" />
                                    </template>

                                    <!-- Lainnya (Sebutkan) -->
                                    <template v-else-if="item.label === 'Lainnya (Sebutkan)'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganLokasi('lainnya', val, pbIdx + 1, pb.id)" />
                                    </template>
                                </td>


                                <!-- Kanan -->
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ pb[`penyesuaian_${pbIdx + 1}`] }}
                                </td>
                            </template>



                        </tr>

                        <!-- Baris tambahan dengan sekat lurus -->

                    </template>
                    <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                        <td class="p-2 border dark:border-gray-600 dark:text-white"
                            :colspan="11 + (totalObject * 1) + (totalPembanding * 3)">
                            KARAKTER FISIK
                        </td>
                        <!-- Dynamic Object Headers (2 columns each) -->

                    </tr>
                    <template v-for="item in dataElemenPerbandinganKarakterFisikPasar" :key="item.label">
                        <!-- Baris utama -->

                        <tr>
                            <!-- Label -->
                            <td class="p-2 border dark:border-gray-600 dark:text-white">
                                {{ item.label }}
                            </td>

                            <!-- Objects -->
                            <template v-for="(obj, objIdx) in item.objects" :key="'obj-' + objIdx">
                                <td class="p-2 border dark:border-gray-600 dark:text-white">
                                    {{ obj.keterangan }}
                                </td>
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ obj.deskripsi }}
                                </td>
                            </template>

                            <!-- Pembanding -->
                            <template v-for="(pb, pbIdx) in item.pembanding" :key="'pb-' + pbIdx">
                                <!-- Kiri -->
                                <td class="p-2 border dark:border-gray-600 dark:text-white">
                                    {{ pb[`deskripsi_${pbIdx + 1}`] || '-' }}
                                </td>
                                <!-- Input angka sesuai label -->
                                <td class="p-2 border dark:border-gray-600">
                                    <!-- Luas Tanah -->
                                    <template v-if="item.label === 'Luas Tanah'">
                                        <div class="flex items-center w-full">
                                            <!-- Kolom kiri (50%) -->
                                            <div class="w-1/2 text-center">
                                                <p class="text-sm dark:text-white">
                                                    {{ pb[`tempPersen_${pbIdx + 1}`] ?? '-' }}
                                                </p>
                                            </div>

                                            <!-- Kolom kanan (50%) -->
                                            <div class="w-1/2 flex justify-end">
                                                <InputNumber v-model="pb[`persen_${pbIdx + 1}`]"
                                                    :input-style="{ width: '50%', border: '2px solid', }" :min="0"
                                                    :max="100" :useGrouping="false" placeholder="Isi angka (%)"
                                                    @input="val => onChangeElemenPerbandinganKarakteristikFisik('luas_tanah', val, pbIdx + 1, pb.id)" />
                                            </div>
                                        </div>
                                    </template>


                                    <!-- Luas Bangunan -->
                                    <template v-else-if="item.label === 'Luas Bangunan'">
                                        <div class="flex items-center w-full">
                                            <div class="w-1/2 text-center">
                                                <p>{{ pb[`tempPersen_${pbIdx + 1}`] ?? '-' }}</p>
                                            </div>

                                            <div class="w-1/2 flex justify-end">
                                                <InputNumber v-model="pb[`persen_${pbIdx + 1}`]"
                                                    :input-style="{ width: '50%', border: '2px solid', }" :min="0"
                                                    :max="100" :useGrouping="false" placeholder="Isi angka (%)"
                                                    @input="val => onChangeElemenPerbandinganKarakteristikFisik('luas_bangunan', val, pbIdx + 1, pb.id)" />
                                            </div>
                                        </div>
                                    </template>


                                    <!-- Bentuk -->
                                    <template v-else-if="item.label === 'Bentuk'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganKarakteristikFisik('bentuk', val, pbIdx + 1, pb.id)" />
                                    </template>

                                    <!-- Elevasi -->
                                    <template v-else-if="item.label === 'Elevasi'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganKarakteristikFisik('elevasi', val, pbIdx + 1, pb.id)" />
                                    </template>

                                    <!-- Topografi -->
                                    <template v-else-if="item.label === 'Topografi'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganKarakteristikFisik('topografi', val, pbIdx + 1, pb.id)" />
                                    </template>

                                    <!-- Lebar Muka -->
                                    <template v-else-if="item.label === 'Lebar Muka'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganKarakteristikFisik('lebar_muka', val, pbIdx + 1, pb.id)" />
                                    </template>

                                    <!-- Peruntukan -->
                                    <template v-else-if="item.label === 'Peruntukan'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganKarakteristikFisik('peruntukan', val, pbIdx + 1, pb.id)" />
                                    </template>

                                    <!-- Kondisi Bangunan -->
                                    <template v-else-if="item.label === 'Kondisi Bangunan'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganKarakteristikFisik('kondisi_bangunan', val, pbIdx + 1, pb.id)" />
                                    </template>

                                    <!-- Lainnya -->
                                    <template v-else-if="item.label === 'Lainnya (Sebutkan)'">
                                        <InputNumber v-model="pb[`persen_${pbIdx + 1}`]" class="w-full" :min="0"
                                            input-style="border: 2px solid;" :max="100" :useGrouping="false"
                                            placeholder="Isi angka (%)"
                                            @input="val => onChangeElemenPerbandinganKarakteristikFisik('lainnya', val, pbIdx + 1, pb.id)" />
                                    </template>


                                    <!-- Default (kalau tidak ada) -->
                                    <template v-else>
                                        <span class="dark:text-white">-</span>
                                    </template>
                                </td>

                                <!-- Kanan -->
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ pb[`penyesuaian_${pbIdx + 1}`] || '-' }}
                                </td>
                            </template>
                        </tr>


                        <!-- Baris tambahan dengan sekat lurus -->


                    </template>
                    <tr>
                        <td colspan="100%" style="height: 30px;"></td>
                    </tr>
                    <template v-for="item in dataSummaryPasar.informasiUmumFields" :key="item.label">

                        <!-- Baris utama -->
                        <tr>
                            <!-- Label -->
                            <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                {{ item.label }}
                            </td>
                            <template v-for="(pb, pbIdx) in 1" :key="'pb-' + pbIdx">
                                <template v-if="item.label === 'Jumlah Penyesuaian'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="2">

                                    </td>
                                </template>
                                <template v-if="item.label === 'Indikasi Nilai Sewa Pasar setelah penyesuaian / m²'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="2">

                                    </td>
                                </template>
                                <template v-if="item.label === 'Proporsi'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="2">
                                        {{ item.objects.totalProporsi }}
                                    </td>
                                </template>
                                <template v-else-if="item.label === 'Total Bobot Absolut'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="2">
                                        {{ item.objects.totalBobotAbsolutAll }}
                                    </td>
                                </template>
                                <template v-else-if="item.label === 'Inverse'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="2">
                                        {{ item.objects.totalInverse }}
                                    </td>
                                </template>
                                <template v-else-if="item.label === 'Pembobotan Akhir'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="2">
                                        {{ item.objects.totalPembobotanAkhir }}
                                    </td>
                                </template>
                                <!-- Objects -->

                            </template>


                            <!-- Pembanding -->
                            <template v-for="(pb, pbIdx) in item.pembanding" :key="'pb-' + pbIdx">
                                <!-- Kalau label = Jumlah Penyesuaian -->
                                <template v-if="item.label === 'Jumlah Penyesuaian'">

                                    <!-- Kiri -->
                                    <td class="p-2 border dark:border-gray-600 dark:text-white">
                                        {{ pb.deskripsi || '-' }}
                                    </td>

                                    <!-- Input angka -->
                                    <td class="p-2 border dark:border-gray-600 text-center">
                                        <!-- contoh input / angka -->
                                        {{ pb.jumlahPenyesuaianPersen || '-' }}
                                    </td>

                                    <!-- Kanan -->
                                    <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                        {{ pb.jumlahPenyesuaian || '-' }}
                                    </td>
                                </template>

                                <!-- Kalau bukan Jumlah Penyesuaian -->
                                <template
                                    v-else-if="item.label === 'Indikasi Nilai Sewa Pasar setelah penyesuaian / m²'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="4">
                                        {{ pb.indikasiNilai || '-' }}
                                    </td>
                                </template>
                                <template v-else-if="item.label === 'Total Bobot Absolut'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="4">
                                        {{ pb.totalBobotAbsolut || '-' }}
                                    </td>
                                </template>
                                <template v-else-if="item.label === 'Proporsi'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="4">
                                        {{ pb.proporsi || '-' }}
                                    </td>
                                </template>
                                <template v-else-if="item.label === 'Inverse'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="4">
                                        {{ pb.inverse || '-' }}
                                    </td>
                                </template>
                                <template v-else-if="item.label === 'Pembobotan Akhir'">
                                    <td class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="4">
                                        {{ pb.pembobotanAkhir || '-' }}
                                    </td>
                                </template>
                                <template v-else>
                                    <td class="p-2 border dark:border-gray-600 dark:text-white text-center" colspan="4">
                                        {{ pb.totalPenyesuaian || '-' }}
                                    </td>
                                </template>

                            </template>

                        </tr>

                        <!-- Baris tambahan dengan sekat lurus -->

                    </template>
                </tbody>
            </table>

            <br><br>

            <table class="min-w-full mt-6 border border-gray-300 text-sm dark:border-gray-600">
                <thead>
                    <tr class="bg-gray-100 dark:bg-gray-800">
                        <th colspan="3"
                            class="p-2 border text-center font-semibold dark:border-gray-600 dark:text-white">
                            Kesimpulan Nilai
                        </th>
                    </tr>
                    <tr class="bg-gray-100 text-center dark:bg-gray-800 text-left">
                        <th class="p-2 border dark:border-gray-600 dark:text-white">Data Pembanding</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white">Bobot</th>
                        <th class="p-2 border dark:border-gray-600 dark:text-white">Nilai</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in dataSummaryPasar.kesimpulanNilai" :key="'kesimpulan-' + index">
                        <td class="border p-2 dark:border-gray-600 dark:text-white">{{ item.jenis_property }}</td>
                        <td class="border p-2 dark:border-gray-600 text-center">{{ item.bobot }}</td>
                        <td class="border p-2 dark:border-gray-600 text-right">{{ item.nilai }}</td>
                    </tr>
                </tbody>
            </table>

            <br>

            <table class="min-w-full border border-gray-300 text-sm mt-4 text-center">
                <tbody>
                    <!-- Deviasi di atas -->
                    <tr>
                        <td class="border p-2 text-left font-semibold dark:text-white">Deviasi:</td>
                        <td class="border p-2 dark:text-white font-semibold">
                            {{
                                dataSummaryPasar.nilaiMaxMinDeviasi?.find(item => item.label === 'Deviasi')?.value || '0'
                            }}
                        </td>
                        <td class="border p-2 font-bold align-middle dark:text-white" :rowspan="3">
                            {{ dataSummaryPasar.status || '0' }}
                        </td>
                    </tr>
                    <!-- Loop untuk Min dan Max -->
                    <tr v-for="item in dataSummaryPasar.nilaiMaxMinDeviasi?.filter(i => i.label !== 'Deviasi') || [{ label: 'Min', value: '0' }, { label: 'Max', value: '0' }]"
                        :key="item.label">
                        <td class="border p-2 text-left dark:text-white">{{ item.label }}</td>
                        <td class="border p-2">{{ item.value || '0' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>


    </div>
</template>
