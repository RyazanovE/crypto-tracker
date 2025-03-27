<script setup lang="ts">
useHeadSafe({
  title: 'Криптовалюты – Актуальные курсы и динамика цен',
  meta: [
    {
      name: 'description',
      content:
        'Следите за актуальными курсами криптовалют: Bitcoin, Ethereum, Solana и других. Данные обновляются в реальном времени.',
    },
  ],
});

const headers = [
  { title: 'Coin', key: 'symbol' },
  { title: 'Price (USD)', key: 'price' },
];

const { data: items, status } = useLazyAsyncData(
  'coins',
  async () => {
    try {
      const BINANCE_PRICE_URL = 'https://api.binance.com/api/v3/ticker/price';
      const result = await $fetch<{ symbol: string; price: string }[]>(BINANCE_PRICE_URL);

      return result
        .filter((coin) => coin.symbol.endsWith('USDT'))
        .map((coin) => ({
          ...coin,
          price: Math.round(parseFloat(coin.price)),
        }));
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      return [];
    }
  },
);


const goToItemPage = (_event: Event, { index }: { columns: unknown; index: number }) => {
  const itemId = items.value?.[index]?.symbol;

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
        :headers
        :items='items ?? []'
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

