import type { FetchOptions } from 'ofetch';
import { $fetch } from 'ofetch';
import AuthModule from '~/repository/modules/auth';
import PortfolioModule from '~/repository/modules/portfolio';

export default defineNuxtPlugin((_nuxtApp) => {
  const fetchOptions: FetchOptions = {
    baseURL: useRuntimeConfig().public.API_BASE_URL,
    credentials: 'include',
  };

  const apiFetcher = $fetch.create(fetchOptions);

  const modules = {
    auth: new AuthModule(apiFetcher),
    portfolio: new PortfolioModule(apiFetcher),
  };

  return {
    provide: {
      api: modules,
    },
  };
});