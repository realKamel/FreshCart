import { HideOnClickOutsideDirective } from './../../directives/hide-on-click-outside.directive';
import {
  Component,
  ComponentRef,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { toast } from 'ngx-sonner';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { TitleCasePipe } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { AddressesModalComponent } from '../addresses-modal/addresses-modal.component';
import { AddressesService } from '../../services/addresses.service';

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
})
export class NavbarLoggedInComponent implements OnInit, OnDestroy {
  //FIXME the dark toggle menu disappears after clicked

  //injections
  private readonly _AuthService = inject(AuthService);
  private readonly _WishlistService = inject(WishlistService);
  protected readonly _CartService = inject(CartService);
  protected readonly _ThemeService = inject(ThemeService);
  private readonly _Router = inject(Router);
  protected readonly _AddressesService = inject(AddressesService);

  //properties
  protected readonly isMenuCollapsed = signal(true);
  protected readonly isAddressModalCollapsed = signal(true);
  protected readonly isUserLoggedIn = computed(
    () => typeof this._AuthService.getToken() === 'string',
  );
  protected readonly cartCount = computed(
    () => this._CartService.userCart().numOfCartItems,
  );
  protected readonly wishlistItemsCount = computed(
    () =>
      this._WishlistService.userWishlist().count ||
      this._WishlistService.productsIdInWishlist().length,
  );
  protected readonly userName = computed(
    () => this._AuthService.userInfo().name,
  );
  protected readonly userAddress = computed(() => {
    return this._AddressesService.userAddresses$()?.data?.[0];
  });
  protected isCartLoading$ = signal(false);
  protected isWishlistLoading$ = signal(false);
  readonly modalAddress = viewChild('addressModal', { read: ViewContainerRef });
  private modalAddressRef?: ComponentRef<AddressesModalComponent>;
  private readonly destroy$ = new Subject<void>();
  ngOnInit(): void {
    if (this.isUserLoggedIn()) {
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
  }
  toggleUserMenu() {
    this.isMenuCollapsed.update((s) => !s);
  }
  Logout() {
    this._AuthService.signOut();
    this._Router.navigate(['/home']);
    toast.info('Logged Out');
  }
  openAddressModal() {
    this.modalAddressRef = this.modalAddress()?.createComponent(
      AddressesModalComponent,
      {},
    );
    this.modalAddressRef?.setInput(
      'addresses',
      this._AddressesService.userAddresses$().data,
    );
    this.modalAddressRef?.instance.isClosed.subscribe(() =>
      this.closeAddressModal(),
    );
  }
  closeAddressModal() {
    this.modalAddressRef?.destroy();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
