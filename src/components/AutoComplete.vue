<script setup>
import { CountryService } from "@/service/CountryService";
import { onMounted, ref } from "vue";

// State
const countries = ref([]);
const selectedCountry = ref(null);
const filteredCountries = ref([]);

// Fetch countries on mount
onMounted(async () => {
    try {
        const data = await CountryService.getCountries();
        countries.value = data;
        filteredCountries.value = [...countries.value]; // Initialize the filter with all countries
    } catch (error) {
        console.error("Failed to fetch countries:", error);
    }
});

// Search function for filtering countries
const search = (event) => {
    const query = event.query.trim().toLowerCase();

    // Filtering countries based on user input
    if (!query.length) {
        filteredCountries.value = [...countries.value];  // Show all countries if query is empty
    } else {
        filteredCountries.value = countries.value.filter((country) =>
            country.name.toLowerCase().startsWith(query)
        );
    }
}
</script>
<template>
    <div class="card flex justify-center">
        <AutoComplete v-model="selectedCountry" optionLabel="name" :suggestions="filteredCountries"
            @complete="search" />
    </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>