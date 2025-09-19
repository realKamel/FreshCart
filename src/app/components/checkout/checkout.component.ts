import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AddressesService } from '../../services/addresses.service';
import { CurrencyPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { INewAddress } from '../../interfaces/inew-address';
import { toast } from 'ngx-sonner';
import { IAddress } from '../../interfaces/iaddress';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnDestroy {
  private readonly _CartService = inject(CartService);
  private readonly _AddressesService = inject(AddressesService);
  private readonly _OrdersService = inject(OrdersService);
  private readonly _Router = inject(Router);

  protected cart = computed(() => this._CartService.userCart());
  protected isAddressLoading = signal(false);
  private readonly userSelectedAddress = signal<IAddress>({} as IAddress);
  protected isSelectedAddress(item: IAddress) {
    return this.userSelectedAddress()._id == item._id;
  }
  protected readonly isSelectedPaymentMethod = signal(false);

  private readonly destroy = new Subject<void>();
  protected readonly newAddressFrom = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    details: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(2000),
    ]),
    phone: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^01[0125]\d{8}$/),
    ]),
    city: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
  });

  protected readonly addresses = computed(
    () => this._AddressesService.userAddresses$().data,
  );

  addNewAddress() {
    console.log(this.newAddressFrom);
    console.log('From Status', this.newAddressFrom.valid);
    this.isAddressLoading.set(true);
    if (this.newAddressFrom.valid) {
      this._AddressesService
        .addNewUserAddresses(this.newAddressFrom.value as INewAddress)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: (result) => {
            toast.success(result.message);
            this.newAddressFrom.reset();
            this.LoadingNewAddress();
          },
        });
    } else {
      toast.error('From Have Incorrect Values');
      this.newAddressFrom.reset();
    }
    this.isAddressLoading.set(false);
  }
  LoadingNewAddress() {
    this._AddressesService
      .getAllUserAddresses()
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (result) => {
          this._AddressesService.userAddresses$.set(result);
        },
      });
  }
  selectAddress(item: IAddress) {
    console.log(item);
    this.userSelectedAddress.set(item);
  }
  payWithCard() {
    this._OrdersService
      .checkOutSession(this.cart().cartId, this.userSelectedAddress())
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (result) => {
          toast.success(result.status);
          window.open(result.session.url, '_self');
        },
      });
  }
  payWithCash() {
    this._OrdersService
      .createCashOrder(this.cart().cartId, this.userSelectedAddress())
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (result) => {
          toast.success(result.status);
          this._Router.navigate(['/account', 'orders']);
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
