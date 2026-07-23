<template>
  <div>
    <!-- Hero -->
    <section class="pt-20 bg-primary text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 class="font-heading font-bold text-4xl md:text-5xl">About APEX BALL</h1>
        <p class="mt-4 text-lg text-slate-300 max-w-2xl">
          Born from a passion for ball sports, we engineer equipment that helps athletes reach their peak.
        </p>
      </div>
    </section>

    <!-- Story -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="font-heading font-bold text-3xl text-primary">Our Story</h2>
            <p class="mt-6 text-slate-600 leading-relaxed">
              Founded in 2015, APEX BALL started with a simple mission: to create the world's finest ball sports equipment. Our team of engineers, designers, and former professional athletes work together to push the boundaries of performance.
            </p>
            <p class="mt-4 text-slate-600 leading-relaxed">
              Every ball we produce undergoes rigorous testing to ensure it meets the highest standards of quality, durability, and performance. From local parks to international stadiums, APEX BALL equipment is trusted by athletes worldwide.
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-8">
            <div class="grid grid-cols-2 gap-6">
              <div v-for="stat in aboutStats" :key="stat.label" class="text-center">
                <div class="font-heading font-bold text-3xl text-accent">{{ stat.value }}</div>
                <div class="mt-1 text-sm text-slate-500">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="font-heading font-bold text-3xl text-primary text-center mb-12">Our Values</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="value in values" :key="value.title" class="bg-white rounded-2xl p-8 shadow-sm">
            <div class="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="value.icon"/>
              </svg>
            </div>
            <h3 class="font-heading font-semibold text-lg text-primary">{{ value.title }}</h3>
            <p class="mt-2 text-slate-500 text-sm leading-relaxed">{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const aboutStats = [
  { value: '2015', label: 'Founded' },
  { value: '50+', label: 'Products' },
  { value: '30+', label: 'Countries' },
  { value: '10K+', label: 'Athletes' },
];

const values = [
  {
    title: 'Quality First',
    desc: 'Every product undergoes rigorous quality control. We use only premium materials and advanced manufacturing processes.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Innovation',
    desc: 'We continuously invest in R&D to develop cutting-edge technologies that enhance athletic performance.',
    icon: 'M13 10V3l4 4h-4m4 0v10l-4-4h4M3 12h8m-8 0a9 9 0 1118 0 9 9 0 01-18 0',
  },
  {
    title: 'Global Community',
    desc: 'We support athletes at every level, from beginners to professionals, across more than 30 countries worldwide.',
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064',
  },
];
</script>
