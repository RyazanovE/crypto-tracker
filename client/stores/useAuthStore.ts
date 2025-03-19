import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: useCookie('isLoggedIn', { default: () => false }).value === true,
  }),
  actions: {
    login() {
      this.isLoggedIn = true;
      useCookie('isLoggedIn', { default: () => false }).value = true;
      navigateTo('/');
    },
    logout() {
      this.isLoggedIn = false;
      useCookie('isLoggedIn', { default: () => false }).value = false;
      navigateTo('/login');
    },
  },
});
