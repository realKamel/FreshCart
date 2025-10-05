import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LogInComponent } from './pages/log-in/log-in.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layout/loggedin-layout/blank-layout.component';
import { authGuard } from './guards/auth.guard';
import { loggedinGuard } from './guards/loggedin.guard';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { SearchComponent } from './pages/search/search.component';

export const routes: Routes = [
  {
    path: 'allorders',
    redirectTo: 'account/orders',
    pathMatch: 'full',
  },
  {
    path: 'cart',
    redirectTo: 'account/cart',
    pathMatch: 'full',
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      { path: 'home', component: HomeComponent, title: 'Home' },
      { path: 'product/:id', component: ProductDetailsComponent },
      { path: 'search/:query', component: SearchComponent },
      { path: 'search/:field/:id', component: SearchComponent },

      //must be logged in routes
      {
        path: 'account',
        redirectTo: 'account/profile',
        pathMatch: 'full',
      },
      {
        path: 'account',
        title: 'My Account',
        canActivate: [loggedinGuard],
        loadComponent: () =>
          import('./pages/account/account.component').then(
            (c) => c.AccountComponent,
          ),
        children: [
          {
            path: 'profile',
            loadComponent: () =>
              import('./components/profile/profile.component').then(
                (c) => c.ProfileComponent,
              ),
          },
          {
            path: 'wishlist',
            title: 'My Wishlist',

            loadComponent: () =>
              import('./components/wishlist/wishlist.component').then(
                (c) => c.WishlistComponent,
              ),
          },
          {
            path: 'cart',
            title: 'My Cart',
            loadComponent: () =>
              import('./components/cart/cart.component').then(
                (c) => c.CartComponent,
              ),
          },
          {
            path: 'orders',
            title: 'My Orders',
            loadComponent: () =>
              import('./components/orders/orders.component').then(
                (c) => c.OrdersComponent,
              ),
          },
          {
            path: 'checkout',
            title: 'Check Out',
            loadComponent: () =>
              import('./components/checkout/checkout.component').then(
                (c) => c.CheckoutComponent,
              ),
          },
        ],
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [authGuard], // must be logged out
    children: [
      {
        path: 'log-in',
        component: LogInComponent,
        title: 'Log in',
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
      },
      {
        path: 'forget-password',
        title: 'Forget Password',
        loadComponent: () =>
          import('./pages/forget-password/forget-password.component').then(
            (c) => c.ForgetPasswordComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    title: 'Not Found',
    loadComponent: () =>
      import('./pages/notfound/notfound.component').then(
        (c) => c.NotfoundComponent,
      ),
  },
];
