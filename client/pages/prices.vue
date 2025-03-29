<script setup lang="ts">
import { useBinancePrices } from '~/composables/useBinancePrices/useBinancePrices';

const TABLE_HEADERS = [
  { title: 'Coin', key: 'symbol' },
  { title: 'Price (USD)', key: 'price' },
];

useHeadSafe({
  title: "Crypto List | Crypto Portfolio",
  meta: [
    { name: "description", content: "Explore a list of cryptocurrencies with real-time prices, market data, and analysis on Crypto Portfolio." },
    { name: "keywords", content: "Crypto List, Cryptocurrency Prices, Crypto Market Data, BTC, ETH, Solana, AVAX" },
    { property: "og:title", content: "Cryptocurrency List & Market Data" },
    { property: "og:description", content: "Track real-time prices, trends, and market data for Bitcoin, Ethereum, Solana, and more." },
  ],
});

const { data: coins, status } = useBinancePrices();

const goToItemPage = (_event: Event, { index }: { columns: unknown; index: number }) => {
  const itemId = coins.value?.[index]?.symbol;

  if (itemId) {
    navigateTo(`/coin/${itemId}`);
  }
};
</script>

<template>
    <v-container>
    <v-card>
      <v-divider />
      <v-data-table
        :loading='status === "pending"'
        loading-text="Loading... Please wait"
        :headers='TABLE_HEADERS'
        :items='coins ?? []'
        item-value="symbol"
        @click:row='goToItemPage'
      >
        <template v-if='status==="success"' #item.price="{ item }">
          <v-chip color="green">{{ item.price }} $</v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

