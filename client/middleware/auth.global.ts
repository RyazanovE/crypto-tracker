export default defineNuxtRouteMiddleware((to, _from) => {
  const isLoggedIn = useCookie('isLoggedIn').value === 'true';

  if (!isLoggedIn && to.path !== '/login') {
    return navigateTo('/login');
  }
});