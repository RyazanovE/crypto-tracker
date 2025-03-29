import type { FetchOptions } from 'ofetch';
import FetchFactory from '../factory';

type User = {
  id: number;
}

type LoginPayload = {
  email: string;
  password: string;
}

class UserModule extends FetchFactory<User[]> {
  private RESOURCE = '/user';

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  async create(
    payload: LoginPayload,
  ) {
    const fetchOptions: FetchOptions<'json'> = {
      headers: {
        'Accept-Language': 'en-US',
      },
    };
    return this.call(
      'POST',
      `${this.RESOURCE}`,
      payload,
      fetchOptions,
    ).catch((error: { data: unknown, status: number}) => {
      console.error(error);
      return error?.data ?? { error, isError: true };
    });
  }
}

export default UserModule;