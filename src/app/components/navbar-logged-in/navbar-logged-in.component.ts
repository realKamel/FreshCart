import { HttpErrorResponse } from '@angular/common/http';
import { HideOnClickOutsideDirective } from './../../directives/hide-on-click-outside.directive';
import {
  Component,
  computed,
  // CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { provideIcons, NgIcon } from '@ng-icons/core';
import {
  lucideBoxes,
  lucideCircleArrowDown,
  lucideCircleUserRound,
  lucideHeart,
  lucideLoaderCircle,
  lucideLogOut,
  lucideMapPinned,
  lucideMenu,
  lucideShoppingCart,
  lucideUser,
  lucideX,
} from '@ng-icons/lucide';
import { Subject, takeUntil, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { toast } from 'ngx-sonner';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AddressesService } from '../../services/addresses.service';
import { SearchBarComponent } from '../tools/search-bar/search-bar.component';
import { isPlatformBrowser, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-navbar-logged-in',
  imports: [
    NgIcon,
    RouterLink,
    HideOnClickOutsideDirective,
    SearchBarComponent,
    TitleCasePipe,
  ],
  templateUrl: './navbar-logged-in.component.html',
  styleUrl: './navbar-logged-in.component.css',
  viewProviders: [
    provideIcons({
      lucideUser,
      lucideMenu,
      lucideShoppingCart,
      lucideCircleArrowDown,
      lucideHeart,
      lucideBoxes,
      lucideMapPinned,
      lucideCircleUserRound,
      lucideLogOut,
      lucideLoaderCircle,
      lucideX,
    }),
  ],
})
export class NavbarLoggedInComponent implements OnInit, OnDestroy {
  isMenuCollapsed = signal(true);
  isAddressModalCollapsed = signal(true);
  cartCount = computed(() => this._CartService.userCart().numOfCartItems);
  wishlistItemsCount = computed(
    () => this._WishlistService.userWishlist().count,
  );
  userName = computed(() => this._AuthService.userInfo().name);
  isCartLoading$ = signal(false);
  isWishlistLoading$ = signal(false);
  private readonly _AuthService = inject(AuthService);
  private readonly _WishlistService = inject(WishlistService);
  readonly _CartService = inject(CartService);
  readonly _AddressesService = inject(AddressesService);
  readonly _Router = inject(Router);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly destroy$ = new Subject<void>();
  ngOnInit(): void {
    this._CartService
      .getUserCart()
      .pipe(
        tap(() => this.isCartLoading$.set(true)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (result) => {
          this._CartService.userCart.set(result);
          this.isCartLoading$.set(false);
        },
        error: (err: HttpErrorResponse) => {
          if (isPlatformBrowser(this._PLATFORM_ID)) {
            toast.error(err.error.message);
          }
        },
      });
    console.log(this.cartCount());

    this._WishlistService
      .getLoggedUserWishlist()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this._WishlistService.userWishlist.set(result);
        },
        error: (err: HttpErrorResponse) => {
          if (isPlatformBrowser(this._PLATFORM_ID)) {
            toast.error(err.error.message);
          }
        },
      });
    this._AddressesService
      .getAllUserAddresses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value) => {
          this._AddressesService.userAddresses$.set(value);
        },
        error: (err: HttpErrorResponse) => {
          if (isPlatformBrowser(this._PLATFORM_ID)) {
            toast.error(err.error.message);
          }
        },
      });
  }
  toggleMenu() {
    this.isMenuCollapsed.update((s) => !s);
  }
  Logout() {
    this._AuthService.signOut();
    this._Router.navigate(['/home']);
    toast.info('Logged Out');
  }
  toggleAddressModal() {
    this.isAddressModalCollapsed.update((s) => !s);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
