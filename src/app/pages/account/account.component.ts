import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AddressesService } from '../../services/addresses.service';

@Component({
  selector: 'app-account',
  imports: [NgIcon, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountComponent {
  private readonly _cartService = inject(CartService);
  private readonly _wishlistService = inject(WishlistService);
  private readonly _AddressesService = inject(AddressesService);
  protected readonly cartCount = computed(
    () => this._cartService.productsIdInCart().length,
  );
  protected readonly wishlistCount = computed(
    () => this._wishlistService.productsIdInWishlist().length,
  );
  protected readonly addressesCount = computed(() => [
    this._AddressesService.userAddresses$().data.length,
  ]);
}
