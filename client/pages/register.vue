<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: false,
});

useHeadSafe({
  title: "Sign Up | Crypto Portfolio",
  meta: [
    { name: "description", content: "Create an account on Crypto Portfolio to start tracking and managing your cryptocurrency investments." },
    { name: "keywords", content: "Crypto Portfolio Sign Up, Create Crypto Account, Crypto Portfolio Registration" },
    { property: "og:title", content: "Sign Up for Crypto Portfolio" },
    { property: "og:description", content: "Join Crypto Portfolio today and start managing your crypto assets efficiently." },
  ],
});

const { $api } = useNuxtApp();

const email = ref('');
const password = ref('');
const visible = ref(false);
const error = ref('');
const showAlert = ref(false);

const login = async () => {
  const response = await $api.user.create({email: email.value, password: password.value});

  if (response.isError) {
    error.value = response.error.message;
  } else {
    showAlert.value = true;
  }
};
</script>

<template>
  <div id="app">
    <v-app>
      <v-container>
          <AlertNotification v-model="showAlert" color='green' message="Successfully registered"/>
        <v-card class="mx-auto pa-12 pb-8 mt-10" elevation="8" max-width="448" rounded="lg">
          <v-form @submit.prevent='login'>
            <h2>Registration Form</h2>
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


            <v-card v-if='error' class="mb-6" color="red" variant="tonal">
              <v-card-text class="text-medium-emphasis text-caption">
                {{ error }}
              </v-card-text>
            </v-card>

            <v-btn type='submit' class="mb-4 w-100" color='blue' size="large" variant="tonal">
              Sign Up
            </v-btn>

            <v-card-text class="text-center">
              <NuxtLink to="/login" class="text-blue text-decoration-none" >
                Log in now <v-icon icon="mdi-chevron-right" />
              </NuxtLink>
            </v-card-text>

          </v-form>
        </v-card>
      </v-container>

    </v-app>
  </div>
</template>
