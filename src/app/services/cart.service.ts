/* eslint-disable @typescript-eslint/no-explicit-any */
import { finalize, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private readonly _HttpClient = inject(HttpClient);
  numOfCartItems: WritableSignal<number> = signal(0);
  getLoggedUserCart(): Observable<any> {
    return this._HttpClient
      .get(`${environment.baseUrl}/api/v1/cart`)
      .pipe(finalize(() => {}));
  }
  clearUserCart(): Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart`);
  }
  addProductToCart(id: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/cart`, {
      productId: `${id}`,
    });
  }
  removeSpecificCartItem(id: string): Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart/${id}`);
  }
  updateCartProductQuantity(id: string, quantity: number): Observable<any> {
    return this._HttpClient.put(`${environment.baseUrl}/api/v1/cart/${id}`, {
      count: `${quantity}`,
    });
  }
}
