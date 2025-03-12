export const mockPortfolioResponse = {
  current_balance: 15000,
  all_time_profit: 1000,
  cost_basis: 21318.77,
  best_performer: { symbol: 'DOGE', diff: '- $921.94 ▼ 31.94%', diff_trend: 'up' },
  worst_performer: { symbol: 'ETH', diff: '- $921.94 ▼ 31.94%', diff_trend: 'up' },
  balance_history: [{
    data: [{
      x: new Date('2017-02-12').getTime(),
      y: 30,
    }, {
      x: new Date('2018-02-12').getTime(),
      y: 76,
    }],
  }],
  performance: [
    {
      name: 'btc trend',
      data: [
        {
          x: new Date('2023-01-01').getTime(),
          y: 20,
        },
        {
          x: new Date('2024-01-01').getTime(),
          y: 30,
        },
      ]},
    {
      name: 'portfolio',
      data: [
        {
          x: new Date('2023-01-01').getTime(),
          y: 10,
        },
        {
          x: new Date('2024-01-01').getTime(),
          y: 15,
        },
      ]},
  ],
  allocation: {
    series: [10, 50, 40],
    labels: ['btc', 'eth', 'doge'],
  },
  coins: [
    {
      symbol: 'BTCUSDT',
      holdings: 10,
      diff: 10,
      price: 20,
    },
    {
      symbol: 'ETHUSDT',
      holdings: 10,
      diff: 10,
      price: 20,
    },
  ],
};