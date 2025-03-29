export default defineNuxtRouteMiddleware((to, _from) => {
  const isLoggedIn = useCookie('isLoggedIn', { default: () => false }).value === true;

  const authFreeRoutes = [
    '/login',
    '/register',
  ];
  const isAuthRequired = authFreeRoutes.includes(to.path);

  if (isLoggedIn && isAuthRequired) {
    return navigateTo('/');
  }

  if (!isLoggedIn && !isAuthRequired) {
    return navigateTo('/login');
  }
});