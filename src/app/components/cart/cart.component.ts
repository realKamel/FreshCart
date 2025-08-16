import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { ICartItem } from '../../interfaces/icart-item';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrash } from '@ng-icons/lucide';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [NgIcon, NgOptimizedImage, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  viewProviders: [provideIcons({ lucideTrash })],
})
export class CartComponent implements OnInit, OnDestroy {
  isEmptyCart = computed(
    () => this._CartService.userCart().numOfCartItems == 0,
  );
  private readonly destroy$ = new Subject<void>();
  readonly _CartService = inject(CartService);
  readonly cartItems = computed<ICartItem[]>(
    () => this._CartService.userCart().data.products,
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
        error: (err: HttpErrorResponse) => {
          toast.error(err.error.message);
        },
      });
  }
  checkOutCart() {
    console.log('TODO');
  }
  changeCartItemCount(item: ICartItem, count: number) {
    const itemTitle = item.product.title.split(' ', 3).join(' ');
    if (!this.productCount.valid) {
      toast.error(`Can't change ${itemTitle} to 0`);
    } else if (item.product.quantity >= count) {
      toast.loading(`Change ${itemTitle} To ${count}`);
      this._CartService
        .updateCartItemQuantity(item.product._id, count)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this._CartService.userCart.set(result);
            toast.success(`Updated ${itemTitle} To ${count}`);
          },
          error: (err: HttpErrorResponse) => {
            toast.error(err.error.message);
          },
        });
    } else {
      toast.error(`We Only Have ${item.product.quantity} of ${itemTitle}`);
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
        error(err: HttpErrorResponse) {
          toast.error(err.error.message);
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
        error(err: HttpErrorResponse) {
          toast.error(err.error.message);
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
