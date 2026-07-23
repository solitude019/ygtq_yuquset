<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-primary text-white overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary opacity-90"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div class="max-w-2xl">
          <h1 class="font-heading font-black text-4xl md:text-6xl leading-tight">
            Elevate Your
            <span class="text-accent">Game</span>
          </h1>
          <p class="mt-6 text-lg text-slate-300 leading-relaxed">
            Professional-grade ball sports equipment engineered for peak performance. From the court to the field, trust APEX BALL to deliver excellence.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <router-link to="/products" class="btn-primary text-base px-8 py-3">
              Shop Now
            </router-link>
            <router-link to="/about" class="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary text-base px-8 py-3">
              Learn More
            </router-link>
          </div>
        </div>
      </div>
      <!-- Decorative elements -->
      <div class="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl"></div>
    </section>

    <!-- Categories Section -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="font-heading font-bold text-3xl text-primary">Shop by Category</h2>
          <p class="mt-3 text-slate-500">Find the perfect ball for your sport</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <router-link
            v-for="cat in categories"
            :key="cat.id"
            :to="`/products?category=${cat.id}`"
            class="bg-white rounded-xl p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
          >
            <div class="w-12 h-12 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-white transition-colors text-accent">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
              </svg>
            </div>
            <span class="font-heading font-semibold text-sm text-primary">{{ cat.name }}</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-12">
          <div>
            <h2 class="font-heading font-bold text-3xl text-primary">Featured Products</h2>
            <p class="mt-3 text-slate-500">Our latest professional equipment</p>
          </div>
          <router-link to="/products" class="hidden sm:inline-flex items-center gap-1 text-accent hover:text-accent-dark font-medium text-sm transition-colors">
            View All
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>

        <div v-if="loading" class="text-center py-12">
          <p class="text-slate-400">Loading products...</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>

        <div class="mt-8 text-center sm:hidden">
          <router-link to="/products" class="btn-primary">View All Products</router-link>
        </div>
      </div>
    </section>

    <!-- Trust Banner -->
    <section class="py-16 bg-primary text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label">
            <div class="font-heading font-bold text-3xl text-accent">{{ stat.value }}</div>
            <div class="mt-2 text-slate-400 text-sm">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiClient, type Product, type Category } from '../api';
import ProductCard from '../components/ProductCard.vue';

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);

const featuredProducts = ref<Product[]>([]);

const stats = [
  { value: '50+', label: 'Professional Products' },
  { value: '30+', label: 'Countries Served' },
  { value: '10K+', label: 'Happy Athletes' },
];

onMounted(async () => {
  try {
    const [productsData, categoriesData] = await Promise.all([
      apiClient.getProducts(),
      apiClient.getCategories(),
    ]);
    products.value = productsData;
    categories.value = categoriesData;
    featuredProducts.value = productsData.slice(0, 6);
  } catch (err) {
    console.error('Failed to load data:', err);
  } finally {
    loading.value = false;
  }
});
</script>
