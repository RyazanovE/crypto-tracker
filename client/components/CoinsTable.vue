<script setup lang="ts">
import type { Coin, Portfolio } from '~/repository/modules/portfolio';

const headers = [
  { title: 'Coin', key: 'symbol' },
  { title: 'Avg Price (USDT)', key: 'averagePrice' },
  { title: 'Amount', key: 'amount' },
  { title: 'Money spent (USDT)', key: 'moneySpent' },
  { title: 'Current value (USDT)', key: 'usdtEquivalent' },
  { title: 'Price Change', key: 'priceChange' },
  { title: 'P/L', key: 'profitLoss' },
  { title: 'Current Price', key: 'currentPrice' },
  { title: 'Actions', key: 'actions' },
];

const { $api } = useNuxtApp();

const showAlert = ref(false);

defineProps<{ portfolio: Portfolio | null }>();
const emits = defineEmits(['loadPortfolio', 'addTransaction']);

const onCoinOptionClick = async (optionValue: number, coin: Coin) => {
  if (optionValue === 1) {
    await $api.portfolio.removePortfolioCoin(coin.id);
    showAlert.value = true;
    emits('loadPortfolio');
  }
};

watch(() => showAlert.value, () => {
  if (showAlert.value) {
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  }
});
</script>

<template>
  <v-alert v-if="showAlert" color='green' class="position-fixed notification">
    Successfully deleted
  </v-alert>
  <v-data-table
  class="mt-8 bg-surface"
  :loading="!portfolio"
  :headers="headers"
  :items="portfolio?.coins ?? []"
  hide-default-footer
>
  <template #loading>
    <v-skeleton-loader type="table-row@10" />
  </template>

  <template #item.actions="{ item }">
    <v-container class="d-flex align-center px-0">
      <v-btn icon variant="text" @click="emits('addTransaction', item)">
        <v-icon color="primary">mdi-plus</v-icon>
      </v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon variant="text" v-bind="props">
            <v-icon color="grey">mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(menuItem, key) in [{ title: 'Delete coin', value: 1 }]"
            :key="key"
            @click="onCoinOptionClick(menuItem.value, item)"
          >
            <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-container>
  </template>

  <template #item.priceChange="{ item }">
    <v-chip
      class="text-white font-weight-bold"
      :color="Number(item.priceChange ?? 1) > 0 ? 'green' : 'red'"
    >
      {{ item.priceChange }} %
    </v-chip>
  </template>

  <template #item.profitLoss="{ item }">
    <v-chip
      class="text-white font-weight-bold"
      :color="Number(item.profitLoss ?? 1) > 0 ? 'green' : 'red'"
    >
      {{ item.profitLoss }} $
    </v-chip>
  </template>

  <template #item.currentPrice="{ item }">
    <span class="text-body-2 font-weight-bold">{{ item.currentPrice }} $</span>
  </template>

  <template #item.symbol="{ item }">
    <v-chip  class="font-weight-bold">
      {{ item.symbol }}
    </v-chip>
  </template>

  <template #item.usdtEquivalent="{ item }">
    <span class="text-body-2 font-weight-bold">{{ item.usdtEquivalent }} $</span>
  </template>

  <template #item.averagePrice="{ item }">
    <span class="text-body-2 font-weight-bold">{{ item.averagePrice }} $</span>
  </template>

  <template #item.moneySpent="{ item }">
    <span class="text-body-2 font-weight-bold">{{ item.moneySpent }} $</span>
  </template>
</v-data-table>
</template>

<style scoped>
.notification {
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: 300px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-fade-enter-from {
  transform: translate(-50%, -40px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translate(-50%, -40px);
  opacity: 0;
}
</style>