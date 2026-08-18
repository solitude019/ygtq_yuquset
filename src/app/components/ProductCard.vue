<template>
  <router-link
    :to="`/products/${product.id}`"
    class="group bg-white rounded-lg overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1"
  >
    <!-- Image -->
    <div class="relative aspect-square bg-[#F5F5F5] overflow-hidden">
      <img
        :src="product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        @error="handleImageError"
      />
      <div v-if="product.category_name" class="absolute top-3 left-3 bg-[#0A0A0A] text-white text-xs font-semibold px-2 py-1 rounded">
        {{ product.category_name }}
      </div>
    </div>
    <!-- Info -->
    <div class="p-4">
      <p class="text-xs text-[#999] mb-1">{{ product.product_no }}</p>
      <h3 class="font-heading font-bold text-sm text-[#1A1A1A] group-hover:text-[#F97316] transition-colors line-clamp-2 leading-tight">
        {{ product.name }}
      </h3>
      <div class="mt-3 flex items-center justify-between">
        <span class="font-heading font-black text-lg text-[#F97316]">${{ formatPrice(product.price) }}</span>
        <span v-if="product.stock > 0" class="text-xs text-[#10B981] font-medium">In Stock</span>
        <span v-else class="text-xs text-[#EF4444] font-medium">Out of Stock</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Product } from '../api';

const props = defineProps<{
  product: Product;
}>();

function formatPrice(price: number | string): string {
  return Number(price).toFixed(2);
}

function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.src = 'https://via.placeholder.com/400x400?text=No+Image';
}
</script>
