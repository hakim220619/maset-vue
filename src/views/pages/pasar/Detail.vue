<script setup>
import { AuthApi } from '@/service/Api';
import { Helper } from '@/service/Helper';
import { onMounted, ref, watch } from 'vue';
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
var judulPenilaianDataAsset = ref(null);
var judulPenilaianDataPembanding1 = ref(null);
var judulPenilaianDataPembanding2 = ref(null);
var judulPenilaianDataPembanding3 = ref(null);

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
const bangunanOptions = ref([])
const pembandingOptions = ref([])

const defaultUmurEkonomis = ref(10)

async function onPersenInput(raw_persen, label, pembanding_id, type = 'elemen_perbandingan') {
    const PasarId = route.params.id;   // 👈 get it here
    try {


        const url = type === 'elemen_perbandingan' ? `/pasar/${PasarId}/penyesuaian/elemen-perbandingan` : `/pasar/${PasarId}/penyesuaian/karakter-fisik`;
        console.log(url);

        await AuthApi.client().put(url, {
            label,
            raw_persen,
            pembanding_id
        });
        // this.$toast.success("Tersimpan!");
    } catch (err) {
        console.error("Failed to save persen:", err);
        // Optional user feedback
        // this.$toast.error("Gagal menyimpan…");
    } finally {
        // Optionally, you can reload the data or show a success message
        // this.loadPasarDetail(PasarId);
    }
}

function getValue(obj, key) {
    return obj?.[key] ?? '-'
}


const route = useRoute();

async function loadPasarDetail(id) {
    const res = await AuthApi.client().get(`/pasar/${id}`)

    if (res.data.success) {
        const resData = res.data.data
        judulPenilaianDataAsset = resData.tanahs?.[0]?.judul_penilaian
        judulPenilaianDataPembanding1 = resData.pembandings?.[0]?.jenis_property
        judulPenilaianDataPembanding2 = resData.pembandings?.[1]?.jenis_property
        judulPenilaianDataPembanding3 = resData.pembandings?.[2]?.jenis_property

        data.value = {
            object: [
                1
            ],
            pasar: resData.pasar || [],
            pembanding: resData.pembandings || [],
            pembandings: resData.pembandings || [],
            tanahs: resData.tanahs || [],
            elemen_perbandingan: resData.elemen_perbandingan || [],
            lokasi: resData.lokasi || [],
            karakter_fisik: resData.karakter_fisik || [],
            summary: resData.summary || [],
            conclusions: resData.conclusions || {},
            final_summary: resData.final_summary || {}
        }
    }
}


async function getMasterJenisBangunan() {
    const res = await AuthApi.client().get(`/getMasterJenisBangunan`)
    dataJenisBangunan.value = res.data.data

    // Grouping berdasarkan type
    const grouped = {}
    dataJenisBangunan.value.forEach(item => {
        if (!grouped[item.type]) {
            grouped[item.type] = {
                label: item.type,
                code: item.type, // bisa juga bikin kode singkat kalau mau
                items: []
            }
        }
        grouped[item.type].items.push({
            label: item.name,
            value: item.id,
            tahun: item.tahun
        })
    })

    pembandingOptions.value = Object.values(grouped)
}


const selectedTahun = ref([]);
const kondisiFisikValues = ref([]);
const keusanganFungsionalValues = ref([]);
const keusanganEkonomisValues = ref([]);


const resetElemenPerbandingan = (idx, pbId) => {
    // reset di state
    hakAtasProperti.value[idx] = 0;
    syaratPembiayaan.value[idx] = 0;
    kondisiPenjualan.value[idx] = 0;
    pengeluaranSetelahPembelian.value[idx] = 0;
    kondisiPasar.value[idx] = 0;

    // reset langsung di dataElemenPerbandinganPasar biar input kosong/0
    if (Array.isArray(dataElemenPerbandinganPasar.value)) {
        dataElemenPerbandinganPasar.value.forEach(item => {
            if (Array.isArray(item.pembanding)) {
                item.pembanding.forEach(pb => {
                    if (pb.id === pbId) {
                        pb.hak_atas_properti = 0;
                        pb.syarat_pembiayaan = 0;
                        pb.kondisi_penjualan = 0;
                        pb.pengeluaran_setelah_pembelian = 0;
                        pb.kondisi_pasar = 0;

                        // 🔥 tambahan reset penyesuaian & hasil
                        pb.penyesuaian = 0;
                        pb.hasil = "Rp 0";  // kalau mau string rupiah
                        // pb.hasil = 0;     // kalau mau angka murni
                    }
                });
            }
        });
    }
};




const onDataChangeEstimasiBangunan = async (fieldKey, selectedValue, idx, pbId) => {
    try {
        resetElemenPerbandingan(idx, pbId);
        if (fieldKey === "jenis_bangunan") {
            let tahun = null;
            for (const group of pembandingOptions.value) {
                const found = group.items.find(i => i.value === selectedValue);
                if (found) {
                    tahun = found.tahun;
                    break;
                }
            }

            selectedTahun.value[idx] = tahun || null;

            dataEstimasiBangunan.value.forEach(field => {
                if (!field.items[0]) field.items[0] = {};
                if (field.label === "Jenis Bangunan") {
                    field.items[0]['pembandingjbangunan' + (idx + 1)] = selectedValue;
                }
                if (field.label === "Umur Ekonomis") {
                    field.items[0]['umur_ekonomis' + (idx + 1)] = tahun || '-';
                }
            });

        } else if (fieldKey === "kondisi_fisik_bangunan") {
            let value = parseFloat(selectedValue.value) || 0;
            if (value > 100) value = 100;
            if (value < 0) value = 0;
            kondisiFisikValues.value[idx] = value;

        } else if (fieldKey === "keusangan_fungsional") {
            let value = parseFloat(selectedValue.value) || 0;
            if (value > 100) value = 100;
            if (value < 0) value = 0;
            keusanganFungsionalValues.value[idx] = value;

        } else if (fieldKey === "keusangan_ekonomis") {
            let value = parseFloat(selectedValue.value) || 0;
            if (value > 100) value = 100;
            if (value < 0) value = 0;
            keusanganEkonomisValues.value[idx] = value;
        }

        // bikin query dinamis untuk API
        const PasarId = route.params.id;
        const query = data.value.pembandings
            .map((pb, i) => {
                const tahun = selectedTahun.value[i] ?? null;
                const kfisik = kondisiFisikValues.value[i] ?? null;
                const kfungsional = keusanganFungsionalValues.value[i] ?? null;
                const kekonomis = keusanganEkonomisValues.value[i] ?? null;

                if (pb?.id && (tahun !== null || kfisik !== null || kfungsional !== null || kekonomis !== null)) {
                    return `pembanding_id=${pb.id}&tahun=${tahun ?? ""}&kfisik=${kfisik ?? ""}&kfungsional=${kfungsional ?? ""}&kekonomis=${kekonomis ?? ""}&list_data=${i + 1}`;
                }
                return null;
            })
            .filter(Boolean)
            .join("&");


        if (query) {
            const res = await AuthApi.client().get(
                `/getDataEstimasiBangunanPasar/${PasarId}?${query}`
            );

            if (res.data.success) {
                const newData = res.data.data;
                dataEstimasiBangunan.value = newData.map((newField, i) => {
                    const oldField = dataEstimasiBangunan.value[i] || { items: [{}] };
                    return {
                        ...newField,
                        items: [{
                            ...oldField.items?.[0],
                            ...newField.items?.[0],
                        }]
                    };
                });
            }
        }

    } catch (err) {
        console.error("Error load data estimasi bangunan:", err);
    }
};


const hakAtasProperti = ref([]);
const syaratPembiayaan = ref([]);
const kondisiPenjualan = ref([]);
const pengeluaranSetelahPembelian = ref([]);
const kondisiPasar = ref([]);
const estimasi_nilai_pasar_tanah_per_m2 = ref([]);



const onChangeElemenPerbandingan = async (fieldKey, selectedValue, idx, pbId) => {
    try {
        resetElemenPerbandinganLokasi(idx, pbId)
        resetElemenPerbandinganKarakteristikFisik(idx, pbId)

        if (fieldKey === "hak_atas_properti") {

            let value = parseFloat(selectedValue) || 0;
            if (value > 100) value = 100;
            if (value < 0) value = 0;
            hakAtasProperti.value[idx] = value;
        } else if (fieldKey === "syarat_pembiayaan") {
            let value = parseFloat(selectedValue) || 0;
            if (value > 100) value = 100;
            if (value < 0) value = 0;
            syaratPembiayaan.value[idx] = value;
        } else if (fieldKey === "kondisi_penjualan") {
            let value = parseFloat(selectedValue) || 0;
            if (value > 100) value = 100;
            if (value < 0) value = 0;
            kondisiPenjualan.value[idx] = value;
        } else if (fieldKey === "pengeluaran_setelah_pembelian") {
            let value = parseFloat(selectedValue) || 0;
            if (value > 100) value = 100;
            if (value < 0) value = 0;
            pengeluaranSetelahPembelian.value[idx] = value;
        } else if (fieldKey === "kondisi_pasar") {
            let value = parseFloat(selectedValue) || 0;
            if (value > 100) value = 100;
            if (value < 0) value = 0;
            kondisiPasar.value[idx] = value;
        }
        // console.log(pengeluaranSetelahPembelian);

        // cari item dengan key tertentu
        const target = dataEstimasiBangunan.value.find(
            (d) => d.key === "estimasi_nilai_pasar_tanah_per_m2"
        );

        if (target && target.items?.length) {
            // ambil hanya field pembanding (filter key yg diawali "pembanding")
            estimasi_nilai_pasar_tanah_per_m2.value = Object.entries(target.items[0])
                .filter(([k]) => k.startsWith("pembanding"))
                .map(([_, v]) => v);
        }

        // console.log("estimasi nilai pasar tanah / m2", estimasi_nilai_pasar_tanah_per_m2.value);

        // --- bikin query khusus ---
        const PasarId = route.params.id;
        const query = data.value.pembandings
            .map((pb, i) => {
                if (!pb?.id) return null;

                const valHak = hakAtasProperti.value[i] ?? null;
                const valSyartPembiayaan = syaratPembiayaan.value[i] ?? null;
                const valKondisiPenjualan = kondisiPenjualan.value[i] ?? null;
                const valPengeluaranSetelahPembelian = pengeluaranSetelahPembelian.value[i] ?? null;
                const valKondisiPasar = kondisiPasar.value[i] ?? null;
                const valEstimasi = estimasi_nilai_pasar_tanah_per_m2.value[i] ?? null;

                return valEstimasi !== null && (valHak !== null || valSyartPembiayaan !== null || valKondisiPenjualan !== null)
                    ? `pembanding_id=${pb.id}&hak_atas_properti=${valHak}&syarat_pembiayaan=${valSyartPembiayaan}&kondisi_penjualan=${valKondisiPenjualan}&pengeluaran_setelah_pembelian=${valPengeluaranSetelahPembelian}&kondisi_pasar=${valKondisiPasar}&estimasi_nilai_pasar_tanah_per_m2=${valEstimasi}&list_data=${i + 1}`
                    : null;
            })
            .filter(Boolean)
            .join("&");

        // console.log("query", query);


        if (!query) return;

        const res = await AuthApi.client().get(
            `/getElemenPerbandinganPasar/${PasarId}?${query}`
        );
        // console.log(res);

        if (res.data.success) {
            const newData = res.data.data;

            // bikin map lama by label supaya nggak hilang
            const oldByLabel = new Map(
                (Array.isArray(dataElemenPerbandinganPasar.value)
                    ? dataElemenPerbandinganPasar.value
                    : []
                ).map((f) => [f.label, f])
            );

            dataElemenPerbandinganPasar.value = newData.map((newField) => {
                const oldField =
                    oldByLabel.get(newField.label) || { objects: [], pembanding: [] };

                // --- merge objects ---
                const oldObjects = Array.isArray(oldField.objects)
                    ? oldField.objects
                    : [];
                const newObjects = Array.isArray(newField.objects)
                    ? newField.objects
                    : [];
                const maxObj = Math.max(oldObjects.length, newObjects.length, 1);

                const objects = Array.from({ length: maxObj }, (_, j) => ({
                    ...(oldObjects[j] || {}),
                    ...(newObjects[j] || {}),
                }));

                // --- merge pembanding (by id kalau ada, fallback index) ---
                const oldPbs = Array.isArray(oldField.pembanding)
                    ? oldField.pembanding
                    : [];
                const oldPbById = new Map(
                    oldPbs.filter((x) => x && x.id != null).map((x) => [x.id, x])
                );

                const pembanding = (newField.pembanding || []).map((pb, i) => {
                    const oldPb =
                        (pb && pb.id != null ? oldPbById.get(pb.id) : null) ||
                        oldPbs[i] ||
                        {};

                    // kalau index cocok dengan input yang barusan diubah, ambil dari state hakAtasProperti
                    const persenOverride =
                        i === idx && pb.id === pbId ? hakAtasProperti.value[idx] : pb?.persen;

                    return {
                        ...oldPb,
                        ...pb,
                        deskripsi: pb?.deskripsi ?? oldPb.deskripsi ?? "-",
                        persen: persenOverride ?? oldPb.persen ?? null,
                        penyesuaian: pb?.penyesuaian ?? oldPb.penyesuaian ?? null,
                        hasil: pb?.hasil ?? oldPb.hasil ?? null,
                    };
                });


                return {
                    ...newField,
                    objects,
                    pembanding, // ⬅️ jangan lupa tambahkan kembali
                };
            });
            hitungTotalPenyesuaian();

            // Update backend
            await updateTotalPenyesuaian(idx);
        }

    } catch (err) {
        console.error("Error load data estimasi bangunan:", err);
    }
};

const jarakPusatKota = ref([]);
const perkerasanJalan = ref([]);
const aksesibilitasLokasi = ref([]);
const kondisiLingkungan = ref([]);
const posisiAset = ref([]);
const lainnya = ref([]);
const perkiraanHargaTransaksiSetelahPenyesuaian = ref([]);

const resetElemenPerbandinganLokasi = (idx, pbId) => {
    // console.log(pbId);

    // reset di state
    jarakPusatKota.value[idx] = 0;
    perkerasanJalan.value[idx] = 0;
    aksesibilitasLokasi.value[idx] = 0;
    kondisiLingkungan.value[idx] = 0;
    posisiAset.value[idx] = 0;
    lainnya.value[idx] = 0;
    // console.log(idx);

    // console.log(dataElemenPerbandinganLokasiPasar.value);

    // reset langsung di dataElemenPerbandinganLokasiPasar biar input kosong/0
    if (Array.isArray(dataElemenPerbandinganLokasiPasar.value)) {
        dataElemenPerbandinganLokasiPasar.value.forEach(item => {
            // console.log(item);

            if (Array.isArray(item.pembanding)) {
                item.pembanding.forEach(pb => {


                    if (pb.id === pbId) {
                        pb.jarak_pusat_kota = 0;
                        pb.perkerasan_jalan = 0;
                        pb.aksesibilitas_lokasi = 0;
                        pb.kondisi_lingkungan = 0;
                        pb.posisi_aset = 0;
                        pb.lainnya = 0;

                        // reset penyesuaian & hasil
                        pb.penyesuaian = 0;
                    }
                });
            }
        });
    }

    // reset perkiraan harga juga
    perkiraanHargaTransaksiSetelahPenyesuaian.value[idx] = 0;
};
const parseToFloat = (val) => {
    if (val === null || val === undefined) return 0;

    // ubah ke string, hilangkan "Rp" dan spasi
    let str = String(val).replace(/Rp\s?/gi, "").trim();

    // hilangkan semua titik ribuan
    str = str.replace(/\./g, "");

    // ganti koma (,) jadi titik (.) untuk decimal
    str = str.replace(/,/g, ".");

    // parse ke float
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
};



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
            if (labelExclude.includes(field.label)) return; // skip field tertentu
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
        let value = parseFloat(selectedValue) || 0;
        if (value > 100) value = 100;
        if (value < 0) value = 0;


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

        // console.log(dataElemenPerbandinganPasar);

        const target = dataElemenPerbandinganPasar.value.find(
            (d) => d.label === "Perkiraan Harga Transaksi setelah Penyesuaian"
        );
        // console.log(target);

        if (target && target.pembanding?.length) {
            // console.log(target);

            perkiraanHargaTransaksiSetelahPenyesuaian.value = target.pembanding.map(pb => pb.hasil);
        }


        const PasarId = route.params.id;
        const query = data.value.pembandings
            .map((pb, i) => {
                if (!pb?.id) return null;

                const valJarak = jarakPusatKota.value[i] ?? null;
                const valPerkerasan = perkerasanJalan.value[i] ?? null;
                const valAkses = aksesibilitasLokasi.value[i] ?? null;
                const valLingkungan = kondisiLingkungan.value[i] ?? null;
                const valPosisi = posisiAset.value[i] ?? null;
                const valLainnya = lainnya.value[i] ?? null;
                const valPerkiraan = perkiraanHargaTransaksiSetelahPenyesuaian.value[i] ?? null;


                return valPerkiraan !== null &&
                    (valJarak !== null ||
                        valPerkerasan !== null ||
                        valAkses !== null ||
                        valLingkungan !== null ||
                        valPosisi !== null ||
                        valLainnya !== null)
                    ? `pembanding_id=${pb.id}&jarak_pusat_kota=${valJarak}&perkerasan_jalan=${valPerkerasan}&aksesibilitas_lokasi=${valAkses}&kondisi_lingkungan=${valLingkungan}&posisi_aset=${valPosisi}&lainnya=${valLainnya}&perkiraan_harga_setelah_penyesuaian=${valPerkiraan}&list_data=${i + 1}`
                    : null;
            })
            .filter(Boolean)
            .join("&");

        if (!query) return;

        const res = await AuthApi.client().get(
            `/getElemenPerbandinganLokasiPasar/${PasarId}?${query}`
        );

        if (res.data.success) {
            const newData = res.data.data;

            const oldByLabel = new Map(
                (Array.isArray(dataElemenPerbandinganLokasiPasar.value)
                    ? dataElemenPerbandinganLokasiPasar.value
                    : []
                ).map((f) => [f.label, f])
            );

            dataElemenPerbandinganLokasiPasar.value = newData.map((newField) => {
                const oldField =
                    oldByLabel.get(newField.label) || { objects: [], pembanding: [] };

                const oldObjects = Array.isArray(oldField.objects)
                    ? oldField.objects
                    : [];
                const newObjects = Array.isArray(newField.objects)
                    ? newField.objects
                    : [];
                const maxObj = Math.max(oldObjects.length, newObjects.length, 1);

                const objects = Array.from({ length: maxObj }, (_, j) => ({
                    ...(oldObjects[j] || {}),
                    ...(newObjects[j] || {}),
                }));

                const oldPbs = Array.isArray(oldField.pembanding)
                    ? oldField.pembanding
                    : [];
                const oldPbById = new Map(
                    oldPbs.filter((x) => x && x.id != null).map((x) => [x.id, x])
                );

                const pembanding = (newField.pembanding || []).map((pb, i) => {
                    const oldPb =
                        (pb && pb.id != null ? oldPbById.get(pb.id) : null) ||
                        oldPbs[i] ||
                        {};

                    const persenOverride =
                        i === idx && pb.id === pbId ? value : pb?.persen;




                    return {
                        ...oldPb,
                        ...pb,
                        deskripsi: pb?.deskripsi ?? oldPb.deskripsi ?? "-",
                        persen: persenOverride ?? oldPb.persen ?? null,
                        penyesuaian: pb?.penyesuaian ?? oldPb.penyesuaian ?? null,
                        hasil: pb?.hasil ?? oldPb.hasil ?? null,
                    };
                });

                return {
                    ...newField,
                    objects,
                    pembanding,
                };
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

const resetElemenPerbandinganKarakteristikFisik = (idx, pbId) => {
    // reset di state (ref)
    luasTanahFinal.value[idx] = 0;
    luasBangunanFinal.value[idx] = 0;
    bentukFinal.value[idx] = 0;
    elevasiFinal.value[idx] = 0;
    topografiFinal.value[idx] = 0;
    lebarMukaFinal.value[idx] = 0;
    peruntukanFinal.value[idx] = 0;
    kondisiBangunanFinal.value[idx] = 0;
    lainnyaFinal.value[idx] = 0;

    // reset langsung di dataElemenPerbandinganKarakterFisikPasar biar input kosong/0
    if (Array.isArray(dataElemenPerbandinganKarakterFisikPasar.value)) {
        dataElemenPerbandinganKarakterFisikPasar.value.forEach(item => {
            if (Array.isArray(item.pembanding)) {
                item.pembanding.forEach(pb => {
                    if (pb.id === pbId) {
                        pb.luas_tanah = 0;
                        pb.luas_bangunan = 0;
                        pb.bentuk = 0;
                        pb.elevasi = 0;
                        pb.topografi = 0;
                        pb.lebar_muka = 0;
                        pb.peruntukan = 0;
                        pb.kondisi_bangunan = 0;
                        pb.lainnya = 0;

                        // reset penyesuaian & hasil
                        pb.penyesuaian = 0;
                        pb.hasil = 0;
                    }
                });
            }
        });
    }

    // reset perkiraan harga juga
    perkiraanHargaTransaksiSetelahPenyesuaian.value[idx] = 0;
};



const onChangeElemenPerbandinganKarakteristikFisik = async (fieldKey, selectedValue, idx, pbId) => {
    try {
        let value = parseFloat(selectedValue) || 0;
        value = Math.min(Math.max(value, 0), 100); // Batas 0-100

        if (fieldMap[fieldKey]) {
            fieldMap[fieldKey].value[idx] = value;
        }

        const target = dataElemenPerbandinganPasar.value.find(
            d => d.label === "Perkiraan Harga Transaksi setelah Penyesuaian"
        );
        if (target?.pembanding?.length) {
            perkiraanHargaTransaksiSetelahPenyesuaian.value = target.pembanding.map(pb => pb.hasil);
        }

        const PasarId = route.params.id;
        const query = data.value.pembandings
            .map((pb, i) => {
                if (!pb?.id) return null;
                const params = Object.entries(fieldMap)
                    .map(([key, ref]) => `${key}=${ref.value[i] ?? 0}`)
                    .join("&");
                const valPerkiraan = perkiraanHargaTransaksiSetelahPenyesuaian.value[i] ?? null;
                return valPerkiraan !== null
                    ? `pembanding_id=${pb.id}&${params}&perkiraan_harga_setelah_penyesuaian=${valPerkiraan}&list_data=${i + 1}`
                    : null;
            })
            .filter(Boolean)
            .join("&");

        if (!query) return;

        const res = await AuthApi.client().get(
            `/getElemenPerbandinganKarakterFisikPasar/${PasarId}?${query}`
        );

        if (!res.data.success) return;

        const newData = res.data.data;
        const oldByLabel = new Map((dataElemenPerbandinganKarakterFisikPasar.value || []).map(f => [f.label, f]));

        dataElemenPerbandinganKarakterFisikPasar.value = newData.map(newField => {
            const oldField = oldByLabel.get(newField.label) || { objects: [], pembanding: [] };
            const oldPbs = oldField.pembanding || [];
            const oldPbById = new Map(oldPbs.filter(x => x?.id != null).map(x => [x.id, x]));

            const pembanding = (newField.pembanding || []).map((pb, i) => {
                const oldPb = pb?.id != null ? oldPbById.get(pb.id) : oldPbs[i] || {};
                const persenOverride = i === idx && pb.id === pbId ? value : pb?.persen;
                return {
                    ...oldPb,
                    ...pb,
                    deskripsi: pb?.deskripsi ?? oldPb.deskripsi ?? "-",
                    persen: persenOverride ?? oldPb.persen ?? null,
                    penyesuaian: pb?.penyesuaian ?? oldPb.penyesuaian ?? 0,
                    hasil: pb?.hasil ?? oldPb.hasil ?? null,
                };
            });

            return {
                ...newField,
                objects: newField.objects || [],
                pembanding,
            };
        });

        // Hitung total setelah update
        hitungTotalPenyesuaian();

        // Update backend
        await updateTotalPenyesuaian(idx);

    } catch (err) {
        console.error("Error load data karakteristik fisik:", err);
    }
};

const updateTotalPenyesuaian = async (idx) => {
    try {
        const PasarId = route.params.id;
        if (!dataTotals.value?.length || !dataPersent.value?.length) return;

        const query = data.value.pembandings
            .map((pb, i) => {
                if (!pb?.id) return null;
                const valTotal = parseFloat(dataTotals.value[i]) || 0;
                const valPersent = parseFloat(dataPersent.value[i]) || 0;
                return `pembanding_id=${pb.id}&total=${valTotal}&persent=${valPersent}&list_data=${i + 1}&idx=${idx}`;
            })
            .filter(Boolean)
            .join("&");
        console.log(query);

        if (!query) return;

        const res = await AuthApi.client().get(`/getSummaryPasar/${PasarId}?${query}`);
        if (!res.data.success) return;

        const newData = res.data.data;
        const oldByLabel = new Map((dataSummaryPasar.value || []).map(f => [f.label, f]));

        dataSummaryPasar.value = newData.map(newField => {
            const oldField = oldByLabel.get(newField.label) || { objects: [], pembanding: [] };
            const oldPbs = oldField.pembanding || [];
            const oldPbById = new Map(oldPbs.filter(x => x?.id != null).map(x => [x.id, x]));

            const pembanding = (newField.pembanding || []).map((pb, i) => {
                const oldPb = pb?.id != null ? oldPbById.get(pb.id) : oldPbs[i] || {};
                return {
                    ...oldPb,
                    ...pb,
                    deskripsi: pb?.deskripsi ?? oldPb.deskripsi ?? "-",
                    persen: pb?.persen ?? oldPb.persen ?? null,
                    penyesuaian: pb?.penyesuaian ?? oldPb.penyesuaian ?? 0,
                    totalPenyesuaian: pb?.totalPenyesuaian ?? oldPb.totalPenyesuaian ?? 0,
                    totalPersent: pb?.totalPersent ?? oldPb.totalPersent ?? 0,
                };
            });

            return {
                ...newField,
                objects: newField.objects || [],
                pembanding,
            };
        });

    } catch (err) {
        console.error("Error update total penyesuaian:", err);
    }
};



onMounted(async () => {

    if (route.params.id) {
        await getMasterJenisBangunan();
        await loadPasarDetail(route.params.id);

        if (data.value.pembandings && data.value.pembandings.length > 0) {
            selectedTahun.value = Array(data.value.pembandings.length).fill(null);
        }

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

        informasiUmumFields.value = dataInformasiUmum;
        dataTransaksiFields.value = dataTransaksi;
        dataPropertiFields.value = dataProperti;
        dataUnitPerbandinganField.value = dataUnitPerbandingan;
        dataElemenPerbandinganPasar.value = dataElemenPerbandingan;
        dataElemenPerbandinganLokasiPasar.value = dataElemenPerbandinganLokasi;
        dataElemenPerbandinganKarakterFisikPasar.value = dataElemenPerbandinganKarakterFisik;
        dataSummaryPasar.value = dataSummary;
        dataEstimasiBangunan.value = EstimasiBangunan;
        // console.log(dataElemenPerbandinganKarakterFisikPasar);

        // ✅ Set default value setelah pembandingOptions sudah ada
        dataEstimasiBangunan.value.forEach(field => {
            if (!field.items[0]) field.items[0] = {};
            data.value.pembandings.forEach((_, idx) => {
                const key = 'pembanding' + (idx + 1);
                if (!(key in field.items[0])) {
                    field.items[0][key] = null;  // set default supaya reactive
                }
            });
        });
        dataElemenPerbandinganPasar.value = dataElemenPerbandinganPasar.value.map((field) => {
            // pastikan objek utama ada
            if (!Array.isArray(field.objects) || field.objects.length === 0) {
                field.objects = [{ keterangan: "", deskripsi: "" }];
            }

            // pastikan pembanding sesuai jumlah data.value.pembandings
            const totalPb = data.value.pembandings.length;
            field.pembanding = Array.from({ length: totalPb }, (_, idx) => {
                const existing = field.pembanding?.[idx] || {};

                return {
                    id: existing.id ?? data.value.pembandings[idx]?.id ?? null,
                    deskripsi: existing.deskripsi ?? "",
                    persen: existing.persen ?? null,
                    penyesuaian: existing.penyesuaian ?? null,
                    hasil: existing.hasil ?? null,
                };
            });

            return field;
        });
        dataElemenPerbandinganLokasiPasar.value = dataElemenPerbandinganLokasiPasar.value.map((field) => {
            // pastikan objek utama ada
            if (!Array.isArray(field.objects) || field.objects.length === 0) {
                field.objects = [{ keterangan: "", deskripsi: "" }];
            }

            // pastikan pembanding sesuai jumlah data.value.pembandings
            const totalPb = data.value.pembandings.length;
            field.pembanding = Array.from({ length: totalPb }, (_, idx) => {
                const existing = field.pembanding?.[idx] || {};

                return {
                    id: existing.id ?? data.value.pembandings[idx]?.id ?? null,
                    deskripsi: existing.deskripsi ?? "",
                    persen: existing.persen ?? null,
                    penyesuaian: existing.penyesuaian ?? null,
                    hasil: existing.hasil ?? null,
                };
            });

            return field;
        });
        dataElemenPerbandinganKarakterFisikPasar.value = dataElemenPerbandinganKarakterFisikPasar.value.map((field) => {
            // pastikan objek utama ada
            if (!Array.isArray(field.objects) || field.objects.length === 0) {
                field.objects = [{ keterangan: "", deskripsi: "" }];
            }

            // pastikan pembanding sesuai jumlah data.value.pembandings
            const totalPb = data.value.pembandings.length;
            field.pembanding = Array.from({ length: totalPb }, (_, idx) => {
                const existing = field.pembanding?.[idx] || {};

                return {
                    id: existing.id ?? data.value.pembandings[idx]?.id ?? null,
                    deskripsi: existing.deskripsi ?? "",
                    persen: existing.persen ?? null,
                    penyesuaian: existing.penyesuaian ?? null,
                    hasil: existing.hasil ?? null,
                };
            });

            return field;
        });

    }
});



function formatDate(dateStr) {
    if (!dateStr) return '-'
    const options = { day: '2-digit', month: 'long', year: 'numeric' }
    return new Date(dateStr).toLocaleDateString('id-ID', options)
}


watch(
    [() => pembandingOptions.value, () => dataEstimasiBangunan.value],
    ([newOptions, newEstimasi]) => {
        if (!newEstimasi || newOptions.length === 0) return;

        newEstimasi.forEach((field) => {
            // Hanya untuk field tertentu
            if (
                ["Keusangan Fungsional", "Keusangan Ekonomis", "Kondisi Fisik Bangunan (Visual)"].includes(field.label)
            ) {
                if (field.items?.[0]) {
                    data.value.pembandings.forEach((_, idxx) => {
                        const key = "pembandings" + (idxx + 1);

                        // default dari pembandingOptions atau 0
                        if (!field.items[0][key]) {
                            field.items[0][key] = newOptions[0]?.value ?? 0;
                        }
                    });
                }
            }
        });
    },
    { deep: true, immediate: true }
);



</script>

<template>
    <div class="max-w-3xl ml-0 space-y-6">
        <!-- Card 1 -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 space-y-4 w-96">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">Jenis Penilaian</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300">Nilai Pasar</p>

            <div class="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
                <!-- ID Data Aset -->
                <p v-if="data.tanahs.length" class="text-sm text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Nomor ID Data Aset:</span> {{ data.tanahs[0].judul_penilaian }}
                </p>

                <!-- Loop ID Data Pembanding -->
                <p v-for="(pembanding, index) in data.pembandings" :key="pembanding.id"
                    class="text-sm text-gray-700 dark:text-gray-300">
                    <span class="font-medium">
                        Nomor ID Data Pembanding {{ index + 1 }}:
                    </span>
                    {{ pembanding.jenis_property }}
                </p>
            </div>
        </div>



        <!-- Card 2 -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 space-y-5">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Judul Penilaian</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">
                Penilaian Nilai Pasar Tempat Usaha
            </p>

            <div class="border-t border-gray-200 dark:border-gray-600 pt-5 space-y-3" v-if="data.tanahs.length">
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Nama Entitas:</span> {{ data.tanahs[0].nama_entitas }}
                </p>
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Tanggal Inspeksi:</span> {{ formatDate(data.tanahs[0].tanggal_inspeksi) }}
                </p>
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Tanggal Penilaian:</span> {{ formatDate(data.tanahs[0].tanggal_penilaian)
                    }}
                </p>
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Penilai / Surveyor:</span> {{ data.tanahs[0].penilai }}
                </p>
                <p class="text-base text-gray-700 dark:text-gray-300">
                    <span class="font-medium">Tahun Penilaian:</span> {{ data.tanahs[0].tahun_penilaian }}
                </p>
            </div>
        </div>

    </div>
    <br><br>
    <div class="overflow-auto">

        <table class="min-w-full border border-gray-300 text-sm dark:border-gray-600">
            <thead>
                <tr class="h-32 text-center">
                    <td class="border p-2  dark:border-gray-600 dark:text-white">Foto</td>
                    <template v-for="(obj, i) in data.tanahs" :key="'foto-object-' + i">
                        <td colspan="3" class="border p-2 dark:border-gray-600">
                            <img :src="obj?.foto_foto" class="h-24 mx-auto" />
                        </td>
                    </template>
                    <template v-for="(pb, i) in data.pembanding" :key="'foto-pembanding-' + i">
                        <td colspan="4" class="border p-2 dark:border-gray-600">
                            <img :src="pb?.foto" class="h-24 mx-auto" />
                        </td>
                    </template>
                </tr>

            </thead>

            <tbody>
                <!-- Baris Foto -->
                <!-- <tr class="h-32 text-center">
                    <td class="border p-2  dark:border-gray-600 dark:text-white">Foto</td>
                    <template v-for="(obj, i) in data.tanahs" :key="'foto-object-' + i">
                        <td colspan="3" class="border p-2 dark:border-gray-600">
                            <img :src="obj?.foto_foto" class="h-24 mx-auto" />
                        </td>
                    </template>
                    <template v-for="(pb, i) in data.pembanding" :key="'foto-pembanding-' + i">
                        <td colspan="4" class="border p-2 dark:border-gray-600">
                            <img :src="pb?.foto" class="h-24 mx-auto" />
                        </td>
                    </template>
                </tr> -->

                <!-- INFORMASI UMUM -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="5 + (data.object.tanahs * 2) + (data.pembanding.length * 3)">
                        INFORMASI UMUM
                    </td>
                </tr>
                <tr v-for="field in informasiUmumFields" :key="'inf-' + field.key">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <template v-for="(pb, idx) in data.tanahs" :key="'info-tanah-' + field.key + '-' + idx">
                        <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                            <div v-if="field.items?.[0]">
                                {{ getValue(pb, field.key) || '-' }}
                            </div>
                            <div v-else>-</div>
                        </td>
                    </template>
                    <template v-for="(pb, idx) in data.pembanding" :key="'info-pb-' + field.key + '-' + idx">
                        <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                            <div v-if="field.items?.[0]">
                                {{ field.items[0][`pembanding${idx + 1}`] || '-' }}
                            </div>
                            <div v-else>-</div>
                        </td>
                    </template>
                </tr>

                <!-- DATA PROPERTI -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="5 + (data.object.length * 2) + (data.pembanding.length * 3)">
                        DATA TRANSAKSI
                    </td>
                </tr>
                <tr v-for="field in dataTransaksiFields" :key="'prop-' + field.key">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <template v-for="(pb, idx) in data.tanahs" :key="'tanah-pb-' + field.key + '-' + idx">
                        <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ getValue(pb, field.key) || '-' }}
                        </td>
                    </template>
                    <template v-for="(pb, idx) in data.pembanding" :key="'prop-pb-' + field.key + '-' + idx">
                        <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ field.items?.[0]?.[`pembanding${idx + 1}`] || '-' }}
                        </td>
                    </template>
                </tr>
                <!-- DATA PROPERTI -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="5 + (data.object.length * 2) + (data.pembanding.length * 3)">
                        DATA PROPERTI
                    </td>
                </tr>
                <tr v-for="field in dataPropertiFields" :key="'prop-' + field.key">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <template v-for="(pb, idx) in data.tanahs" :key="'tanah-pb-' + field.key + '-' + idx">
                        <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ getValue(pb, field.key) || '-' }}
                        </td>
                    </template>
                    <template v-for="(pb, idx) in data.pembanding" :key="'prop-pb-' + field.key + '-' + idx">
                        <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ field.items?.[0]?.[`pembanding${idx + 1}`] || '-' }}
                        </td>
                    </template>
                </tr>
                <!-- UNIT PERBANDINGAN -->
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="5 + (data.object.length * 2) + (data.pembanding.length * 3)">
                        UNIT PERBANDINGAN
                    </td>
                </tr>
                <tr v-for="(field, index) in dataUnitPerbandinganField" :key="'unit-field-' + index">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <!-- Data objek tanah/bangunan -->
                    <template v-for="(item, idx) in field.items" :key="'obj-' + index + '-' + idx">
                        <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ item.object || '-' }}
                        </td>
                    </template>

                    <!-- Data pembanding -->
                    <template v-for="(pb, idx) in data.pembandings" :key="'pb-' + index + '-' + idx">
                        <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                            {{ field.items[0]['pembanding' + (idx + 1)] || '-' }}
                        </td>
                    </template>
                </tr>


                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="5 + (data.object.length * 2) + (data.pembanding.length * 3)">
                        ESTIMASI BANGUNAN
                    </td>
                </tr>
                <tr v-for="(field, index) in dataEstimasiBangunan" :key="'unit-field-' + index">
                    <td class="p-2 border dark:border-gray-600 dark:text-white">{{ field.label }}</td>

                    <!-- Loop tanah -->
                    <template v-for="(pb, idx) in data.tanahs" :key="'unit-pb-' + field.key + '-' + idx">
                        <td colspan="3" class="p-2 border dark:border-gray-600 dark:text-white">

                            <template>
                                {{ getValue(pb, field.key) || '-' }}
                            </template>
                        </td>
                    </template>

                    <!-- Loop pembanding -->
                    <template v-for="(pb, idx) in data.pembandings" :key="'pb-' + idx">
                        <td colspan="4" class="p-2 border dark:border-gray-600 dark:text-white">
                            <!-- Jenis Bangunan -->
                            <template v-if="field.label === 'Jenis Bangunan'">
                                <Select v-model="field.items[0]['pembandingjbangunan' + (idx + 1)]"
                                    :options="pembandingOptions" optionGroupLabel="label" optionGroupChildren="items"
                                    optionLabel="label" optionValue="value" placeholder="Pilih Jenis Bangunan"
                                    class="w-full"
                                    @change="e => onDataChangeEstimasiBangunan('jenis_bangunan', e.value, idx, pb.id)" />
                            </template>

                            <!-- Umur Ekonomis -->
                            <template v-else-if="field.label === 'Umur Ekonomis'">
                                {{ field.items[0]?.['umur_ekonomis' + (idx + 1)] || '-' }}
                            </template>

                            <!-- Kondisi Fisik Bangunan (Visual) -->
                            <template v-else-if="field.label === 'Kondisi Fisik Bangunan (Visual)'">
                                <InputNumber v-model="field.items[0]['kondisi_fisik_bangunan' + (idx + 1)]"
                                    class="w-full" :min="0" :max="100" :useGrouping="false" placeholder="Isi angka (%)"
                                    @input="val => onDataChangeEstimasiBangunan('kondisi_fisik_bangunan', val, idx, pb.id)" />
                            </template>


                            <!-- Keusangan Fungsional -->
                            <template v-else-if="field.label === 'Keusangan Fungsional'">
                                <InputNumber v-model="field.items[0]['pembandings' + (idx + 1)]" class="w-full" :min="0"
                                    :max="100" :useGrouping="false" placeholder="Isi angka (%)"
                                    @input="val => onDataChangeEstimasiBangunan('keusangan_fungsional', val, idx, pb.id)" />
                            </template>

                            <!-- Keusangan Ekonomis -->
                            <template v-else-if="field.label === 'Keusangan Ekonomis'">
                                <InputNumber v-model="field.items[0]['pembandings' + (idx + 1)]" class="w-full" :min="0"
                                    :max="100" :useGrouping="false" placeholder="Isi angka (%)"
                                    @input="val => onDataChangeEstimasiBangunan('keusangan_ekonomis', val, idx, pb.id)" />
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
                                {{ pb.deskripsi || '-' }}
                            </td>
                            <!-- {{ item }} -->
                            <!-- Hak Atas Properti -->
                            <template v-if="item.label === 'Hak Atas Properti yang dialihkan'">
                                <td class="p-2 border dark:border-gray-600">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.hak_atas_properti"
                                        @input="e => onChangeElemenPerbandingan('hak_atas_properti', pb.hak_atas_properti, pbIdx, pb.id)" />
                                </td>
                            </template>

                            <!-- Kondisi Lingkungan -->
                            <template v-else-if="item.label === 'Syarat Pembiayaan'">
                                <td class="p-2 border dark:border-gray-600">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.syarat_pembiayaan"
                                        @input="e => onChangeElemenPerbandingan('syarat_pembiayaan', pb.syarat_pembiayaan, pbIdx, pb.id)" />
                                </td>
                            </template>

                            <!-- Jarak Pusat Kota -->
                            <template v-else-if="item.label === 'Kondisi Penjualan'">
                                <td class="p-2 border dark:border-gray-600">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.kondisi_penjualan"
                                        @input="e => onChangeElemenPerbandingan('kondisi_penjualan', pb.kondisi_penjualan, pbIdx, pb.id)" />
                                </td>
                            </template>

                            <!-- Keusangan Fungsional -->
                            <template v-else-if="item.label === 'Pengeluaran yang dilakukan segera setelah pembelian'">
                                <td class="p-2 border dark:border-gray-600">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.pengeluaran_setelah_pembelian"
                                        @input="e => onChangeElemenPerbandingan('pengeluaran_setelah_pembelian', pb.pengeluaran_setelah_pembelian, pbIdx, pb.id)" />
                                </td>
                            </template>

                            <template v-else-if="item.label === 'Kondisi Pasar'">
                                <td class="p-2 border dark:border-gray-600">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.kondisi_pasar"
                                        @input="e => onChangeElemenPerbandingan('kondisi_pasar', pb.kondisi_pasar, pbIdx, pb.id)" />
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
                                {{ pb.penyesuaian || 'Rp 0' }}
                            </td>
                            <td v-else class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                {{ pb.hasil || 'Rp 0' }}

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
                        <!-- Pembanding kosong -->
                        <template v-for="(pb, pbIdx) in item.pembanding" :key="'pb-empty-' + pbIdx">
                            <template v-if="item.label !== 'Perkiraan Harga Transaksi setelah Penyesuaian'">
                                <td class="p-2 border dark:border-gray-600 dark:text-white">&nbsp;</td>
                                <td class="p-2 border dark:border-gray-600">&nbsp;</td>
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ pb.hasil }}
                                </td>
                            </template>

                        </template>


                    </tr>
                </template>
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="11 + (data.object.length * 0) + (data.pembanding.length * 0)">
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
                                {{ pb.deskripsi || '-' }}
                            </td>

                            <!-- Input angka sesuai label -->
                            <td class="p-2 border dark:border-gray-600">
                                <!-- Jarak terhadap pusat kota -->
                                <template v-if="item.label === 'Jarak terhadap pusat kota'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.jarak_pusat_kota"
                                        @input="e => onChangeElemenPerbandinganLokasi('jarak_pusat_kota', pb.jarak_pusat_kota, pbIdx, pb.id)" />
                                </template>

                                <!-- Perkerasan Jalan/Lebar Jalan -->
                                <template v-else-if="item.label === 'Perkerasan Jalan/Lebar Jalan'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.perkerasan_jalan"
                                        @input="e => onChangeElemenPerbandinganLokasi('perkerasan_jalan', pb.perkerasan_jalan, pbIdx, pb.id)" />
                                </template>

                                <!-- Aksesibilitas & Lokasi -->
                                <template v-else-if="item.label === 'Aksesibilitas & Lokasi'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.aksesibilitas_lokasi"
                                        @input="e => onChangeElemenPerbandinganLokasi('aksesibilitas_lokasi', pb.aksesibilitas_lokasi, pbIdx, pb.id)" />
                                </template>

                                <!-- Kondisi Lingkungan -->
                                <template v-else-if="item.label === 'Kondisi Lingkungan'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.kondisi_lingkungan"
                                        @input="e => onChangeElemenPerbandinganLokasi('kondisi_lingkungan', pb.kondisi_lingkungan, pbIdx, pb.id)" />
                                </template>

                                <!-- Posisi Aset -->
                                <template v-else-if="item.label === 'Posisi Aset'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.posisi_aset"
                                        @input="e => onChangeElemenPerbandinganLokasi('posisi_aset', pb.posisi_aset, pbIdx, pb.id)" />
                                </template>

                                <!-- Lainnya (Sebutkan) -->
                                <template v-else-if="item.label === 'Lainnya (Sebutkan)'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.lainnya"
                                        @input="e => onChangeElemenPerbandinganLokasi('lainnya', pb.lainnya, pbIdx, pb.id)" />
                                </template>

                                <!-- Perkiraan Harga Transaksi setelah Penyesuaian (readonly) -->
                                <template v-else-if="item.label === 'Perkiraan Harga Transaksi setelah Penyesuaian'">
                                    <span class="dark:text-white">
                                        {{ pb.hasil || '-' }}
                                    </span>
                                </template>
                            </td>

                            <!-- Kanan -->
                            <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                {{ pb.penyesuaian || '-' }}
                            </td>
                        </template>



                    </tr>

                    <!-- Baris tambahan dengan sekat lurus -->

                </template>
                <tr class="bg-gray-100 dark:bg-gray-700 font-bold">
                    <td class="p-2 border dark:border-gray-600 dark:text-white"
                        :colspan="11 + (data.object.length * 0) + (data.pembanding.length * 0)">
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
                                {{ pb.deskripsi || '-' }}
                            </td>

                            <!-- Input angka sesuai label -->
                            <td class="p-2 border dark:border-gray-600">
                                <!-- Luas Tanah -->
                                <template v-if="item.label === 'Luas Tanah'">
                                    -
                                </template>

                                <!-- Luas Bangunan -->
                                <template v-else-if="item.label === 'Luas Bangunan'">
                                    -
                                </template>

                                <!-- Bentuk -->
                                <template v-else-if="item.label === 'Bentuk'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.bentuk"
                                        @input="e => onChangeElemenPerbandinganKarakteristikFisik('bentuk', pb.bentuk, pbIdx, pb.id)" />
                                </template>

                                <!-- Elevasi -->
                                <template v-else-if="item.label === 'Elevasi'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.elevasi"
                                        @input="e => onChangeElemenPerbandinganKarakteristikFisik('elevasi', pb.elevasi, pbIdx, pb.id)" />
                                </template>

                                <!-- Topografi -->
                                <template v-else-if="item.label === 'Topografi'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.topografi"
                                        @input="e => onChangeElemenPerbandinganKarakteristikFisik('topografi', pb.topografi, pbIdx, pb.id)" />
                                </template>

                                <!-- Lebar Muka -->
                                <template v-else-if="item.label === 'Lebar Muka'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.lebar_muka"
                                        @input="e => onChangeElemenPerbandinganKarakteristikFisik('lebar_muka', pb.lebar_muka, pbIdx, pb.id)" />
                                </template>

                                <!-- Peruntukan -->
                                <template v-else-if="item.label === 'Peruntukan'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.peruntukan"
                                        @input="e => onChangeElemenPerbandinganKarakteristikFisik('peruntukan', pb.peruntukan, pbIdx, pb.id)" />
                                </template>

                                <!-- Kondisi Bangunan -->
                                <template v-else-if="item.label === 'Kondisi Bangunan'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.kondisi_bangunan"
                                        @input="e => onChangeElemenPerbandinganKarakteristikFisik('kondisi_bangunan', pb.kondisi_bangunan, pbIdx, pb.id)" />
                                </template>

                                <!-- Lainnya -->
                                <template v-else-if="item.label === 'Lainnya (Sebutkan)'">
                                    <input type="number" step="0.01" class="w-full rounded p-1"
                                        v-model.number="pb.lainnya"
                                        @input="e => onChangeElemenPerbandinganKarakteristikFisik('lainnya', pb.lainnya, pbIdx, pb.id)" />
                                </template>

                                <!-- Default (kalau tidak ada) -->
                                <template v-else>
                                    <span class="dark:text-white">-</span>
                                </template>
                            </td>

                            <!-- Kanan -->
                            <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                {{ pb.penyesuaian || '-' }}
                            </td>
                        </template>




                    </tr>

                    <!-- Baris tambahan dengan sekat lurus -->


                </template>
                <br>
                <template v-for="item in dataSummaryPasar" :key="item.label">
                    <!-- Baris utama -->
                    <tr>
                        <!-- Label -->
                        <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                            {{ item.label }}
                        </td>

                        <!-- Objects -->
                        <template v-for="(obj, objIdx) in item.objects" :key="'obj-' + objIdx">

                            <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                {{ obj.deskripsi }}
                            </td>
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
                                <td class="p-2 border dark:border-gray-600">
                                    <!-- contoh input / angka -->
                                    {{ pb.totalPersen || '-' }}
                                </td>

                                <!-- Kanan -->
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="2">
                                    {{ pb.totalPenyesuaian || '-' }}
                                </td>
                            </template>

                            <!-- Kalau bukan Jumlah Penyesuaian -->
                            <template v-else>
                                <td class="p-2 border dark:border-gray-600 dark:text-white" colspan="4">
                                    {{ pb.penyesuaian || '-' }}
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
                    <th colspan="3" class="p-2 border text-center font-semibold dark:border-gray-600 dark:text-white">
                        Kesimpulan Nilai
                    </th>
                </tr>
                <tr class="bg-gray-100 text-center dark:bg-gray-800 text-left">
                    <th class="p-2 border dark:border-gray-600 dark:text-white">Data Pembanding</th>
                    <th class="p-2 border dark:border-gray-600 dark:text-white">Bobot</th>
                    <th class="p-2 border dark:border-gray-600 dark:text-white">Nilai</th>
                </tr>
            </thead>
            <tbody v-if="data.conclusions">
                <tr v-for="(item, index) in data.conclusions?.items?.pembanding" :key="'kesimpulan-' + index">
                    <td class="border p-2 dark:border-gray-600 dark:text-white">{{ item.label }}</td>
                    <td class="border p-2 dark:border-gray-600 text-center">{{ item.bobot }}</td>
                    <td class="border p-2 dark:border-gray-600 text-right">{{ item.value }}</td>
                </tr>

                <tr class="bg-gray-50 dark:bg-gray-700 font-semibold">
                    <td class="border p-2 dark:border-gray-600 dark:text-white" colspan="2">
                        Indikasi Nilai Sewa Pasar / m²
                    </td>
                    <td class="border p-2 dark:border-gray-600 text-right">
                        {{ data.conclusions?.indikasi_nilai_m2 }}
                    </td>
                </tr>
                <tr class="bg-gray-50 dark:bg-gray-700 font-semibold">
                    <td class="border p-2 dark:border-gray-600 dark:text-white" colspan="2">
                        Indikasi Nilai Sewa Pasar
                    </td>
                    <td class="border p-2 dark:border-gray-600 text-right">
                        {{ data.conclusions?.indikasi_nilai }}
                    </td>
                </tr>

            </tbody>
        </table>

        <br>
        <table v-if="data.final_summary" class="min-w-full border border-gray-300 text-sm mt-4 text-center">
            <tbody>
                <tr>
                    <td class="border p-2 text-left font-semibold dark:text-white">Deviasi:</td>
                    <td class="border p-2 dark:text-white font-semibold">{{ data.final_summary.deviasi }}</td>
                    <td class="border p-2 font-bold align-middle dark:text-white" rowspan="3">
                        {{ data.final_summary.status }}
                    </td>
                </tr>
                <tr>
                    <td class="border p-2 text-left dark:text-white">Min</td>
                    <td class="border p-2">{{ data.final_summary.min }}</td>
                </tr>
                <tr>
                    <td class="border p-2 text-left">Max</td>
                    <td class="border p-2">{{ data.final_summary.max }}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>
