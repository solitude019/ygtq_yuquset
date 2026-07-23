<template>
  <footer class="bg-primary text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span class="text-white font-heading font-bold text-sm">AB</span>
            </div>
            <span class="font-heading font-bold text-xl tracking-tight">APEX BALL</span>
          </div>
          <p class="text-slate-400 text-sm leading-relaxed">
            Professional ball sports equipment for athletes worldwide. Quality you can trust, performance you can feel.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="font-heading font-semibold text-lg mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.to">
              <router-link :to="link.to" class="text-slate-400 hover:text-accent text-sm transition-colors">
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="font-heading font-semibold text-lg mb-4">Contact Us</h3>
          <ul class="space-y-2 text-sm text-slate-400">
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              support@apexball.com
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              New York, NY 10001
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
        &copy; {{ currentYear }} APEX BALL. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About Us', to: '/about' },
];
</script>
