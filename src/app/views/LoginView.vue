<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-heading font-bold text-lg">AB</span>
        </div>
        <h1 class="font-heading font-bold text-2xl text-primary">Admin Login</h1>
        <p class="mt-2 text-sm text-slate-500">Sign in to manage your store</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-8">
        <form @submit.prevent="handleLogin">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                v-model="username"
                type="text"
                class="input-field"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                v-model="password"
                type="password"
                class="input-field"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div v-if="errorMsg" class="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="btn-primary w-full mt-6 py-3 text-center disabled:opacity-50"
          >
            {{ submitting ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <router-link to="/" class="text-sm text-slate-500 hover:text-accent transition-colors">
            &larr; Back to Store
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const errorMsg = ref('');
const submitting = ref(false);

async function handleLogin(): Promise<void> {
  errorMsg.value = '';
  submitting.value = true;

  try {
    await authStore.login(username.value, password.value);
    router.push('/admin');
  } catch (err: unknown) {
    const error = err as Error;
    errorMsg.value = error.message || 'Login failed. Please check your credentials.';
  } finally {
    submitting.value = false;
  }
}
</script>
