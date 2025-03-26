import type { $Fetch, FetchOptions } from 'ofetch';

class FetchFactory<T> {
  private $fetch: $Fetch;
  private isRefreshing = false;
  private refreshTokenPromise: Promise<void> | null = null;

  constructor(fetcher: $Fetch) {
    this.$fetch = fetcher;
  }

  /**
   * The HTTP client is utilized to control the process of making API requests.
   * @param method the HTTP method (GET, POST, ...)
   * @param url the endpoint url
   * @param data the body data
   * @param fetchOptions fetch options
   * @returns
   */
  async call(
    method: string,
    url: string,
    data?: object,
    fetchOptions?: FetchOptions<'json'>,
  ): Promise<T> {
    const response = await this.$fetch(url, {
      method,
      body: data,
      ...fetchOptions,
      retry: 0,
    }).catch((error: { data: unknown, status: number}) => {
      console.error(error);
      return error?.data ?? {error, isError: true };
    });
    if (response?.statusCode === 401) {
      if (url.includes('login')) {
        throw new Error('Invalid credentials');
      }

      return this.handle401(method, url, data, fetchOptions);
    }

    return response;
  }

  private async handle401(
    method: string,
    url: string,
    data?: object,
    fetchOptions?: FetchOptions<'json'>,
  ): Promise<T> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenPromise = this.refreshToken();
    }

    await this.refreshTokenPromise;
    return this.$fetch<T>(url, { method, body: data, ...fetchOptions });
  }

  private async refreshToken(): Promise<void> {
    console.warn('🔄 Токен устарел, обновляем...');

    try {
      await this.$fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      useAuthStore().logout();
    } finally {
      this.isRefreshing = false;
      this.refreshTokenPromise = null;
    }
  }
}

export default FetchFactory;