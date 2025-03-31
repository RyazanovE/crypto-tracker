<script setup lang='ts'>
import type { Coin } from '~/repository/modules/portfolio';

interface Props {
  title: string;
  coin?: Coin
}

defineProps<Props>();
</script>


<template>
  <v-card v-if='coin' class="bg-primary fill-height rounded-lg shadow-2xl">
    <v-card-title class="text-h5 font-weight-bold white--text">
      {{ title }}
    </v-card-title>

    <v-card-text>
      <div class="text-h6 font-weight-bold white--text mb-2">
        {{ coin.symbol }}
      </div>

      <div class="d-flex justify-between align-center">
        <div class="text-h6 white--text">
          Price Change:
          <span
            :class="{ 'text-success': coin.priceChange > 0, 'text-error': coin.priceChange < 0 }">
            {{ coin.priceChange.toLocaleString() }}%
          </span>
        </div>
        <div class="text-h6 white--text">
          Profit/Loss:
          <span
            :class="{ 'text-success': coin.profitLoss > 0, 'text-error': coin.profitLoss < 0 }">
            {{ coin.profitLoss.toLocaleString() }} $
          </span>
        </div>
      </div>
    </v-card-text>
  </v-card>
  <v-skeleton-loader v-else :height='186.4' type="article" :elevation='2'/>
</template>