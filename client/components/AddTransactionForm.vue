<script setup lang="ts">
import { useBinancePrices } from '~/composables/useBinancePrices/useBinancePrices';
import type { TransactionPayload } from '~/repository/modules/transaction';

import { useDate } from 'vuetify';

const adapter = useDate();

const { $api } = useNuxtApp();
let amountDebounceTimeout: NodeJS.Timeout | null = null;
const emits = defineEmits(['transactionAdded']);

const transaction = defineModel<Omit<TransactionPayload, "type" | 'date'> & { type: number, date: Date }>({ required: true });
const totalSpent = ref<string>('0');

const { data: coins } = useBinancePrices({
  afterFetch: () => updateTransactionPrice(),
});

const updateTransactionPrice = () => {
  if (!transaction.value.symbol) return;
  transaction.value.price = coins.value?.find(coin => coin.symbol.replace('USDT', '') === transaction.value.symbol.replace('USDT', '').toUpperCase())?.price ?? 0;
};

const coinSymbols = computed(() => coins.value?.map(coin => coin.symbol) ?? []);

watch(() => transaction.value.symbol, () => {
  if (!transaction.value.symbol) return;

  Object.assign(transaction.value, {
    price: 0,
    amount: 0,
    date: new Date(),
    type: 0,
  });

  updateTransactionPrice();
});

onMounted(() => {
  Object.assign(transaction.value, {
    price: 0,
    amount: 0,
    date: new Date(),
    type: 0,
  });
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

watch(() => transaction.value.amount, () => {
  if (amountDebounceTimeout) {
    clearTimeout(amountDebounceTimeout);
  }
  if (transaction.value.amount) {
    amountDebounceTimeout = setTimeout(() => {
      totalSpent.value = (Number(transaction.value.price ?? 0) * Number(transaction.value.amount ?? 0)).toFixed(2);
    }, 500);
  }
});

function format (date: Date) {
  return adapter.toISO(date);
}
</script>


<template>
  <v-form @submit.prevent='onTransactionSubmit'>
    <v-btn-toggle v-model="transaction.type" class='mb-4'>
      <v-btn color='green'>
        Buy
      </v-btn>
      <v-btn color='red' >
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
    <v-date-input
      v-model="transaction.date"
      :display-format="format"
      max-width="368"
    />
    <v-label>Total Spent</v-label>
    <v-container>
      {{ totalSpent }}
    </v-container>
    <v-btn class='w-100' color='primary' type='submit'>
      add transaction
    </v-btn>
  </v-form>
</template>