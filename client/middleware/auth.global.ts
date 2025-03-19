export default defineNuxtRouteMiddleware((to, _from) => {
  const isLoggedIn = useCookie('isLoggedIn', { default: () => false }).value === true;


  if (isLoggedIn && to.path === '/login') {
    return navigateTo('/');
  }

  if (!isLoggedIn && to.path !== '/login') {
    return navigateTo('/login');
  }
});