<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span class="text-white font-heading font-bold text-sm">AB</span>
          </div>
          <span class="font-heading font-bold text-xl text-primary tracking-tight">APEX BALL</span>
        </router-link>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-8">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="text-sm font-medium text-slate-600 hover:text-accent transition-colors duration-200"
            active-class="!text-accent"
          >
            {{ item.label }}
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden p-2 text-slate-600 hover:text-primary"
          @click="mobileOpen = !mobileOpen"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Nav -->
      <div v-if="mobileOpen" class="md:hidden pb-4 border-t border-slate-100">
        <div class="flex flex-col gap-2 pt-4">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="text-sm font-medium text-slate-600 hover:text-accent py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
            active-class="!text-accent !bg-orange-50"
            @click="mobileOpen = false"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const mobileOpen = ref(false);

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/about' },
];
</script>
