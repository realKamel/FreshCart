import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../interfaces/iproduct';
import { toast } from 'ngx-sonner';
import { register } from 'swiper/element/bundle';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, NgIcon],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  protected readonly _ProductsService = inject(ProductsService);
  protected readonly _CartService = inject(CartService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  protected readonly isProductInWishlist = signal(false);
  protected readonly isWishlistLoading = signal(false);
  protected readonly isProductInCart = signal(false);
  protected readonly isCartLoading = signal(false);
  protected readonly _WishlistService = inject(WishlistService);
  readonly product = signal<IProduct>({} as IProduct);
  protected productCount = new FormControl(1, [
    Validators.required,
    Validators.min(1),
  ]);
  private readonly destroy$ = new Subject<void>();
  ngOnInit(): void {
    let id = null;
    this._ActivatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((arg) => {
        id = arg.get('id');
        console.log(id);
      });
    if (id !== null) {
      this._ProductsService
        .getSpecificProduct(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (value) => {
            this.product.set(value.data);
          },
        });
    }
  }

  toggleItemInCart(id: string) {
    const isInCart = this.isProductInCart();
    this.isCartLoading.set(true);
    const request$ = isInCart
      ? this._CartService.removeCartItemById(id)
      : this._CartService.addProductToCart(id);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        toast.success(
          isInCart ? 'Item Removed From Cart' : 'Item Added To Cart',
        );
        this.isCartLoading.set(false);
        this._CartService.userCart.set(value);
        this.isProductInCart.set(!isInCart);
      },
    });
  }
  toggleItemInWishlist(id: string) {
    const isInWishlist = this.isProductInWishlist();
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
        this.isProductInWishlist.set(!isInWishlist);
      },
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      register();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
