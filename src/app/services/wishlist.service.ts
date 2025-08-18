/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { IWishlistResponse } from '../interfaces/iwishlist-response';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly _HttpClient = inject(HttpClient);
  userWishlist = signal<IWishlistResponse>({} as IWishlistResponse);
  getLoggedUserWishlist(): Observable<IWishlistResponse> {
    return this._HttpClient.get<IWishlistResponse>(
      `${environment.baseUrl}/api/v1/wishlist`,
    );
  }
  addProductToWishlist(id: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/wishlist`, {
      productId: `${id}`,
    });
  }
  removeProductFromWishlist(id: string): Observable<any> {
    return this._HttpClient.delete(
      `${environment.baseUrl}/api/v1/wishlist/${id}`,
    );
  }
}
