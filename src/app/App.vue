<template>
  <div class="min-h-screen flex flex-col font-body">
    <NavBar v-if="!isAdminRoute" />
    <main class="flex-1" :class="{ 'pt-[104px]': !isAdminRoute }">
      <router-view />
    </main>
    <FooterSection v-if="!isAdminRoute" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
import FooterSection from './components/FooterSection.vue';

const route = useRoute();
const isAdminRoute = computed(() => route.path.startsWith('/admin'));
</script>
