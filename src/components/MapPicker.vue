<script setup>
import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { ref, watch } from 'vue'

const props = defineProps({
     /**  "lat,lng" string, e.g. "-6.200,106.816"  */
     modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'address'])

const [lat, lng] = props.modelValue.split(',').map(Number)
const center = ref(!isNaN(lat) && !isNaN(lng) ? [lat, lng] : [-7.783, 110.383])
const zoom = ref(15)

watch(() => props.modelValue, v => {
     const [la, lg] = v.split(',').map(Number)
     if (!isNaN(la) && !isNaN(lg)) center.value = [la, lg]
})

async function onMapClick(e) {
     const { lat, lng } = e.latlng
     const value = `${lat},${lng}`
     emit('update:modelValue', value)

     /* --- reverse-geocode via public Nominatim endpoint --- */
     try {
          const res = await fetch(
               `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
               { headers: { 'User-Agent': 'your-app-name' } }   // comply with usage policy
          )
          if (res.ok) {
               const json = await res.json()
               emit('address', json.display_name ?? '')
          }
     } catch (err) {
          console.error(err)
     }
}
</script>

<template>
     <LMap :zoom="zoom" :center="center" style="height:300px" @click="onMapClick" :use-global-leaflet="false">
          <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
          <LMarker :lat-lng="center" />
     </LMap>
</template>
