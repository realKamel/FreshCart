import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { ICartItem } from '../../interfaces/icart-item';
import { toast } from 'ngx-sonner';
import { NgIcon } from '@ng-icons/core';

import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProduct } from '../../interfaces/iproduct';

@Component({
  selector: 'app-cart',
  imports: [NgIcon, NgOptimizedImage, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  isEmptyCart = computed(
    () => this._CartService.userCart().numOfCartItems == 0,
  );
  private readonly destroy$ = new Subject<void>();
  readonly _CartService = inject(CartService);
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
  productCount = new FormControl(1, [Validators.required, Validators.min(1)]);
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
    console.log('TODO');
  }
  changeCartItemCount(item: ICartItem, count: number) {
    const itemTitle = (item.product as IProduct).title.split(' ', 3).join(' ');
    if (!this.productCount.valid) {
      toast.error(`Can't change ${itemTitle} to 0`);
    } else if ((item.product as IProduct).quantity >= count) {
      this._CartService
        .updateCartItemQuantity((item.product as IProduct)._id, count)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this._CartService.userCart.set(result);
            toast.success(`Updated ${itemTitle} To ${count}`);
          },
        });
    } else {
      toast.error(
        `We Only Have ${(item.product as IProduct).quantity} of ${itemTitle}`,
      );
    }
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
