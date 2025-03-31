<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/useAuthStore';

definePageMeta({
  layout: false,
});

useHeadSafe({
  title: "Login | Crypto Portfolio",
  meta: [
    { name: "description", content: "Log in to your Crypto Portfolio account to track and manage your crypto assets." },
    { name: "keywords", content: "Crypto Portfolio Login, Crypto Account, Crypto Portfolio Access" },
    { property: "og:title", content: "Login to Crypto Portfolio" },
    { property: "og:description", content: "Access your Crypto Portfolio to manage and analyze your cryptocurrency holdings." },
  ],
});

const { $api } = useNuxtApp();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const visible = ref(false);
const error = ref('');

const login = async () => {
  const response = await $api.auth.login({email: email.value, password: password.value});

  if (response.isError) {
    error.value = response.error.message;
  } else {
    authStore.login();
  }
};
</script>

<template>
  <v-container>
    <v-card class="mx-auto pa-12 pb-8 mt-10" elevation="8" max-width="448" rounded="lg">
      <v-form @submit.prevent='login'>
        <h2>Login Form</h2>
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>
        <v-text-field
          v-model='email' density="compact" placeholder="Email address"
          prepend-inner-icon="mdi-email-outline" variant="outlined" clearable />
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
          <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
            Forgot login password?
          </a>
        </div>
        <v-text-field
          v-model='password' :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline" variant="outlined" clearable @click:append-inner="visible = !visible" />


        <v-card v-if='error' class="mb-6" color="red" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
            {{ error }}
          </v-card-text>
        </v-card>

        <v-btn type='submit' class="mb-4 w-100" color='blue' size="large" variant="tonal">
          Log In
        </v-btn>

        <v-card-text class="text-center">
          <NuxtLink to="/register" class="text-blue text-decoration-none">
            Sign up now <v-icon icon="mdi-chevron-right" />
          </NuxtLink>
        </v-card-text>
      </v-form>
    </v-card>
  </v-container>
</template>
