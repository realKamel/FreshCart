import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ICartResponse } from '../interfaces/icart-response';
import { IProduct } from '../interfaces/iproduct';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _HttpClient = inject(HttpClient);
  readonly userCart = signal<ICartResponse>({} as ICartResponse);
  readonly productsIdInCart = computed(() => {
    const userCart = this.userCart();

    if (userCart.numOfCartItems === 0) {
      return [];
    }

    const firstProduct = userCart?.data?.products?.[0]?.product;

    switch (typeof firstProduct) {
      case 'string':
        return userCart.data.products.map((p) => p.product as string);
      case 'object':
        return userCart.data.products.map((p) => (p.product as IProduct).id);
      default:
        return [];
    }
  });

  getUserCart(): Observable<ICartResponse> {
    return this._HttpClient.get<ICartResponse>(
      `${environment.baseUrl}/api/v1/cart`,
    );
  }
  clearCartItems(): Observable<{ message: string }> {
    return this._HttpClient.delete<{ message: string }>(
      `${environment.baseUrl}/api/v1/cart`,
    );
  }
  addProductToCart(id: string): Observable<ICartResponse> {
    return this._HttpClient.post<ICartResponse>(
      `${environment.baseUrl}/api/v1/cart`,
      {
        productId: `${id}`,
      },
    );
  }
  removeCartItemById(id: string): Observable<ICartResponse> {
    return this._HttpClient.delete<ICartResponse>(
      `${environment.baseUrl}/api/v1/cart/${id}`,
    );
  }
  updateCartItemQuantity(
    id: string,
    quantity: number,
  ): Observable<ICartResponse> {
    return this._HttpClient.put<ICartResponse>(
      `${environment.baseUrl}/api/v1/cart/${id}`,
      {
        count: `${quantity}`,
      },
    );
  }
}
