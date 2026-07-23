import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient } from '../api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'));
  const adminUser = ref<{ id: number; username: string } | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(username: string, password: string): Promise<void> {
    const data = await apiClient.login(username, password);
    token.value = data.token;
    adminUser.value = data.admin;
    localStorage.setItem('admin_token', data.token);
  }

  function logout(): void {
    token.value = null;
    adminUser.value = null;
    localStorage.removeItem('admin_token');
  }

  async function fetchAdminInfo(): Promise<void> {
    if (!token.value) return;
    try {
      const data = await apiClient.getAdminInfo(token.value);
      adminUser.value = data.admin;
    } catch {
      logout();
    }
  }

  return { token, adminUser, isAuthenticated, login, logout, fetchAdminInfo };
});
