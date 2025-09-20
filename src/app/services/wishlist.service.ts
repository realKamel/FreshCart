import { IWishlistResponse } from './../interfaces/iwishlist-response';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { IProduct } from '../interfaces/iproduct';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly _HttpClient = inject(HttpClient);

  // computed based on resource
  readonly productsIdInWishlist = computed(() => {
    const res = this.userWishlist();
    const data = res?.data;

    if (!data || data.length === 0) return [];

    return typeof data[0] === 'string'
      ? (data as string[])
      : (data as IProduct[]).map((p) => p._id);
  });
  readonly userWishlist = signal<IWishlistResponse>({} as IWishlistResponse);

  getLoggedUserWishlist(): Observable<IWishlistResponse> {
    return this._HttpClient.get<IWishlistResponse>(
      `${environment.baseUrl}/api/v1/wishlist`,
    );
  }

  addProductToWishlist(id: string) {
    return this._HttpClient.post<IWishlistResponse>(
      `${environment.baseUrl}/api/v1/wishlist`,
      { productId: id },
    );
  }

  removeProductFromWishlist(id: string) {
    return this._HttpClient.delete<IWishlistResponse>(
      `${environment.baseUrl}/api/v1/wishlist/${id}`,
    );
  }
}
