<template>
  <div class="pt-20 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-24">
        <p class="text-slate-400">Loading product details...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-24">
        <p class="text-red-500 text-lg">{{ error }}</p>
        <router-link to="/products" class="btn-primary mt-6 inline-block">Back to Products</router-link>
      </div>

      <!-- Product Detail -->
      <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image -->
        <div class="bg-slate-50 rounded-2xl overflow-hidden aspect-square">
          <img
            :src="product.image_url || 'https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image'"
            :alt="product.name"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>

        <!-- Info -->
        <div class="flex flex-col justify-center">
          <span v-if="product.category_name" class="text-sm text-accent font-medium uppercase tracking-wider">
            {{ product.category_name }}
          </span>
          <h1 class="font-heading font-bold text-3xl md:text-4xl text-primary mt-2">
            {{ product.name }}
          </h1>
          <p class="text-sm text-slate-400 mt-2">Product No: {{ product.product_no }}</p>

          <div class="mt-6">
            <span class="text-4xl font-bold text-accent">${{ formatPrice(product.price) }}</span>
          </div>

          <div class="mt-4 flex items-center gap-2">
            <span :class="['inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium', product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700']">
              <span :class="['w-2 h-2 rounded-full', product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500']"></span>
              {{ product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock' }}
            </span>
          </div>

          <div class="mt-8">
            <h3 class="font-heading font-semibold text-lg text-primary mb-3">Description</h3>
            <p class="text-slate-600 leading-relaxed">{{ product.description || 'No description available.' }}</p>
          </div>

          <div class="mt-8 flex gap-4">
            <router-link to="/products" class="btn-outline">
              Back to Products
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient, type Product } from '../api';

const route = useRoute();
const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

function formatPrice(price: number): string {
  return Number(price).toFixed(2);
}

function handleImageError(e: Event): void {
  const target = e.target as HTMLImageElement;
  target.src = 'https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image';
}

onMounted(async () => {
  const id = parseInt(route.params.id as string, 10);
  try {
    product.value = await apiClient.getProduct(id);
  } catch (err) {
    error.value = 'Product not found or failed to load.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
