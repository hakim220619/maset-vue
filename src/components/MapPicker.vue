<script setup>
import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
    /**  "lat,lng" string, e.g. "-6.200,106.816"  */
    modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'address'])

const [lat, lng] = props.modelValue.split(',').map(Number)
const center = ref(!isNaN(lat) && !isNaN(lng) ? [lat, lng] : [-7.783, 110.383])
const zoom = ref(15)

// Search functionality
const searchQuery = ref('')
const searchResults = ref([])
const showResults = ref(false)
const selectedIndex = ref(-1)



// Computed property for JSON format coordinates
const coordinatesJson = computed(() => {
    if (!props.modelValue) return ''
    const [latitude, longitude] = props.modelValue.split(',').map(Number)
    if (isNaN(latitude) || isNaN(longitude)) return ''

    return JSON.stringify({
        latitude: latitude,
        longitude: longitude
    }, null, 2)
})

watch(() => props.modelValue, v => {
    const [la, lg] = v.split(',').map(Number)
    if (!isNaN(la) && !isNaN(lg)) center.value = [la, lg]
})

// Search locations using Nominatim
async function searchLocations(query) {
    if (query.length < 3) {
        searchResults.value = []
        showResults.value = false
        return
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1&countrycodes=id`,
            { headers: { 'User-Agent': 'your-app-name' } }
        )

        if (response.ok) {
            const data = await response.json()

            // Filter and format results
            const formattedResults = data.map(item => ({
                ...item,
                display_name: item.display_name || 'Unknown Location',
                lat: item.lat || '0',
                lon: item.lon || '0',
                address: item.address || {}
            }))

            searchResults.value = formattedResults
            showResults.value = true // Always show results container, even if empty
        } else {
            searchResults.value = []
            showResults.value = true // Show "not found" message
        }
    } catch (error) {
        searchResults.value = []
        showResults.value = true // Show "not found" message
    }
}

// Handle search input with debouncing
let searchTimeout = null
function handleSearchInput(event) {
    const query = event.target.value
    searchQuery.value = query

    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }

    // Debounce the search
    searchTimeout = setTimeout(() => {
        searchLocations(query)
    }, 300)
}

// Select location from search results
function selectLocation(location) {
    const lat = parseFloat(location.lat)
    const lon = parseFloat(location.lon)

    center.value = [lat, lon]
    zoom.value = 16

    const value = `${lat},${lon}`
    emit('update:modelValue', value)
    emit('address', location.display_name)

    searchQuery.value = location.display_name
    searchResults.value = []
    showResults.value = false
    selectedIndex.value = -1
}

// Handle keyboard navigation
function handleKeydown(event) {
    if (!showResults.value) return

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault()
            selectedIndex.value = Math.min(selectedIndex.value + 1, searchResults.value.length - 1)
            break
        case 'ArrowUp':
            event.preventDefault()
            selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
            break
        case 'Enter':
            event.preventDefault()
            if (selectedIndex.value >= 0 && searchResults.value[selectedIndex.value]) {
                selectLocation(searchResults.value[selectedIndex.value])
            }
            break
        case 'Escape':
            showResults.value = false
            selectedIndex.value = -1
            break
    }
}

// Close search results when clicking outside
function handleClickOutside(event) {
    if (!event.target.closest('.search-container')) {
        showResults.value = false
        selectedIndex.value = -1
    }
}

// Add global click listener when component mounts

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
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
            searchQuery.value = json.display_name ?? ''
        }
    } catch (err) {
        // Silent error handling
    }
}
</script>

<template>
    <div class="map-container">
        <!-- Search Input -->
        <div class="search-container relative p-3 bg-white border-b border-gray-200 mb-5">
            <div class="relative">
                <input type="text" v-model="searchQuery" @input="handleSearchInput" @keydown="handleKeydown"
                    @click="handleClickOutside" placeholder="Search for a location..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <!-- Search Results Dropdown -->
                <div v-if="showResults" class="search-results">
                    <div v-if="searchResults.length > 0"
                        class="px-2 py-1 text-xs text-gray-500 border-b border-gray-200 bg-gray-50">
                        Found {{ searchResults.length }} location(s) - Click to select
                    </div>
                    <div v-else class="px-2 py-1 text-xs text-gray-500 border-b border-gray-200 bg-gray-50">
                        No locations found
                    </div>
                    <div v-for="(result, index) in searchResults" :key="index" @click="selectLocation(result)"
                        @mouseenter="selectedIndex = index" :class="[
                            'px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0',
                            selectedIndex === index ? 'bg-blue-100 text-blue-700' : ''
                        ]">
                        <div class="font-medium text-sm text-gray-900">{{ result.display_name }}</div>
                        <div class="text-xs text-gray-500 mt-1">
                            <span v-if="result.address?.city">{{ result.address.city }}, </span>
                            <span v-if="result.address?.town">{{ result.address.town }}, </span>
                            <span v-if="result.address?.village">{{ result.address.village }}, </span>
                            <span v-if="result.address?.state">{{ result.address.state }}</span>
                            <span
                                v-if="!result.address?.city && !result.address?.town && !result.address?.village && !result.address?.state">
                                {{ result.lat }}, {{ result.lon }}
                            </span>
                        </div>
                    </div>
                    <div v-if="searchResults.length === 0" class="px-3 py-4 text-center text-sm text-gray-500">
                        No locations found for "{{ searchQuery }}"
                    </div>
                </div>

                <!-- Loading indicator -->
                <div v-if="searchQuery.length >= 3 && !showResults"
                    class="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                    <div class="text-sm text-gray-500">Searching...</div>
                </div>
            </div>
        </div>

        <!-- Map -->
        <LMap :zoom="zoom" :center="center" style="height:500px" @click="onMapClick" :use-global-leaflet="false">
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            <LMarker :lat-lng="center" />
        </LMap>

        <!-- Coordinates JSON Display -->
        <div class="mt-3 p-3 bg-gray-50">
            <label class="block text-sm font-medium text-gray-700 mb-1">Coordinates (JSON Format)</label>
            <textarea :value="coordinatesJson" readonly
                class="w-full p-2 border border-gray-300 rounded-md bg-white text-sm font-mono" rows="4"
                placeholder="Click on the map or search for a location to get coordinates in JSON format"></textarea>
        </div>
    </div>
</template>

<style scoped>
.map-container {
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    position: relative;
}

.search-container {
    position: relative;
    z-index: 9999;
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 9999;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    max-height: 240px;
    overflow-y: auto;
}
</style>
