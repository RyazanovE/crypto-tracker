import { useLazyAsyncData } from '#imports';

interface UseBinancePricesProps {
  afterFetch?: (data: { symbol: string; price: number }[]) => void;
}

export function useBinancePrices({ afterFetch }: UseBinancePricesProps) {
  return useLazyAsyncData('coins', async () => {
    try {
      const BINANCE_PRICE_URL = 'https://api.binance.com/api/v3/ticker/price';
      const result = await $fetch<{ symbol: string; price: string }[]>(BINANCE_PRICE_URL);

      const filteredData = result
        .filter((coin) => coin.symbol.endsWith('USDT'))
        .map((coin) => ({
          ...coin,
          price: parseFloat(coin.price),
        }));

      if (afterFetch) {
        afterFetch(filteredData);
      }

      return filteredData;
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      return [];
    }
  });
}
