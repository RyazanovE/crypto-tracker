<script setup lang="ts">
import type { Portfolio } from '~/repository/modules/portfolio';
import type { Transaction } from '~/repository/modules/transaction';
import { PortfolioCoinInfo } from '#components';

const { $api } = useNuxtApp();

const props = defineProps<{ portfolio: Portfolio | null }>();

const emits = defineEmits(['addTransactionBtnClicked']);

const transactions = ref<Transaction[]>([]);

const series = computed(() => props.portfolio?.coins.map((coin) => Number(coin.moneySpent)) ?? []);
const chartOptions = computed(() => ({
  chart: {
    type: "pie",
  },
  labels: props.portfolio?.coins.map((coin) => coin.symbol) ?? [],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
}));

const loadTransactions = async () => {
  transactions.value = await $api.transaction.getAllTransactions();
};

watch(() => props.portfolio?.balance, () => {
  loadTransactions();
});

onMounted(() => {
  loadTransactions();
});


</script>

<template>
<template v-if='portfolio'>
  <v-title class="d-block mb-8 text-h4 font-weight-bold text-primary">
    <span class="text-transform-none">Portfolio:</span>
    <span class="text-transform-uppercase">{{ portfolio?.name }}</span>
  </v-title>
  <v-row v-if='portfolio' align="center" class="border-bottom hover:bg-grey-100 rounded-lg transition-all duration-300">
  <v-col cols="8" class="d-flex flex-column">
    <div class="d-flex align-center">
      <span class="text-h4 font-weight-bold mr-3">{{ portfolio?.balance.toLocaleString() }} $</span>

      <span class="text-h5 font-weight-bold mr-3">
        <span
        :class="{
          'text-success': Number(portfolio.portfolioPofitLoss) > 0,
          'text-error': Number(portfolio.portfolioPofitLoss) < 0,
          'text-grey': Number(portfolio.portfolioPofitLoss) === 0
        }">
          <v-icon v-if="Number(portfolio.portfolioPofitLoss) > 0" class="mr-2">mdi-arrow-up-bold</v-icon>
          <v-icon v-if="Number(portfolio.portfolioPofitLoss) < 0" class="mr-2">mdi-arrow-down-bold</v-icon>
          {{ portfolio?.portfolioPofitLoss?.toLocaleString() }} $
        </span>
      </span>

      <span class="text-h5 font-weight-bold">
        <span
        :class="{
          'text-success': Number(portfolio.portfolioChange) > 0,
          'text-error': Number(portfolio.portfolioChange) < 0,
          'text-grey': Number(portfolio.portfolioChange) === 0
        }">
          <v-icon v-if="Number(portfolio.portfolioChange) > 0" class="mr-2">mdi-arrow-up-bold</v-icon>
          <v-icon v-if="Number(portfolio.portfolioChange) < 0" class="mr-2">mdi-arrow-down-bold</v-icon>
          {{ portfolio?.portfolioChange.toLocaleString() }} %
        </span>
      </span>
    </div>
  </v-col>

    <v-col cols="4">
      <v-btn
        color="primary"
        class="w-100 text-uppercase font-weight-bold"
        text="+ Add transaction"
        variant="flat"
        @click="emits('addTransactionBtnClicked')"
      />
    </v-col>
  </v-row>
</template>
<v-skeleton-loader v-else :height='103.9' type="paragraph" class='mb-8 d-block'/>


  <v-row align="stretch">
    <v-col cols="4">
      <v-row class="fill-height">
        <v-col cols="12">
          <PortfolioCoinInfo
            title='Best Performer'
            :coin='portfolio?.bestPerformer'
          />
        </v-col>
        <v-col cols="12">
          <PortfolioCoinInfo
            title='Worst Performer'
            :coin='portfolio?.worstPerformer'
          />
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="4">
      <v-card v-if='portfolio' class="bg-primary fill-height" >
        <v-card-title>Money Spent Allocation</v-card-title>
        <v-card-text class='pa-0'>
          <ClientOnly>
            <ApexChart type="pie" :options="chartOptions" :series="series" />
          </ClientOnly>
        </v-card-text>
      </v-card>
      <v-skeleton-loader v-else elevation="2" type="card" class='fill-height d-block'/>
    </v-col>

    <v-col cols="4">
      <v-card v-if='portfolio && transactions' class="bg-primary fill-height">
        <v-card-title>Latest transactions</v-card-title>
        <v-card-text>
          <v-list class="bg-primary" >
          <v-virtual-scroll :items="transactions" height="290">
            <template #default="{ item }">
              <v-list-item :key="item.id">
                <template #prepend>
                  <v-icon :color="item.type === 'buy' ? 'success' : 'error'">
                    {{ item.type === 'buy' ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold' }}
                  </v-icon>
                </template>

                <v-list-item-title class="font-weight-bold">
                  {{ item.coin.symbol }} - {{ item.amount.toLocaleString() }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  Цена: {{ Number(item.price).toFixed(2) }} | Тип:
                  <span :class="item.type === 'buy' ? 'text-success' : 'text-error'">
                    {{ item.type.toUpperCase() }}
                  </span>
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-list>
        </v-card-text>
      </v-card>
      <v-skeleton-loader v-else elevation="2"  type="card" class='fill-height d-block'/>
    </v-col>
  </v-row>
</template>