<template>
  <div class="bg-white min-h-screen">
    <!-- Breadcrumb -->
    <div class="bg-[#F5F5F5] py-3">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2 text-xs text-[#999]">
          <router-link to="/" class="hover:text-[#DC2626]">Home</router-link>
          <span>/</span>
          <router-link to="/products" class="hover:text-[#DC2626]">Products</router-link>
          <span>/</span>
          <span class="text-[#1A1A1A]">{{ product?.name || '...' }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <p class="text-[#999]">Loading...</p>
    </div>

    <div v-else-if="!product" class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <p class="text-[#999]">Product not found</p>
      <router-link to="/products" class="mt-4 inline-block text-[#DC2626] font-semibold hover:underline">Back to Products</router-link>
    </div>

    <div v-else class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <!-- Product Image -->
        <div class="bg-[#F5F5F5] rounded-lg aspect-square overflow-hidden">
          <img
            :src="product.image_url || 'https://via.placeholder.com/600x600?text=No+Image'"
            :alt="product.name"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>

        <!-- Product Info -->
        <div class="flex flex-col">
          <div class="flex items-center gap-3 mb-3">
            <span v-if="product.category_name" class="bg-[#0A0A0A] text-white text-xs font-semibold px-3 py-1 rounded">{{ product.category_name }}</span>
            <span class="text-xs text-[#999]">SKU: {{ product.product_no }}</span>
          </div>

          <h1 class="font-heading font-black text-2xl md:text-3xl text-[#1A1A1A]">{{ product.name }}</h1>

          <div class="mt-4 flex items-baseline gap-3">
            <span class="font-heading font-black text-3xl text-[#DC2626]">${{ formatPrice(product.price) }}</span>
            <span v-if="product.stock > 0" class="text-sm text-[#10B981] font-semibold bg-green-50 px-2 py-0.5 rounded">In Stock ({{ product.stock }})</span>
            <span v-else class="text-sm text-[#EF4444] font-semibold bg-red-50 px-2 py-0.5 rounded">Out of Stock</span>
          </div>

          <div class="mt-6 border-t border-gray-100 pt-6">
            <h3 class="font-heading font-bold text-sm text-[#1A1A1A] uppercase tracking-wider mb-3">Product Description</h3>
            <p class="text-[#666] leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Specs Table -->
          <div class="mt-6 border-t border-gray-100 pt-6">
            <h3 class="font-heading font-bold text-sm text-[#1A1A1A] uppercase tracking-wider mb-3">Specifications</h3>
            <table class="w-full text-sm">
              <tbody>
                <tr class="border-b border-gray-50">
                  <td class="py-2.5 text-[#999] w-32">Product No.</td>
                  <td class="py-2.5 text-[#1A1A1A] font-medium">{{ product.product_no }}</td>
                </tr>
                <tr class="border-b border-gray-50">
                  <td class="py-2.5 text-[#999]">Category</td>
                  <td class="py-2.5 text-[#1A1A1A] font-medium">{{ product.category_name || '-' }}</td>
                </tr>
                <tr class="border-b border-gray-50">
                  <td class="py-2.5 text-[#999]">Price</td>
                  <td class="py-2.5 text-[#DC2626] font-bold">${{ formatPrice(product.price) }}</td>
                </tr>
                <tr>
                  <td class="py-2.5 text-[#999]">Stock</td>
                  <td class="py-2.5 text-[#1A1A1A] font-medium">{{ product.stock }} units</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-8 flex gap-4">
            <router-link to="/products" class="flex-1 text-center bg-[#0A0A0A] hover:bg-[#333] text-white font-semibold py-3 rounded transition-colors">
              BACK TO PRODUCTS
            </router-link>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mt-16 border-t border-gray-100 pt-12">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="font-heading font-bold text-xl text-[#1A1A1A]">RELATED PRODUCTS</h2>
            <div class="w-12 h-1 bg-[#DC2626] mt-2"></div>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <ProductCard v-for="p in relatedProducts" :key="p.id" :product="p" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient, type Product } from '../api';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const product = ref<Product | null>(null);
const allProducts = ref<Product[]>([]);
const loading = ref(true);

const relatedProducts = computed(() => {
  if (!product.value) return [];
  return allProducts.value
    .filter(p => p.id !== product.value!.id && p.category_id === product.value!.category_id)
    .slice(0, 4);
});

function formatPrice(price: number | string): string {
  return Number(price).toFixed(2);
}

function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.src = 'https://via.placeholder.com/600x600?text=No+Image';
}

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    const [productData, allData] = await Promise.all([
      apiClient.getProduct(id),
      apiClient.getProducts(),
    ]);
    product.value = productData;
    allProducts.value = allData;
  } catch (err) {
    console.error('Failed to load product:', err);
  } finally {
    loading.value = false;
  }
});
</script>
