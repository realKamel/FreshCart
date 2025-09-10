import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { IProduct } from '../../interfaces/iproduct';
import { NgIcon } from '@ng-icons/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-product-card',
  imports: [NgIcon, RouterLink, CurrencyPipe, TitleCasePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductCardComponent implements OnDestroy {
  protected readonly _CartService = inject(CartService);
  protected readonly _WishlistService = inject(WishlistService);
  protected readonly isWishlistLoading = signal(false);
  protected readonly isCartLoading = signal(false);
  protected readonly removeWishlistResource =
    this._WishlistService.removeProductFromWishlist;
  public product = input<IProduct>({} as IProduct);
  protected isProductInWishlist = computed(() =>
    this._WishlistService.productsIdInWishlist().includes(this.product().id),
  );
  protected isProductInCart = computed(() =>
    this._CartService.productsIdInCart().includes(this.product().id),
  );
  private readonly destroy = new Subject<void>();
  toggleProductInWishlist(id: string, title: string) {
    const wishlistService = this._WishlistService;

    this.isWishlistLoading.set(true);

    const action$ = this.isProductInWishlist()
      ? wishlistService.removeProductFromWishlist(id)
      : wishlistService.addProductToWishlist(id);

    action$.pipe(takeUntil(this.destroy)).subscribe({
      next: (_result) => {
        this.isWishlistLoading.set(false);

        const action = this.isProductInWishlist() ? 'Removed' : 'Added';

        toast.success(`${action} ${title.split(' ', 3).join(' ')} to Wishlist`);
        wishlistService.userWishlist.set(_result);
      },
      error: () => {
        this.isWishlistLoading.set(false);
      },
    });
  }
  toggleProductToCart(id: string, title: string) {
    const cart = this._CartService;
    this.isCartLoading.set(true);
    const action$ = this.isProductInCart()
      ? cart.removeCartItemById(id)
      : cart.addProductToCart(id);

    action$.pipe(takeUntil(this.destroy)).subscribe({
      next: (_result) => {
        this.isCartLoading.set(false);
        const action = this.isProductInCart() ? 'Removed' : 'Added';
        toast.success(`${action} ${title.split(' ', 3).join(' ')}`);
        this._CartService.userCart.set(_result);
      },
      error: () => {
        this.isCartLoading.set(false);
      },
    });
  }
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
