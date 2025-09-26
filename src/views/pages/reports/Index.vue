<!-- This page for show the data of reports exists the pin of coordintas in radius  -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup, LCircle } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

// Flag to control when map should be rendered
const isLeafletReady = ref(false)

// Initialize Leaflet properly
onMounted(async () => {
  try {
    // Import Leaflet dynamically
    const L = await import('leaflet')
    
    // Fix the icon issue that vue-leaflet expects
    if (L.Icon && L.Icon.Default) {
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
      })
    }
    
    // Set the flag to render the map
    isLeafletReady.value = true
  } catch (error) {
    console.error('Error loading Leaflet:', error)
  }
})

const props = ref({
    configs: {
     initial_coords: {
        lat: -6.200000,
        lng: 106.816666
     },
     radius: 1000, // radius in meters
    },
    objects: [
     {
          name: "Location A",
          id: 1,
          price: 100,
          address: "Jl. Example No.1",
          type: "bangunan",
          coords: { lat: -6.201000, lng: 106.817000 },
     },
     {
          name: "Location B",
          id: 2,
          price: 200,
          address: "Jl. Example No.2",
          type: "tanah",
          coords: { lat: -6.202000, lng: 106.818000 },
     },
     {
          name: "Location C",
          id: 3,
          price: 150,
          address: "Jl. Example No.3",
          type: "bangunan",
          coords: { lat: -6.210000, lng: 106.820000 },
     },
    ]
})

// Map settings
const zoom = ref(13)
const mapCenter = ref([props.value.configs.initial_coords.lat, props.value.configs.initial_coords.lng])

// Editable coordinates and radius
const editableCoords = ref({
  lat: props.value.configs.initial_coords.lat,
  lng: props.value.configs.initial_coords.lng
})
const editableRadius = ref(props.value.configs.radius / 1000) // Convert to KM for display

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c * 1000 // Return distance in meters
}

// Filter objects within radius
const filteredObjects = computed(() => {
  return props.value.objects.filter(obj => {
    const distance = calculateDistance(
      editableCoords.value.lat,
      editableCoords.value.lng,
      obj.coords.lat,
      obj.coords.lng
    )
    return distance <= (editableRadius.value * 1000) // Convert KM to meters
  })
})

// Update map center when coordinates change
watch(editableCoords, (newCoords) => {
  mapCenter.value = [newCoords.lat, newCoords.lng]
}, { deep: true })

// Format price to Indonesian Rupiah
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price * 1000000) // Assuming price is in millions
}
</script>

<template>
    <div class="card">
        <div class="card-header">
            <h5 class="card-title mb-0">Location Reports with Radius Filter</h5>
        </div>
        <div class="card-body">
            <!-- Controls Panel -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div class="flex flex-col">
                    <label class="text-sm font-medium mb-2">Latitude</label>
                    <InputNumber 
                        v-model="editableCoords.lat" 
                        :step="0.000001"
                        :min-fraction-digits="6"
                        :max-fraction-digits="6"
                        class="w-full"
                    />
                </div>
                <div class="flex flex-col">
                    <label class="text-sm font-medium mb-2">Longitude</label>
                    <InputNumber 
                        v-model="editableCoords.lng" 
                        :step="0.000001"
                        :min-fraction-digits="6"
                        :max-fraction-digits="6"
                        class="w-full"
                    />
                </div>
                <div class="flex flex-col">
                    <label class="text-sm font-medium mb-2">Radius (KM)</label>
                    <InputNumber 
                        v-model="editableRadius" 
                        :step="0.1"
                        :min="0.1"
                        :max="50"
                        suffix=" KM"
                        class="w-full"
                    />
                </div>
            </div>

            <!-- Map Container -->
            <div class="map-container mb-4" style="height: 600px; border-radius: 8px; overflow: hidden;">
                <!-- Loading state -->
                <div v-if="!isLeafletReady" class="flex items-center justify-center h-full bg-gray-100">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p class="text-gray-600">Loading map...</p>
                    </div>
                </div>
                
                <!-- Map -->
                <LMap
                    v-if="isLeafletReady"
                    :zoom="zoom"
                    :center="mapCenter"
                    style="height: 100%; width: 100%;"
                >
                    <LTileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    />
                    
                    <!-- Radius Circle -->
                    <LCircle
                        :lat-lng="[editableCoords.lat, editableCoords.lng]"
                        :radius="editableRadius * 1000"
                        :color="'#3b82f6'"
                        :fill-color="'#3b82f6'"
                        :fill-opacity="0.1"
                        :weight="2"
                    />
                    
                    <!-- Center Marker -->
                    <LMarker :lat-lng="[editableCoords.lat, editableCoords.lng]">
                        <LPopup>
                            <div class="text-center">
                                <strong>Center Point</strong><br>
                                Lat: {{ editableCoords.lat.toFixed(6) }}<br>
                                Lng: {{ editableCoords.lng.toFixed(6) }}<br>
                                Radius: {{ editableRadius }} KM
                            </div>
                        </LPopup>
                    </LMarker>
                    
                    <!-- Object Markers -->
                    <LMarker
                        v-for="obj in filteredObjects"
                        :key="obj.id"
                        :lat-lng="[obj.coords.lat, obj.coords.lng]"
                    >
                        <LPopup>
                            <div class="min-w-48">
                                <h6 class="font-bold text-lg mb-2">{{ obj.name }}</h6>
                                <div class="space-y-1 text-sm">
                                    <p><strong>Type:</strong> 
                                        <span class="inline-flex px-2 py-1 text-xs rounded-full" 
                                              :class="obj.type === 'tanah' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                                            {{ obj.type === 'tanah' ? 'Tanah' : 'Bangunan' }}
                                        </span>
                                    </p>
                                    <p><strong>Price:</strong> {{ formatPrice(obj.price) }}</p>
                                    <p><strong>Address:</strong> {{ obj.address }}</p>
                                    <p><strong>Coordinates:</strong> {{ obj.coords.lat }}, {{ obj.coords.lng }}</p>
                                </div>
                            </div>
                        </LPopup>
                    </LMarker>
                </LMap>
            </div>

            <!-- Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ props.objects.length }}</div>
                    <div class="text-sm text-blue-800">Total Objects</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-600">{{ filteredObjects.length }}</div>
                    <div class="text-sm text-green-800">Objects in Radius</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-orange-600">{{ editableRadius }} KM</div>
                    <div class="text-sm text-orange-800">Current Radius</div>
                </div>
            </div>

            <!-- Objects List -->
            <div class="mt-6">
                <h6 class="font-semibold mb-3">Objects in Radius ({{ filteredObjects.length }})</h6>
                <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div v-for="obj in filteredObjects" :key="obj.id" 
                         class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <i :class="obj.type === 'tanah' ? 'pi pi-map-marker text-green-500' : 'pi pi-home text-blue-500'"></i>
                            <div>
                                <div class="font-medium">{{ obj.name }}</div>
                                <div class="text-sm text-gray-600">{{ obj.address }}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="font-semibold">{{ formatPrice(obj.price) }}</div>
                            <div class="text-xs text-gray-500">{{ obj.type === 'tanah' ? 'Tanah' : 'Bangunan' }}</div>
                        </div>
                    </div>
                    <div v-if="filteredObjects.length === 0" class="text-center text-gray-500 py-4">
                        No objects found within the specified radius
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-div-icon {
    background: transparent;
    border: none;
}

.map-container {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>