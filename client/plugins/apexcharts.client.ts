import VueApexCharts from 'vue3-apexcharts';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VueApexCharts', VueApexCharts);
});