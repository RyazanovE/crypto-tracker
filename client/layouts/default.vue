<script setup lang='ts'>
const route = useRoute();

const LINKS = [
  {text: 'prices', link: '/'},
  {text: 'portfolio', link: '/portfolio'},
];

const navigate = (link: string) => {
  navigateTo(link);
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
        <v-btn icon>
          <v-icon>mdi-account</v-icon>
        </v-btn>
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



