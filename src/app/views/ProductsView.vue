<template>
  <div class="bg-[#F5F5F5] min-h-screen">
    <!-- Page Header -->
    <div class="bg-[#0A0A0A] text-white py-12">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-heading font-black text-3xl">PRODUCTS</h1>
        <p class="mt-2 text-gray-400 text-sm">Browse our complete collection of professional ball sports equipment</p>
      </div>
    </div>

    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="lg:w-64 shrink-0">
          <div class="bg-white rounded-lg p-6 sticky top-32">
            <h3 class="font-heading font-bold text-sm text-[#1A1A1A] uppercase tracking-wider mb-4">Categories</h3>
            <div class="space-y-1">
              <button
                class="w-full text-left px-3 py-2 rounded text-sm transition-colors"
                :class="!selectedCategory ? 'bg-[#DC2626] text-white font-semibold' : 'text-[#666] hover:bg-gray-50'"
                @click="selectedCategory = null"
              >
                All Products
              </button>
              <button
                v-for="cat in categories"
                :key="cat.id"
                class="w-full text-left px-3 py-2 rounded text-sm transition-colors"
                :class="selectedCategory === cat.id ? 'bg-[#DC2626] text-white font-semibold' : 'text-[#666] hover:bg-gray-50'"
                @click="selectedCategory = cat.id"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>
        </aside>

        <!-- Product Grid -->
        <div class="flex-1">
          <!-- Sort Bar -->
          <div class="flex items-center justify-between mb-6 bg-white rounded-lg px-4 py-3">
            <span class="text-sm text-[#666]">{{ filteredProducts.length }} products</span>
            <select v-model="sortBy" class="text-sm border border-gray-200 rounded px-3 py-1.5 text-[#1A1A1A] focus:outline-none focus:border-[#DC2626]">
              <option value="default">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="text-center py-16">
            <p class="text-[#999]">Loading products...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="sortedProducts.length === 0" class="text-center py-16 bg-white rounded-lg">
            <p class="text-[#999]">No products found</p>
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <ProductCard v-for="product in sortedProducts" :key="product.id" :product="product" />
          </div>
        </div>
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
const sortBy = ref('default');

const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value;
  return products.value.filter(p => p.category_id === selectedCategory.value);
});

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value];
  switch (sortBy.value) {
    case 'price-asc': return list.sort((a, b) => Number(a.price) - Number(b.price));
    case 'price-desc': return list.sort((a, b) => Number(b.price) - Number(a.price));
    case 'name': return list.sort((a, b) => a.name.localeCompare(b.name));
    default: return list;
  }
});

watch(selectedCategory, (val) => {
  if (val) {
    router.replace({ query: { category: String(val) } });
  } else {
    router.replace({ query: {} });
  }
});

onMounted(async () => {
  try {
    const [productsData, categoriesData] = await Promise.all([
      apiClient.getProducts(),
      apiClient.getCategories(),
    ]);
    products.value = productsData;
    categories.value = categoriesData;

    const catParam = route.query.category;
    if (catParam) {
      selectedCategory.value = Number(catParam);
    }
  } catch (err) {
    console.error('Failed to load data:', err);
  } finally {
    loading.value = false;
  }
});
</script>
