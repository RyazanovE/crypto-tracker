import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { BinanceKlinesResponse, Candle, ChartData, Series } from './types';
import { API_URL, WEBSOCKET_THROTTLE_INTERVAL, INTERVAL_UPDATE_TIME_MAP } from './constants';

export function useCrypto(symbol = 'btcusdt', interval = '1m') {
  const series = ref<Series>([]);
  const newCandle = ref<ChartData>([]);

  let isMounted = false;
  let ws: WebSocket | null = null;
  let pingInterval: number | null = null;
  let lastWsUpdate = 0;
  let isNewCandleFetching = false;
  const chartOptions = {
    chart: { type: 'candlestick', height: 350, animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: false,
      } }},
    xaxis: { type: 'datetime' },
    yaxis: { tooltip: { enabled: true } },
    title: { text: `${interval} Chart`, align: 'left' },
  };


  const connect = () => {
    ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLocaleLowerCase()}@trade`);

    ws.onmessage = (event) => {
      const now = Date.now();
      if (now - lastWsUpdate < WEBSOCKET_THROTTLE_INTERVAL) return;
      lastWsUpdate = now;

      const data = JSON.parse(event.data);
      const lastCandleTime = series.value[0]?.data[series.value[0].data.length - 1]?.x;
      const isNewCandleFetchReady = now - lastCandleTime > INTERVAL_UPDATE_TIME_MAP[interval as keyof typeof INTERVAL_UPDATE_TIME_MAP];


      if (isNewCandleFetchReady && !isNewCandleFetching) {
        isNewCandleFetching = true;
        fetchNewCandle();
      }

      updateCurrentCandle(data);
    };

    ws.onopen = () => {
      pingInterval = window.setInterval(() => ws?.send(JSON.stringify({ method: 'ping' })), 180_000);
    };

    ws.onclose = () => {
      if (!isMounted) return;

      clearInterval(pingInterval!);
      setTimeout(connect, 1000);
    };
  };

  function updateCurrentCandle(data: any) {
    const currentCandleClose = parseFloat(data.p).toFixed(0);

    const seriesData = series.value[0]!.data;
    const lastSerie = seriesData[seriesData.length - 1];

    if (lastSerie.y) {
      lastSerie.y[3] = currentCandleClose;
    }
  }

  async function fetchSeries(limit = 100) {
    try {
      const response = await fetch(`${API_URL}?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`);
      const klines: BinanceKlinesResponse = await response.json();

      const seriesData: ChartData = [];

      klines.forEach((item) => {
        const candle: Candle = [
          Number(item[1]).toFixed(0),
          Number(item[2]).toFixed(0),
          Number(item[3]).toFixed(0),
          Number(item[4]).toFixed(0),
        ];
        const time = new Date(item[0]!).getTime();

        seriesData.push({ x: time, y: candle });
      });
      return seriesData;
    } catch (error) {
      console.error(error);
    }
  }

  async function updateSeries() {
    const lastHundredCandles = await fetchSeries() ?? [];

    series.value = [{ data: lastHundredCandles }];
  }

  async function fetchNewCandle () {
    newCandle.value = await fetchSeries(1) ?? [];
    series.value[0]?.data.push(newCandle.value[0]);
    setTimeout(() => {
      isNewCandleFetching = false;
    }, 10000);
  }

  async function init() {
    await updateSeries();
    connect();
  }

  onMounted(() => {
    isMounted = true;
    init();
  });

  onBeforeUnmount(() => {
    isMounted = false;
    ws?.close();
    ws = null;
    clearInterval(pingInterval!);
  });

  return { series, chartOptions };
}
