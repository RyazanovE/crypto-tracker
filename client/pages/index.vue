<script setup lang="ts">
import CoinsTable from '~/components/CoinsTable.vue';
import type { Coin, Portfolio } from '~/repository/modules/portfolio';

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

const portfolio = ref<Portfolio | null>(null);
const isNewTransactionModalShown = ref(false);
const coinSymbol = ref<string | null>(null);

const addTransaction = (coin: Coin) => {
  coinSymbol.value = coin.symbol;
  isNewTransactionModalShown.value = true;
};

const onAddNewTransaction = () => {
  coinSymbol.value = null;
  isNewTransactionModalShown.value = true;
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
    <TransactionModal
      v-model='isNewTransactionModalShown'
      :coin-symbol
      @transaction-added='loadPortfolio'
    />

    <PortfolioInfo
      :portfolio
      @load-portfolio='loadPortfolio'
      @add-new-transaction='onAddNewTransaction'
    />

    <CoinsTable
      class='mt-8'
      :portfolio
      @load-portfolio='loadPortfolio'
      @add-transaction='addTransaction'
    />

  </v-container>
</template>

<style scoped>

</style>

