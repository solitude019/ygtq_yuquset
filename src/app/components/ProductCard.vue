<template>
  <router-link :to="`/products/${product.id}`" class="card group block">
    <div class="aspect-square bg-slate-50 overflow-hidden">
      <img
        :src="product.image_url || 'https://placehold.co/400x400/f8fafc/94a3b8?text=No+Image'"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        @error="handleImageError"
      />
    </div>
    <div class="p-4">
      <span v-if="product.category_name" class="text-xs text-accent font-medium uppercase tracking-wider">
        {{ product.category_name }}
      </span>
      <h3 class="font-heading font-semibold text-primary mt-1 line-clamp-1">
        {{ product.name }}
      </h3>
      <div class="flex items-center justify-between mt-2">
        <span class="text-lg font-bold text-accent">${{ formatPrice(product.price) }}</span>
        <span class="text-xs text-slate-400">#{{ product.product_no }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Product } from '../api';

const props = defineProps<{
  product: Product;
}>();

function formatPrice(price: number): string {
  return Number(price).toFixed(2);
}

function handleImageError(e: Event): void {
  const target = e.target as HTMLImageElement;
  target.src = 'https://placehold.co/400x400/f8fafc/94a3b8?text=No+Image';
}
</script>
