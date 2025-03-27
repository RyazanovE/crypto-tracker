import type { FetchOptions } from 'ofetch';
import FetchFactory from '../factory';

type User = {
  id: number;
}

type LoginPayload = {
  email: string;
  password: string;
}

class AuthModule extends FetchFactory<User[]> {
  private RESOURCE = '/auth';

  /**
   * Return the products as array
   * @param asyncDataOptions options for `useAsyncData`
   * @returns
   */
  async login(
    payload: LoginPayload,
  ) {
    const fetchOptions: FetchOptions<'json'> = {
      headers: {
        'Accept-Language': 'en-US',
      },
    };
    return this.call(
      'POST',
      `${this.RESOURCE}/login`,
      payload,
      fetchOptions,
    ).catch((error: { data: unknown, status: number}) => {
      console.error(error);
      return error?.data ?? { error, isError: true };
    });
  }
}

export default AuthModule;