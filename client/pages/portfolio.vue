<script setup lang="ts">
import { mockPortfolioResponse } from '~/assets/mock';

const { $api } = useNuxtApp();

const isNewTransactionModalShown = ref(false);
const coinSymbol = ref<string | null>(null);

useHeadSafe({
  title: 'Portfolio',
  meta: [
    {
      name: 'description',
      content:
        'My portfolio',
    },
  ],
});

const historyChartOptions = {
  xaxis: { type: 'datetime' },
};
const performanceChartOptions = {
  xaxis: { type: 'datetime' },
};
const allocationChartOptions = computed(() => ({
  labels: data.value?.allocation.labels ?? [],
}));

const onAddAnotherTransaction = (item: {
    symbol: string;
    holdings: number;
    diff: number;
    price: number;
}) => {
  coinSymbol.value = item.symbol;
  isNewTransactionModalShown.value = true;
};

const onAddNewTransaction = () => {
  coinSymbol.value = null;
  isNewTransactionModalShown.value = true;
};

const headers = [
  { title: 'Coin', key: 'symbol' },
  { title: 'Price (USD)', key: 'price' },
  { title: 'Holdings', key: 'holdings' },
  { title: 'Diff', key: 'diff' },
  { title: 'Actions', key: 'actions'},
];

onMounted(async () => {
  const response = await $api.portfolio.get();
});

// mock request
const { data } = await useLazyAsyncData('portfolio', async () => {


  return mockPortfolioResponse;
});
</script>

<template>
  <v-container>
    <v-row align='center'>
      <v-col cols='8'>
        <h5>Portfolio</h5>
        <span class="text-h5 font-weight-bold">${{ data?.current_balance }}</span>
      </v-col>
      <v-col cols="4">
        <v-btn
          color="primary"
          class='w-100'
          text="+ Add transaction"
          variant="flat"
          @click='onAddNewTransaction'
        />
        <TransactionModal v-model='isNewTransactionModalShown' :coin-symbol/>
      </v-col>
    </v-row>

    <v-row align="stretch">
      <v-col cols="4">
        <v-card class="bg-primary fill-height">
          <v-card-title>All-time profit</v-card-title>
          <v-card-text class="text-h5 font-weight-bold">${{ data?.all_time_profit }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="bg-primary fill-height">
          <v-card-title>Best Performer</v-card-title>
          <v-card-text>
            <span class="font-weight-bold">{{ data?.best_performer.symbol }}</span>
            <div class="green--text">{{ data?.best_performer.diff }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="bg-primary fill-height">
          <v-card-title>Worst Performer</v-card-title>
          <v-card-text>
            <span class="font-weight-bold">{{ data?.worst_performer.symbol }}</span>
            <div class="red--text">{{ data?.worst_performer.diff }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row align="stretch">
      <v-col cols="4">
        <v-card class="bg-primary fill-height">
          <v-card-title>History</v-card-title>
          <!-- <ClientOnly>
            <ApexChart type="area" :options="historyChartOptions" :series="data?.balance_history"  />
          </ClientOnly> -->
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="bg-primary fill-height">
          <v-card-title>Performance (cumulative)</v-card-title>
          <!-- <ClientOnly>
            <ApexChart type="line" :options="performanceChartOptions" :series="data?.performance"  />
          </ClientOnly> -->
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="bg-primary fill-height">
          <v-card-title>Allocation</v-card-title>
          <!-- <ClientOnly>
            <ApexChart type='donut' :options="allocationChartOptions" :labels='data?.allocation.labels' :series="data?.allocation.series"  />
          </ClientOnly> -->
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="data?.coins ?? []"
          hide-default-footer
        >
        <template #item.actions='{ item }'>
          <v-btn icon @click='onAddAnotherTransaction(item)'>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      </v-col>
    </v-row>
</v-container>
</template>

<style scoped>

</style>

