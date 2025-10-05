import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  //prerender
  {
    path: 'home',
    renderMode: RenderMode.Prerender,
  },
  //client
  {
    path: 'account/cart',
    renderMode: RenderMode.Client,
  },
  {
    path: 'account/wishlist',
    renderMode: RenderMode.Client,
  },
  {
    path: 'account/orders',
    renderMode: RenderMode.Client,
  },
  {
    path: 'account/profile',
    renderMode: RenderMode.Client,
  },
  {
    path: 'auth/log-in',
    renderMode: RenderMode.Client,
  },
  {
    path: 'auth/register',
    renderMode: RenderMode.Client,
  },
  {
    path: 'auth/forget-password',
    renderMode: RenderMode.Client,
  },
  // anything fallback to SSR
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
