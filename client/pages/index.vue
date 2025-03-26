<script setup lang="ts">
import type { Coin, Portfolio } from '~/repository/modules/portfolio';

const headers = [
  { title: 'Coin', key: 'symbol' },
  { title: 'Avg Price (USDT)', key: 'averagePrice' },
  { title: 'Amount', key: 'amount' },
  { title: 'Holdings (USDT)', key: 'usdtEquivalent' },
  { title: 'Price Change', key: 'priceChange'},
  { title: 'P/L', key: 'profitLoss'},
  { title: 'Current Price', key: 'currentPrice'},
  { title: 'Actions', key: 'actions'},
];

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

const { $api } = useNuxtApp();

const isNewTransactionModalShown = ref(false);
const coinSymbol = ref<string | null>(null);
const portfolio = ref<Portfolio | null>(null);

// const historyChartOptions = {
//   xaxis: { type: 'datetime' },
// };
// const performanceChartOptions = {
//   xaxis: { type: 'datetime' },
// };
// const allocationChartOptions = computed(() => ({
//   labels: data.value?.allocation.labels ?? [],
// }));

const onAddAnotherTransaction = (coin: Coin) => {
  coinSymbol.value = coin.symbol;
  isNewTransactionModalShown.value = true;
};

const onAddNewTransaction = () => {
  coinSymbol.value = null;
  isNewTransactionModalShown.value = true;
};

const onCoinOptionClick = async (optionValue: number, coin: Coin) => {
  if (optionValue === 1) {
    await $api.portfolio.removePortfolioCoin(coin.id);
    loadPortfolio();
  }
};

const loadPortfolio = async () => {
  portfolio.value = await $api.portfolio.getPortfolio();
};

onMounted(() => {
  loadPortfolio();
});
</script>

<template>
  <v-container>
    <v-title class='d-block mb-2'>Portfolio: {{ portfolio?.name }}</v-title>
    <v-row align='center'>
      <v-col cols='8'>
        <h5>Portfolio</h5>
        <span class="text-h5 font-weight-bold">${{portfolio?.balance }}</span>
      </v-col>
      <v-col cols="4">
        <v-btn
          color="primary"
          class='w-100'
          text="+ Add transaction"
          variant="flat"
          @click='onAddNewTransaction'
        />
        <TransactionModal v-model='isNewTransactionModalShown' :coin-symbol @transaction-added='loadPortfolio'/>
      </v-col>
    </v-row>

    <v-row align="stretch">
      <v-col cols="4">
        <v-card class="bg-primary fill-height">
          <v-card-title>All-time profit</v-card-title>
          <v-card-text class="text-h5 font-weight-bold">${{ portfolio?.allTimeProfit }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="bg-primary fill-height">
          <v-card-title>Best Performer</v-card-title>
          <v-card-text>
            <span class="font-weight-bold">{{ portfolio?.bestPerformerCoinId }}</span>
            <div class="green--text">{{ portfolio?.bestPerformerCoinId }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="bg-primary fill-height">
          <v-card-title>Worst Performer</v-card-title>
          <v-card-text>
            <span class="font-weight-bold">{{ portfolio?.worstPerformerCoinId }}</span>
            <div class="red--text">{{ portfolio?.worstPerformerCoinId }}</div>
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
          :items="portfolio?.coins ?? []"
          hide-default-footer
        >
        <template #item.actions='{ item }'>
          <v-btn icon @click='onAddAnotherTransaction(item)'>
            <v-icon>mdi-plus</v-icon>
          </v-btn>

          <v-menu>
            <template #activator="{ props }">
              <v-btn icon v-bind="props">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(menuItem, key) in [{title: 'Delete coin', value: 1}]"
                :key
                :value="key"
                @click='onCoinOptionClick(menuItem.value, item)'
              >
                <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template #item.priceChange='{ item }'>
          <v-chip v-if='Number(item.priceChange ?? 1) > 0' color="green">{{ item.priceChange }} %</v-chip>
          <v-chip v-else color="red">{{ item.priceChange }} %</v-chip>
        </template>
        <template #item.profitLoss='{ item }'>
          <v-chip v-if='Number(item.priceChange ?? 1) > 0' color="green">{{ item.profitLoss }} $</v-chip>
          <v-chip v-else color="red">{{ item.profitLoss }} $</v-chip>
        </template>

        <template #item.currentPrice='{ item }'>
          {{ item.currentPrice }} $
        </template>
        <template #item.symbol='{ item }'>
          <v-chip>{{ item.symbol }}</v-chip>
        </template>
        <template #item.usdtEquivalent='{ item }'>
          {{ item.usdtEquivalent }} $
        </template>
      </v-data-table>
      </v-col>
    </v-row>
</v-container>
</template>

<style scoped>

</style>

