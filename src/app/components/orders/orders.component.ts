import {
  Component,
  ComponentRef,
  computed,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { OrdersService } from '../../services/orders.service';

import { CurrencyPipe, DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { IOrder } from '../../interfaces/iorder';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit, OnDestroy {
  private readonly _OrdersService = inject(OrdersService);
  protected userOrders = computed(() => this._OrdersService.userOrders());
  private readonly destroy = new Subject<void>();

  readonly orderModal = viewChild('orderModal', { read: ViewContainerRef });
  private orderModalRef?: ComponentRef<OrderDetailsComponent>;
  ngOnInit(): void {
    this._OrdersService
      .getUserOrders()
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (_result) => {
          this._OrdersService.userOrders.set(_result);
        },
      });
  }
  ShowOrderDetails(order: IOrder) {
    this.orderModal()?.clear();
    this.orderModalRef = this.orderModal()?.createComponent(
      OrderDetailsComponent,
    );
    this.orderModalRef?.setInput('order', order);
    this.orderModalRef?.instance.closed.subscribe(() =>
      this.orderModalRef?.destroy(),
    );
  }
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
