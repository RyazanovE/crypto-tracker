<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/useAuthStore';

definePageMeta({
  layout: false,
});

const { $api } = useNuxtApp();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const visible = ref(false);


const login = async () => {
  const response = await $api.auth.login({email: email.value, password: password.value});

  authStore.login();
};
</script>

<template>
  <div id="app">
    <v-app>
      <v-container>
        <v-card class="mx-auto pa-12 pb-8 mt-10" elevation="8" max-width="448" rounded="lg">
          <v-form @submit.prevent='login'>
            <h2>Vuetify Login Form</h2>
            <div class="text-subtitle-1 text-medium-emphasis">Account</div>
            <v-text-field
              v-model='email'
              density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
              variant="outlined" clearable />
            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
              Password
              <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
                Forgot login password?
              </a>
            </div>
            <v-text-field
              v-model='password'
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
              density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline"
              variant="outlined" clearable @click:append-inner="visible = !visible" />

            <v-card class="mb-12" color="surface-variant" variant="tonal">
              <v-card-text class="text-medium-emphasis text-caption">
                Warning: After 3 consecutive failed login attempts, you account will
                be temporarily locked for three hours. If you must login now, you can
                also click "Forgot login password?" below to reset the login password.
              </v-card-text>
            </v-card>

            <v-btn type='submit' class="mb-8 w-100" color='blue' size="large" variant="tonal">
              Log In
            </v-btn>

            <v-card-text class="text-center">
              <a class="text-blue text-decoration-none" href="#" rel="noopener noreferrer" target="_blank">
                Sign up now <v-icon icon="mdi-chevron-right" />
              </a>
            </v-card-text>
          </v-form>
        </v-card>
      </v-container>

    </v-app>
  </div>
</template>
