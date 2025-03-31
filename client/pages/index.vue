<script setup lang="ts">
import CoinsTable from '~/components/CoinsTable.vue';
import type { Coin, Portfolio } from '~/repository/modules/portfolio';

useHeadSafe({
  title: 'Crypto Portfolio',
  meta: [
    { name: "description", content: 'Crypto Portfolio for crypto trading and analysis.' },
    { name: "keywords", content: "Crypto, Portfolio, Crypto Portfolio, BTC, ETH, Solana" },
    { property: "og:title", content: "Crypto Portfolio" },
    { property: "og:description", content: "Crypto Portfolio for crypto trading and analysis." },
  ],
});

const { $api } = useNuxtApp();

const portfolio = ref<Portfolio | null>(null);
const isNewTransactionModalShown = ref(false);
const selectedCoinSymbol = ref<string | null>(null);

const onAddTransactionToSelectedCoin = (coin: Coin) => {
  selectedCoinSymbol.value = coin.symbol;
  isNewTransactionModalShown.value = true;
};

const onAddNewTransaction = () => {
  selectedCoinSymbol.value = null;
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
      :coin-symbol='selectedCoinSymbol'
      @transaction-added='loadPortfolio'
    />

    <PortfolioInfo
      :portfolio
      @add-transaction-btn-clicked='onAddNewTransaction'
    />

    <CoinsTable
      class='mt-8'
      :portfolio
      @coin-deleted='loadPortfolio'
      @add-transaction-btn-clicked='onAddTransactionToSelectedCoin'
    />
  </v-container>
</template>

