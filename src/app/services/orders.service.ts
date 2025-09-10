/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { IOrderAddress } from '../interfaces/IOrderAddress';
import { ICheckOutResponse } from '../interfaces/icheckout-response';
import { IOrders } from '../interfaces/iorders';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _AuthService = inject(AuthService);
  getUserOrders(): Observable<IOrders> {
    return this._HttpClient.get<IOrders>(
      `${environment.baseUrl}/api/v1/orders/user/${this._AuthService.userInfo().id}`,
    );
  }
  checkOutSession(
    cartId: string,
    _shippingAddress: IOrderAddress,
  ): Observable<ICheckOutResponse> {
    return this._HttpClient.post<ICheckOutResponse>(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${environment.webAppUrl}`,
      {
        shippingAddress: _shippingAddress,
      },
    );
  }
  createCashOrder(
    cartId: string,
    _shippingAddress: IOrderAddress,
  ): Observable<any> {
    return this._HttpClient.post(
      `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
      {
        shippingAddress: _shippingAddress,
      },
    );
  }
}
