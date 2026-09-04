<template>
  <footer class="bg-[#0A0A0A] text-white">
    <!-- Main Footer -->
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-3 mb-4"><div>
              <div class="font-heading font-black text-lg leading-tight">Yu</div>
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
              YU_CustomerCenter@hotmail.com
            </li>
            <li class="flex items-center gap-2 text-gray-400 text-sm">
              <svg class="w-4 h-4 shrink-0 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              +86 18618437055
            </li>
          </ul>

          <!-- QR Codes -->
          <div class="mt-5">
            <p class="text-gray-500 text-xs mb-3 uppercase tracking-wider">Scan to Connect</p>
            <div class="flex items-center gap-4">
              <div class="flex flex-col items-center">
                <div class="w-20 h-20 bg-white rounded-md p-1.5 mb-1.5">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WeChat_Yu_Sports&bgcolor=ffffff&color=000000&margin=0" alt="WeChat QR Code" class="w-full h-full object-contain" />
                </div>
                <span class="text-gray-400 text-[10px] flex items-center gap-1">
                  <svg class="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.492.492 0 01.177-.554C23.026 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zM14.834 13.09c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.857 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/></svg>
                  WeChat
                </span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-20 h-20 bg-white rounded-md p-1.5 mb-1.5">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WhatsApp_Yu_Sports&bgcolor=ffffff&color=000000&margin=0" alt="WhatsApp QR Code" class="w-full h-full object-contain" />
                </div>
                <span class="text-gray-400 text-[10px] flex items-center gap-1">
                  <svg class="w-3 h-3 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="text-gray-500 text-xs">&copy; 2024 Yu. All rights reserved.</p>
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
