<template>
  <div class="pt-20 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="font-heading font-bold text-3xl text-primary">All Products</h1>
        <p class="mt-2 text-slate-500">Browse our complete collection of professional ball sports equipment</p>
      </div>

      <!-- Category Filter -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            !selectedCategory
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
          @click="selectedCategory = null"
        >
          All
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            selectedCategory === cat.id
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
          @click="selectedCategory = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Products Grid -->
      <div v-if="loading" class="text-center py-16">
        <p class="text-slate-400">Loading products...</p>
      </div>
      <div v-else-if="filteredProducts.length === 0" class="text-center py-16">
        <p class="text-slate-400 text-lg">No products found in this category.</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiClient, type Product, type Category } from '../api';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const router = useRouter();
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);
const selectedCategory = ref<number | null>(null);

const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value;
  return products.value.filter(p => p.category_id === selectedCategory.value);
});

// Read category from URL query
onMounted(async () => {
  const catParam = route.query.category;
  if (catParam) {
    selectedCategory.value = parseInt(catParam as string, 10);
  }

  try {
    const [productsData, categoriesData] = await Promise.all([
      apiClient.getProducts(),
      apiClient.getCategories(),
    ]);
    products.value = productsData;
    categories.value = categoriesData;
  } catch (err) {
    console.error('Failed to load data:', err);
  } finally {
    loading.value = false;
  }
});

// Update URL when category changes
watch(selectedCategory, (val) => {
  if (val) {
    router.replace({ query: { category: val.toString() } });
  } else {
    router.replace({ query: {} });
  }
});
</script>
