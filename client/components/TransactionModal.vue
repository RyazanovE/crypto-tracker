<script setup lang="ts">
import { useBinancePrices } from '~/composables/useBinancePrices/useBinancePrices';
import AddTransactionForm from './AddTransactionForm.vue';

const emits = defineEmits(['transactionAdded']);

const props = defineProps<{ coinSymbol?: string | null }>();
const isShown = defineModel<boolean>({required: true});

const showAlert = ref(false);
const coinSearchQuery = ref<string>('');
const transaction = reactive({
  symbol: '',
  type: 0, // 0 - buy, 1 - sell
  price: 0,
  amount: 0,
  date: new Date(),
  totalSpent: 0,
});

let searchCoinTimeout: ReturnType<typeof setTimeout> | null = null;

const { data: coins } = useBinancePrices();

const queryFilteredCoins = computed(() => {
  return coinSearchQuery.value ? coins.value?.filter((coin) => coin.symbol.toLowerCase().includes(coinSearchQuery.value.toLowerCase())) : coins.value ?? [];
});

const onCoinSearchQueryInput = (event: Event) => {
  if (searchCoinTimeout) {
    clearTimeout(searchCoinTimeout);
  }
  searchCoinTimeout = setTimeout(() => {
    coinSearchQuery.value = (event.target as HTMLInputElement).value;
  }, 500);
};

const onTransactionAdded = () => {
  emits('transactionAdded');
  showAlert.value = true;
  isShown.value = false;
};

watch(() => isShown.value, () => {
  if (isShown.value && !props.coinSymbol) {
    transaction.symbol = '';
  } else if (props.coinSymbol) {
    transaction.symbol = props.coinSymbol;
  }
});
</script>

<template>
  <AlertNotification v-model="showAlert" color='green' message="Successfully added"/>
  <v-dialog v-model='isShown' max-width="500">
      <v-card  :title="transaction.symbol ? 'Add Transaction' : 'Select Coin'" class="position-relative">
        <v-card-text v-if='!transaction.symbol' class='ps-10'>
          <v-text-field
            :key='isShown as unknown as PropertyKey'
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Search"
            hide-details
            single-line
            @input='onCoinSearchQueryInput'
          />
          <v-virtual-scroll
            class='mt-4'
            :height="300"
            :items="queryFilteredCoins"
          >
            <template #default="{ item }">
              <v-btn class="w-100" append-icon="mdi-arrow-right-bold" @click='transaction.symbol = item.symbol'>
                <span>{{ item.symbol }}</span>
              </v-btn>
            </template>
          </v-virtual-scroll>
        </v-card-text>

        <v-card-text v-else>
          <AddTransactionForm v-model='transaction' @transaction-added='onTransactionAdded'/>
        </v-card-text>

        <v-btn
          icon
          style='right: 16px; top: 8px;'
          class="position-absolute m-2"
          @click="isShown = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card>
  </v-dialog>
</template>