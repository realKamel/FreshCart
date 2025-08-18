import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IProductsResult } from '../interfaces/iproductsresult';
import { IProduct } from '../interfaces/iproduct';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly _HttpClient = inject(HttpClient);
  products = signal<IProduct[]>([]);
  getAllProducts(searchWord: string): Observable<IProductsResult> {
    if (searchWord == null || searchWord.length == 0) {
      return this._HttpClient.get<IProductsResult>(
        `${environment.baseUrl}/api/v1/products?limit=1000`,
      );
    } else {
      return this._HttpClient.get<IProductsResult>(
        `${environment.baseUrl}/api/v1/products`,
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSpecificProduct(id: string): Observable<any> {
    return this._HttpClient.get<IProduct>(
      `${environment.baseUrl}/api/v1/products/${id}`,
    );
  }
}
