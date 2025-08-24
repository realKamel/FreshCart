import {
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
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { register } from 'swiper/element/bundle';
// import { Swiper } from 'swiper/types';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { provideIcons, NgIcon } from '@ng-icons/core';
import {
  lucideCheckCheck,
  lucideHeart,
  lucideLoaderCircle,
  lucidePlus,
  lucideStar,
  lucideTrash2,
} from '@ng-icons/lucide';
import { FormControl, Validators } from '@angular/forms';

register();
@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, NgIcon],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  viewProviders: [
    provideIcons({
      lucidePlus,
      lucideStar,
      lucideHeart,
      lucideLoaderCircle,
      lucideCheckCheck,
      lucideTrash2,
    }),
  ],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private readonly _ProductsService = inject(ProductsService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _CartService = inject(CartService);
  private readonly _WishlistService = inject(WishlistService);
  readonly isProductInCart$ = signal(false);
  readonly isProductInWishlist$ = signal(false);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  readonly product = signal<IProduct>({} as IProduct);
  productCount = new FormControl(1, [Validators.required, Validators.min(1)]);
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
            console.log(value);
          },
          error: (err: HttpErrorResponse) => {
            if (isPlatformBrowser(this._PLATFORM_ID)) {
              toast.error(err.error.message);
            }
          },
        });
      this.isProductInWishlist$.set(
        this._WishlistService
          .userWishlist()
          .data?.some((p) => p._id === this.product()._id),
      );
    }
  }

  toggleItemInCart(id: string) {
    toast.info('loading');
    if (this.isProductInCart$()) {
      this._CartService
        .removeCartItemById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (value) => {
            this._CartService.userCart.set(value);
            this.isProductInCart$.set(false);
            toast.info('Item Removed From Cart');
          },
          error: (err: HttpErrorResponse) => {
            toast.error(err.error.message);
          },
        });
    } else {
      this._CartService
        .addProductToCart(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (value) => {
            this._CartService.userCart.set(value);
            this.isProductInCart$.set(true);
            toast.success('Item Added To Cart');
          },
          error: (err: HttpErrorResponse) => {
            toast.error(err.error.message);
          },
        });
    }
  }
  //FIXME not working well
  toggleItemInWishlist(id: string) {
    toast.info('loading');
    if (this.isProductInWishlist$()) {
      // if in wishlist remove it
      this._WishlistService
        .removeProductFromWishlist(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (value) => {
            this._WishlistService.userWishlist.set(value);
            this.isProductInWishlist$.set(false);
            toast.success('Item Removed From Wishlist');
          },
          error: (err: HttpErrorResponse) => {
            toast.error(err.error.message);
          },
        });
    } else {
      this._WishlistService
        .addProductToWishlist(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (value) => {
            this._WishlistService.userWishlist.set(value);
            this.isProductInWishlist$.set(true);
            toast.success('Item Added To Wishlist');
          },
          error: (err: HttpErrorResponse) => {
            toast.error(err.error.message);
          },
        });
    }
  }
  //TODO Implement this
  changeItemInCartCount() {
    console.log('change Count');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
