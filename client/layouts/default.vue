<script setup lang='ts'>
const route = useRoute();

const { $api } = useNuxtApp();
const authStore = useAuthStore();

const LINKS = [
  {text: 'portfolio', link: '/'},
  {text: 'prices', link: '/prices'},
];

const navigate = (link: string) => {
  navigateTo(link);
};

const onProfileOptionClick = async (value: number) => {

  if (value === 1) {
    await $api.auth.logout();
    authStore.logout();
  }
};
</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-container class="d-flex align-center">
        <v-app-bar-title>Crypto Portfolio</v-app-bar-title>
        <v-row justify="center" no-gutters>
          <v-btn
            v-for="({link, text}) in LINKS"
            :key="link"
            color="white"
            :style="{ opacity: link === route.path ? 0.5 : 1 }"
            class="mx-2"
            rounded="xl"
            variant="text"
            @click='navigate(link)'
          >
            {{ text }}
          </v-btn>
        </v-row>
        <v-spacer />
        <v-menu>
        <template #activator="{ props }">
          <v-btn icon variant="text" v-bind="props">
            <v-icon color="grey">mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(menuItem, key) in [{ title: 'logout', value: 1 }]"
            :key="key"
            @click="onProfileOptionClick(menuItem.value)"
          >
            <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>

    <v-footer app color="primary" dark>
      <v-container class="text-center">
        &copy; {{ new Date().getFullYear() }} Crypto Tracker
      </v-container>
    </v-footer>
  </v-app>
</template>



