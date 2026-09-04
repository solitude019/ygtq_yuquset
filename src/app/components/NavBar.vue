<template>
  <header class="fixed top-0 left-0 right-0 z-50">
    <!-- Top Bar - Black -->
    <div class="bg-[#0A0A0A] text-white">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-10 text-xs">
          <div class="flex items-center gap-4">
            <span class="text-gray-400">Professional Ball Sports Equipment</span>
          </div>
          <div class="hidden sm:flex items-center gap-4 text-gray-400">
            <router-link to="/admin" class="hover:text-white transition-colors">Admin</router-link>
            <span>|</span>
            <span>EN</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Nav - White -->
    <div class="bg-white shadow-sm">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-3 shrink-0">
            <div class="w-10 h-10 rounded bg-[#DC2626] flex items-center justify-center">
              <span class="font-heading font-black text-white text-lg leading-none">Yu</span>
            </div>
            <div class="flex flex-col">
              <span class="font-heading font-black text-xl text-[#1A1A1A] tracking-tight leading-tight">Yu</span>
              <span class="text-[10px] text-[#999] tracking-widest leading-tight">SPORTS EQUIPMENT</span>
            </div>
          </router-link>

          <!-- Desktop Nav Links -->
          <nav class="hidden md:flex items-center gap-1">
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="relative px-4 py-5 text-sm font-semibold text-[#1A1A1A] hover:text-[#DC2626] transition-colors"
              active-class="!text-[#DC2626]"
            >
              {{ item.label }}
              <span
                v-if="isActive(item.to)"
                class="absolute bottom-0 left-4 right-4 h-0.5 bg-[#DC2626]"
              ></span>
            </router-link>
          </nav>

          <!-- Right Actions -->
          <div class="flex items-center gap-3">
            <button class="hidden sm:flex items-center justify-center w-9 h-9 rounded hover:bg-gray-100 transition-colors text-[#666]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            <!-- Mobile menu button -->
            <button
              class="md:hidden flex items-center justify-center w-9 h-9 rounded hover:bg-gray-100 transition-colors text-[#666]"
              @click="mobileOpen = !mobileOpen"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Nav -->
        <div v-if="mobileOpen" class="md:hidden pb-4 border-t border-gray-100">
          <div class="flex flex-col gap-1 pt-2">
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="text-sm font-semibold text-[#1A1A1A] hover:text-[#DC2626] py-3 px-4 rounded hover:bg-gray-50 transition-colors"
              active-class="!text-[#DC2626] !bg-red-50"
              @click="mobileOpen = false"
            >
              {{ item.label }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const mobileOpen = ref(false);

const navItems = [
  { label: 'HOME', to: '/' },
  { label: 'PRODUCTS', to: '/products' },
  { label: 'ABOUT', to: '/about' },
];

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
}
</script>
