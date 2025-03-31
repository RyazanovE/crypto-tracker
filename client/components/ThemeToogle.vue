<script setup lang='ts'>
import { useTheme } from 'vuetify';

const theme = useTheme();
const isDark = ref(theme.global.current.value.dark);

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
  isDark.value = !isDark.value;
  localStorage.setItem('theme', theme.global.name.value);
};
</script>

<template>
  <v-btn
    icon
    :title="isDark ? 'Светлая тема' : 'Темная тема'"
    @click="toggleTheme"
  >
    <v-icon :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" />
  </v-btn>
</template>

