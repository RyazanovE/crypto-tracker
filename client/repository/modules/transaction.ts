import type { FetchOptions } from 'ofetch';
import FetchFactory from '../factory';

export interface Transaction {
  id: number
}

export interface TransactionPayload {
  symbol: string;
  type: string;
  price: number;
  amount: number;
  date: string;
  totalSpent: number;
}

class TransactionModule extends FetchFactory<Transaction> {
  private RESOURCE = '/transaction';

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  async addTransaction(
    payload: TransactionPayload,
  ) {
    const fetchOptions: FetchOptions<'json'> = {
      headers: {
        'Accept-Language': 'en-US',
      },
    };
    return this.call(
      'POST',
      this.RESOURCE,
      payload,
      fetchOptions,
    );
  }
}

export default TransactionModule;