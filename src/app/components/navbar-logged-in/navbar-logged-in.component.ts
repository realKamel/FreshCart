import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  lucideBoxes,
  lucideCircleArrowDown,
  lucideCircleUserRound,
  lucideHeart,
  lucideLoaderCircle,
  lucideLogOut,
  lucideMapPinned,
  lucideMenu,
  lucideSearch,
  lucideShoppingCart,
  lucideUser,
  lucideX,
} from '@ng-icons/lucide';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';
import { toast } from 'ngx-sonner';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AddressesService } from '../../services/addresses.service';
import { IProduct } from '../../interfaces/iproduct';

@Component({
  selector: 'app-navbar-logged-in',
  imports: [NgIcon, RouterLink],
  templateUrl: './navbar-logged-in.component.html',
  styleUrl: './navbar-logged-in.component.css',
  viewProviders: [
    provideIcons({
      lucideUser,
      lucideMenu,
      lucideShoppingCart,
      lucideSearch,
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
  searchTerm$ = signal('');
  cartCount = computed(() => this._CartService.userCart().numOfCartItems);
  wishlistItemsCount = computed(
    () => this._WishlistService.userWishlist().count,
  );
  userName = computed(() => this._AuthService.userInfo().name);
  searchResults = signal<{ _id: string; title: string }[]>([]);
  isLoading$ = signal(false);
  isCartLoading$ = signal(false);
  isWishlistLoading$ = signal(false);
  delayedSearchTerm$ = signal('');
  private readonly _ProductsService = inject(ProductsService);
  private readonly _AuthService = inject(AuthService);
  private readonly _WishlistService = inject(WishlistService);
  readonly _CartService = inject(CartService);
  readonly _AddressesService = inject(AddressesService);
  readonly _Router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  constructor() {
    toObservable(this.searchTerm$)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.isLoading$.set(true)),
        switchMap((word) => {
          if (!word.trim()) {
            return of([] as IProduct[]);
          }
          return this._ProductsService.getAllProducts(word);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((res) => {
        if (Array.isArray(res)) {
          this.searchResults.set(res);
        } else {
          const filteredValues = res.data
            .filter((v) =>
              v.title.toLowerCase().includes(this.searchTerm$().toLowerCase()),
            )
            .map((v) => ({ _id: v._id, title: v.title }));

          this.searchResults.set(filteredValues);
          console.log(filteredValues);
        }

        this.isLoading$.set(false);
      });
  }
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
      });
    console.log(this.cartCount());

    this._WishlistService
      .getLoggedUserWishlist()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this._WishlistService.userWishlist.set(result);
        },
      });
    this._AddressesService
      .getAllUserAddresses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value) => {
          this._AddressesService.userAddresses$.set(value);
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
}
