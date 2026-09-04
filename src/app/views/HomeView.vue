<template>
  <div>
    <!-- Hero Banner -->
    <section class="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="absolute inset-0 transition-opacity duration-700"
        :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>
      <!-- Hero Content -->
      <div class="absolute inset-0 z-20 flex items-center">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div class="max-w-xl">
            <p class="text-[#DC2626] font-semibold text-sm tracking-widest uppercase mb-4">{{ currentSlideData.subtitle }}</p>
            <h1 class="font-heading font-black text-4xl md:text-6xl text-white leading-tight">{{ currentSlideData.title }}</h1>
            <p class="mt-4 text-gray-300 text-base md:text-lg leading-relaxed">{{ currentSlideData.desc }}</p>
            <div class="mt-8 flex gap-4">
              <router-link to="/products" class="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold px-8 py-3 rounded transition-colors">
                SHOP NOW
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </router-link>
              <router-link to="/about" class="inline-flex items-center gap-2 border-2 border-white/60 hover:border-white text-white font-semibold px-8 py-3 rounded transition-colors">
                LEARN MORE
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <!-- Slide Indicators -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        <button
          v-for="(_, index) in slides"
          :key="index"
          class="w-8 h-1 rounded-full transition-all duration-300"
          :class="currentSlide === index ? 'bg-[#DC2626]' : 'bg-white/40 hover:bg-white/60'"
          @click="goToSlide(index)"
        ></button>
      </div>
    </section>

    <!-- Category Section -->
    <section class="py-16 bg-white">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="font-heading font-bold text-2xl text-[#1A1A1A]">SHOP BY CATEGORY</h2>
            <div class="w-12 h-1 bg-[#DC2626] mt-2"></div>
          </div>
          <router-link to="/products" class="text-sm font-semibold text-[#666] hover:text-[#DC2626] transition-colors flex items-center gap-1">
            VIEW ALL
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <router-link
            v-for="cat in categories"
            :key="cat.id"
            :to="`/products?category=${cat.id}`"
            class="group bg-[#F5F5F5] rounded-lg p-6 text-center hover:bg-[#DC2626] transition-all duration-300"
          >
            <div class="w-14 h-14 mx-auto bg-white rounded-full flex items-center justify-center mb-3 group-hover:shadow-md transition-shadow">
              <svg class="w-7 h-7 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
                <path stroke-width="1.5" d="M12 2C12 2 14.5 6 14.5 12S12 22 12 22M12 2C12 2 9.5 6 9.5 12S12 22 12 22M2 12h20"/>
              </svg>
            </div>
            <span class="font-heading font-bold text-sm text-[#1A1A1A] group-hover:text-white transition-colors">{{ cat.name }}</span>
            <p class="mt-1 text-xs text-[#999] group-hover:text-white/70 transition-colors hidden sm:block">{{ cat.description }}</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-[#F5F5F5]">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="font-heading font-bold text-2xl text-[#1A1A1A]">FEATURED PRODUCTS</h2>
            <div class="w-12 h-1 bg-[#DC2626] mt-2"></div>
          </div>
          <router-link to="/products" class="text-sm font-semibold text-[#666] hover:text-[#DC2626] transition-colors flex items-center gap-1">
            VIEW ALL
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>

        <div v-if="loading" class="text-center py-12">
          <p class="text-[#999]">Loading products...</p>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>
      </div>
    </section>

    <!-- Brand Stats -->
    <section class="py-16 bg-[#0A0A0A] text-white">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label">
            <div class="font-heading font-black text-4xl text-[#DC2626]">{{ stat.value }}</div>
            <div class="mt-2 text-gray-400 text-sm tracking-wider uppercase">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Promise -->
    <section class="py-16 bg-white">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="font-heading font-bold text-2xl text-[#1A1A1A]">WHY Yu</h2>
          <div class="w-12 h-1 bg-[#DC2626] mt-2 mx-auto"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="text-center p-6">
            <div class="w-16 h-16 mx-auto bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="feature.icon === 'quality'" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                <path v-else-if="feature.icon === 'globe'" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="font-heading font-bold text-lg text-[#1A1A1A] mb-2">{{ feature.title }}</h3>
            <p class="text-[#666] text-sm leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { apiClient, type Product, type Category } from '../api';
import ProductCard from '../components/ProductCard.vue';

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);
const currentSlide = ref(0);
let slideInterval: ReturnType<typeof setInterval> | null = null;

const slides = [
  {
    image: '/images/hero-badminton-1.jpg',
    subtitle: 'Badminton Collection',
    title: 'SMASH WITH POWER',
    desc: 'Professional badminton rackets and shuttlecocks engineered for peak performance on every court.',
  },
  {
    image: '/images/hero-badminton-2.jpg',
    subtitle: 'Speed & Precision',
    title: 'BORN TO FLY',
    desc: 'Experience lightning-fast reflexes with our tournament-grade shuttlecocks. Every shot counts.',
  },
  {
    image: '/images/hero-badminton-3.jpg',
    subtitle: 'Pro Series',
    title: 'STRINGED FOR VICTORY',
    desc: 'Carbon-fiber rackets with ultra-responsive string beds. Trusted by championship players worldwide.',
  },
];

const currentSlideData = computed(() => slides[currentSlide.value]);

const featuredProducts = computed(() => products.value.slice(0, 8));

const stats = [
  { value: '50+', label: 'Professional Products' },
  { value: '30+', label: 'Countries Served' },
  { value: '10K+', label: 'Happy Athletes' },
];

const features = [
  { icon: 'quality', title: 'Premium Quality', desc: 'Every product undergoes rigorous testing to meet international competition standards.' },
  { icon: 'globe', title: 'Global Reach', desc: 'Trusted by athletes and teams in over 30 countries across 5 continents.' },
  { icon: 'energy', title: 'Innovation Driven', desc: 'Continuous R&D investment to push the boundaries of sports equipment technology.' },
];

function goToSlide(index: number) {
  currentSlide.value = index;
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
}

onMounted(async () => {
  slideInterval = setInterval(nextSlide, 8080);
  try {
    const [productsData, categoriesData] = await Promise.all([
      apiClient.getProducts(),
      apiClient.getCategories(),
    ]);
    products.value = productsData;
    categories.value = categoriesData;
  } catch (err) {
    console.error('Failed to load data:', err);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>
