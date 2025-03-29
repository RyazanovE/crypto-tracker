<script setup lang="ts">
import { useBinancePrices } from '~/composables/useBinancePrices/useBinancePrices';
import type { TransactionPayload } from '~/repository/modules/transaction';
import { useDate } from 'vuetify';

const adapter = useDate();
const { $api } = useNuxtApp();

let amountDebounceTimeout: NodeJS.Timeout | null = null;

const emits = defineEmits(['transactionAdded']);
const transaction = defineModel<Omit<TransactionPayload, "type" | 'date'> & { type: number, date: Date }>({ required: true });
const totalSpent = ref<number>(0);

const { data: coins } = useBinancePrices({
  afterFetch: () => updateTransactionPrice(),
});

const updateTransactionPrice = () => {
  if (!transaction.value.symbol) return;
  transaction.value.price = coins.value?.find(coin => coin.symbol.replace('USDT', '') === transaction.value.symbol.replace('USDT', '').toUpperCase())?.price ?? 0;
};

const coinSymbols = computed(() => coins.value?.map(coin => coin.symbol) ?? []);


const restoreTransaction = () => {
  Object.assign(transaction.value, {
    price: 0,
    amount: 0,
    date: new Date(),
    type: 0,
  });
};

function formatDate(date: Date) {
  return adapter.toISO(date);
}

const onTransactionSubmit = async (_event: Event) => {
  const payload = {
    type: transaction.value.type === 0 ? 'buy' : 'sell',
    symbol: transaction.value.symbol.toUpperCase().replace('USDT', ''),
    amount: Number(transaction.value.amount),
    price: Number(transaction.value.price),
    totalSpent: transaction.value.totalSpent,
    date: formatDate(transaction.value.date),
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
      totalSpent.value = Math.round(transaction.value.price * transaction.value.amount);
    }, 500);
  }
});

watch(() => transaction.value.symbol, () => {
  restoreTransaction();
  updateTransactionPrice();
});

onMounted(() => {
  restoreTransaction();
});
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
      :display-format="formatDate"
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