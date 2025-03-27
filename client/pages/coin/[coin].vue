<script setup lang="ts">
const route = useRoute();
const minute = useCrypto(route.params.coin as string, '1m');
const day = useCrypto(route.params.coin as string, '1d');

</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <ClientOnly>
          <ApexChart type="candlestick" :options="minute.chartOptions" :series="minute.series.value"  />
        </ClientOnly>
      </v-col>
      <v-col cols="6">
        <ClientOnly>
          <ApexChart type="candlestick" :options="day.chartOptions" :series="day.series.value"  />
        </ClientOnly>
      </v-col>
    </v-row>
  </v-container>
</template>
