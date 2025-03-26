import type { FetchOptions } from 'ofetch';
import FetchFactory from '../factory';

export type Portfolio = {
  id: number,
  name: string;
  balance: number;
  allTimeProfit: number;
  bestPerformerCoinId: number;
  worstPerformerCoinId: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  coins: Coin[];
}

export interface Coin {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  averagePrice: number;
  usdtEquivalent: string;
  priceChange?: string;
  currentPrice?: string;
  profitLoss?: string;
}

class PortfolioModule extends FetchFactory<Portfolio> {
  private RESOURCE = '/portfolio';

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  async getPortfolio() {
    const fetchOptions: FetchOptions<'json'> = {
      headers: {
        'Accept-Language': 'en-US',
      },
    };
    return this.call(
      'GET',
      this.RESOURCE,
      undefined,
      fetchOptions,
    );
  }

  async removePortfolioCoin(id: number) {
    const fetchOptions: FetchOptions<'json'> = {
      headers: {
        'Accept-Language': 'en-US',
      },
    };
    return this.call(
      'POST',
      `${this.RESOURCE}/remove-coin`,
      { id },
      fetchOptions,
    );
  }
}

export default PortfolioModule;