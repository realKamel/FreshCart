import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layout/loggedin-layout/blank-layout.component';
import { authGuard } from './guards/auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { loggedinGuard } from './guards/loggedin.guard';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductsSearchComponent } from './components/products-search/products-search.component';

export const routes: Routes = [
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
      { path: 'search/:query', component: ProductsSearchComponent },
      { path: 'search/:field/:id', component: ProductsSearchComponent },

      //must be logged in routes
      {
        path: 'cart',
        component: CartComponent,
        canActivate: [loggedinGuard],
        title: 'Cart',
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [authGuard],
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
          import('./components/forget-password/forget-password.component').then(
            (c) => c.ForgetPasswordComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    title: 'Not Found',
    loadComponent: () =>
      import('./components/notfound/notfound.component').then(
        (c) => c.NotfoundComponent,
      ),
  },
];
