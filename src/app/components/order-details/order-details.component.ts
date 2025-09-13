import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
} from '@angular/core';
import { IOrder } from '../../interfaces/iorder';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../interfaces/iproduct';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-order-details',
  imports: [RouterLink, CurrencyPipe, DatePipe, TitleCasePipe, NgIcon],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderDetailsComponent {
  readonly order = input<IOrder>({} as IOrder);
  closed = output<void>();
  castToProduct(product: IProduct | string) {
    return product as IProduct;
  }
}
