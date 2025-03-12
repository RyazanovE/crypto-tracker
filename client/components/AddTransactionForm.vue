<script setup lang="ts">
import { useBinancePrices } from '~/composables/useBinancePrices/useBinancePrices';

const transaction = defineModel<{
  symbol: string;
  type: number;
  price: number;
  quantity: number;
  date: string;
  totalSpent: number;
}>({ required: true });

const { data: coins } = useBinancePrices({
  afterFetch: () => updateTransactionPrice(),
});

const updateTransactionPrice = () => {
  if (!transaction.value.symbol) return;
  transaction.value.price = coins.value?.find(coin => coin.symbol === transaction.value.symbol.toUpperCase())?.price ?? 0;
};

const coinSymbols = computed(() => coins.value?.map(coin => coin.symbol) ?? []);

watch(() => transaction.value.symbol, () => {
  if (!transaction.value.symbol) return;

  Object.assign(transaction.value, {
    price: 0,
    quantity: 0,
    totalSpent: 0,
    date: new Date().toISOString().split('T')[0],
    type: 0,
  });

  updateTransactionPrice();
});

const onTransactionSubmit = (_event: Event) => {
  console.log(transaction);
};
</script>


<template>
  <v-form @submit.prevent='onTransactionSubmit'>
    <v-btn-toggle v-model="transaction.type" class='mb-4'>
      <v-btn >
        Buy
      </v-btn>
      <v-btn>
        Sell
      </v-btn>
      <v-btn>
        Transfer
      </v-btn>
    </v-btn-toggle>
    <v-autocomplete
      v-model='transaction.symbol'
      class='mb-4'
      :items='coinSymbols'
      density="compact"
      hide-details
      />
    <v-row class='mb-4 mt-0'>
      <v-col cols="6" class='pt-0 pb-0'>
        <v-label>Quantity</v-label>
        <v-text-field
          v-model='transaction.quantity'
          density="compact"
          label="0.00"
          hide-details
          single-line
        />
      </v-col>
      <v-col cols="6" class='pt-0 pb-0'>
        <v-label>Price Per Coin</v-label>
        <v-text-field
          v-model='transaction.price'
          density="compact"
          prefix="$"
          hide-details
          single-line
        />
      </v-col>
    </v-row>
    <v-text-field
      v-model='transaction.date'
      class='mb-4'
      density="compact"
      type="date"
      hide-details
    />
    <v-label>Total Spent</v-label>
    <v-text-field
      v-model='transaction.totalSpent'
      prefix="$"
      class='mb-4'
      density="compact"
      hide-details
    />
    <v-btn class='w-100' color='primary' type='submit'>
      add transaction
    </v-btn>
  </v-form>
</template>