import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { ICartItem } from '../../interfaces/icart-item';
import { toast } from 'ngx-sonner';
import { NgIcon } from '@ng-icons/core';
import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IProduct } from '../../interfaces/iproduct';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-cart',
  imports: [NgIcon, CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  isEmptyCart = computed(
    () => this._CartService.userCart().numOfCartItems == 0,
  );
  private readonly destroy$ = new Subject<void>();
  protected readonly _CartService = inject(CartService);
  protected readonly _OrdersService = inject(OrdersService);
  protected readonly _WishlistService = inject(WishlistService);
  protected readonly isWishlistLoading = signal(false);
  protected readonly isCountLoading = signal(false);
  readonly productsIdInWishlist = computed(() =>
    this._WishlistService.productsIdInWishlist(),
  );
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  readonly cartItems = computed(
    () =>
      this._CartService.userCart().data.products as {
        count: number;
        _id: string;
        product: IProduct;
        price: number;
      }[],
  );
  readonly currentCart = computed(() => this._CartService.userCart());

  ngOnInit(): void {
    this._CartService
      .getUserCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this._CartService.userCart.set(result);
        },
      });
  }
  checkOutCart() {
    this._OrdersService
      .checkOutSession(this.currentCart().cartId, {
        city: 'Giza',
        phone: '01012345678',
        details: '',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          window.open(result.session.url, '_self');
        },
      });
  }
  changeCartItemCount(item: ICartItem, count: number) {
    this.isCountLoading.set(true);
    const itemTitle = (item.product as IProduct).title.split(' ', 3).join(' ');
    if (count <= 0) {
      toast.error(`Can't change ${itemTitle} to 0`);
      return;
    }
    this._CartService
      .updateCartItemQuantity((item.product as IProduct)._id, count)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this._CartService.userCart.set(result);
          toast.success(`Updated ${itemTitle} To ${count}`);
          this.isCountLoading.set(false);
        },
      });
  }
  removeItem(id: string, _title: string) {
    const title = _title.split(' ', 3).join(' ');
    toast.warning(`Removing ${title} From Cart`);
    this._CartService
      .removeCartItemById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this._CartService.userCart.set(result);
          toast.success(`Remove ${title} Successfully`);
        },
      });
  }
  clearCart() {
    this._CartService
      .clearCartItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          toast.success(result.message);
        },
      });
  }
  toggleItemInWishlist(id: string) {
    const isInWishlist = this.productsIdInWishlist().includes(id);
    this.isWishlistLoading.set(true);
    const request$ = isInWishlist
      ? this._WishlistService.removeProductFromWishlist(id)
      : this._WishlistService.addProductToWishlist(id);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        toast.success(
          isInWishlist
            ? 'Item Removed From Wishlist'
            : 'Item Added To Wishlist',
        );
        this.isWishlistLoading.set(false);
        this._WishlistService.userWishlist.set(value);
      },
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
