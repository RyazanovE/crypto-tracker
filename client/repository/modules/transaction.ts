import type { FetchOptions } from 'ofetch';
import FetchFactory from '../factory';
import type { Coin } from './portfolio';

export interface Transaction {
  id: number;
  type: string;
  amount: string;
  price: string;
  createdAt: Date;
  coin: Coin;
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

  async getAllTransactions(skip?: number, take?: number) {
    const fetchOptions: FetchOptions<'json'> = {
      headers: {
        'Accept-Language': 'en-US',
      },
      params: {
        skip: skip ?? 0,
        take: take ?? 10,
      },
    };
    return this.call(
      'GET',
      this.RESOURCE,
      undefined,
      fetchOptions,
    ) as unknown as Transaction[];
  }
}

export default TransactionModule;