<template>
  <footer class="bg-[#0A0A0A] text-white">
    <!-- Main Footer -->
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-[#DC2626] rounded flex items-center justify-center">
              <span class="text-white font-heading font-black text-lg">A</span>
            </div>
            <div>
              <div class="font-heading font-black text-lg leading-tight">APEX BALL</div>
              <div class="text-[10px] text-gray-500 tracking-widest">SPORTS EQUIPMENT</div>
            </div>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed">Professional ball sports equipment engineered for peak performance. Trusted by athletes worldwide.</p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-heading font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li><router-link to="/" class="text-gray-400 hover:text-[#DC2626] text-sm transition-colors">Home</router-link></li>
            <li><router-link to="/products" class="text-gray-400 hover:text-[#DC2626] text-sm transition-colors">Products</router-link></li>
            <li><router-link to="/about" class="text-gray-400 hover:text-[#DC2626] text-sm transition-colors">About Us</router-link></li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h4 class="font-heading font-bold text-sm uppercase tracking-wider mb-4">Categories</h4>
          <ul class="space-y-2">
            <li v-for="cat in categories" :key="cat.id">
              <router-link :to="`/products?category=${cat.id}`" class="text-gray-400 hover:text-[#DC2626] text-sm transition-colors">{{ cat.name }}</router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-heading font-bold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
          <ul class="space-y-3">
            <li class="flex items-center gap-2 text-gray-400 text-sm">
              <svg class="w-4 h-4 shrink-0 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              info@apexball.com
            </li>
            <li class="flex items-center gap-2 text-gray-400 text-sm">
              <svg class="w-4 h-4 shrink-0 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              +1 (555) 123-4567
            </li>
            <li class="flex items-start gap-2 text-gray-400 text-sm">
              <svg class="w-4 h-4 shrink-0 text-[#DC2626] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              123 Sports Avenue, New York, NY 10001
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="text-gray-500 text-xs">&copy; 2024 APEX BALL. All rights reserved.</p>
        <div class="flex items-center gap-4 text-gray-500 text-xs">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiClient, type Category } from '../api';

const categories = ref<Category[]>([]);

onMounted(async () => {
  try {
    categories.value = await apiClient.getCategories();
  } catch {
    // silent
  }
});
</script>
