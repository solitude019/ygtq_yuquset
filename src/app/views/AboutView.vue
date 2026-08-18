<template>
  <div>
    <!-- Page Header -->
    <div class="relative bg-[#0A0A0A] text-white py-20 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent"></div>
      <div class="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-heading font-black text-4xl md:text-5xl">ABOUT US</h1>
        <p class="mt-4 text-gray-400 max-w-xl text-lg">Driven by passion, defined by performance.</p>
      </div>
    </div>

    <!-- Brand Story -->
    <section class="py-16 bg-white">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-1 bg-[#DC2626]"></div>
              <span class="text-[#DC2626] font-semibold text-sm tracking-widest uppercase">Our Story</span>
            </div>
            <h2 class="font-heading font-black text-3xl text-[#1A1A1A] mb-6">BORN FROM A PASSION FOR BALL SPORTS</h2>
            <div class="space-y-4 text-[#666] leading-relaxed">
              <p>Founded with a singular vision: to create the world's finest ball sports equipment. APEX BALL emerged from the belief that every athlete deserves gear that matches their dedication and skill.</p>
              <p>Our team of engineers, designers, and former professional athletes work tirelessly to develop products that push the boundaries of performance. From material selection to final testing, every step is guided by our commitment to excellence.</p>
              <p>Today, APEX BALL is trusted by athletes and teams in over 30 countries, from amateur leagues to professional championships. Our equipment has been part of countless victories, record-breaking performances, and unforgettable moments in sports history.</p>
            </div>
          </div>
          <div class="bg-[#F5F5F5] rounded-lg aspect-[4/3] flex items-center justify-center overflow-hidden">
            <img src="/images/hero-banner.jpg" alt="APEX BALL" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="py-16 bg-[#F5F5F5]">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="font-heading font-bold text-2xl text-[#1A1A1A]">CORE VALUES</h2>
          <div class="w-12 h-1 bg-[#DC2626] mt-2 mx-auto"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="value in values" :key="value.title" class="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <div class="w-14 h-14 mx-auto bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
              <span class="text-2xl">{{ value.emoji }}</span>
            </div>
            <h3 class="font-heading font-bold text-[#1A1A1A] mb-2">{{ value.title }}</h3>
            <p class="text-sm text-[#666] leading-relaxed">{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-16 bg-[#0A0A0A] text-white">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label">
            <div class="font-heading font-black text-3xl md:text-4xl text-[#DC2626]">{{ stat.value }}</div>
            <div class="mt-2 text-gray-400 text-sm uppercase tracking-wider">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-white">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="font-heading font-bold text-2xl text-[#1A1A1A] mb-4">READY TO ELEVATE YOUR GAME?</h2>
        <p class="text-[#666] mb-8 max-w-lg mx-auto">Explore our collection of professional-grade ball sports equipment and find the perfect gear for your sport.</p>
        <router-link to="/products" class="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold px-8 py-3 rounded transition-colors">
          SHOP NOW
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const values = [
  { emoji: '🏆', title: 'Excellence', desc: 'We pursue the highest standards in every product we create, from design to delivery.' },
  { emoji: '🔬', title: 'Innovation', desc: 'Continuous research and development to push the boundaries of sports technology.' },
  { emoji: '🤝', title: 'Trust', desc: 'Building lasting relationships with athletes, teams, and partners through reliability.' },
  { emoji: '🌍', title: 'Global Spirit', desc: 'Connecting athletes across continents through the universal language of sport.' },
];

const stats = [
  { value: '2015', label: 'Year Founded' },
  { value: '50+', label: 'Products' },
  { value: '30+', label: 'Countries' },
  { value: '10K+', label: 'Athletes' },
];
</script>
