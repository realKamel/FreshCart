import { Component, inject, signal } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IOrders } from '../../interfaces/iorders';

@Component({
  selector: 'app-orders',
  imports: [],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  private readonly _OrdersService = inject(OrdersService);
  protected userOrders = signal({} as IOrders);
  constructor() {
    this._OrdersService
      .getUserOrders()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (_result) => {
          this.userOrders.set(_result);
        },
      });
  }
}
