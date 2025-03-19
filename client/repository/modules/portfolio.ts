import type { FetchOptions } from 'ofetch';
import FetchFactory from '../factory';

type Portfolio = {
  id: number,
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  transactions: any[];
  portfolioCoins: any[];
}

class PortfolioModule extends FetchFactory<Portfolio[]> {
  private RESOURCE = '/portfolio';

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  async get(
  ) {
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
}

export default PortfolioModule;