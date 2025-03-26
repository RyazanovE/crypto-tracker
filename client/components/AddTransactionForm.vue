<script setup lang="ts">
import { useBinancePrices } from '~/composables/useBinancePrices/useBinancePrices';
import type { TransactionPayload } from '~/repository/modules/transaction';

const { $api } = useNuxtApp();
const emits = defineEmits(['transactionAdded']);

const transaction = defineModel<Omit<TransactionPayload, "type"> & { type: number }>({ required: true });

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
    amount: 0,
    totalSpent: 0,
    date: new Date().toISOString(),
    type: 0,
  });

  updateTransactionPrice();
});

const onTransactionSubmit = async (_event: Event) => {
  const payload = {
    type: transaction.value.type === 0 ? 'buy' : 'sell',
    symbol: transaction.value.symbol.toUpperCase().replace('USDT', ''),
    amount: Number(transaction.value.amount),
    price: Number(transaction.value.price),
    totalSpent: Number(transaction.value.totalSpent),
    date: new Date(transaction.value.date).toISOString(),
  };
  await $api.transaction.addTransaction(payload);
  emits('transactionAdded');
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
          v-model='transaction.amount'
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