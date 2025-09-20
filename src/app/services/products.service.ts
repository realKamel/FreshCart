import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IProductsResult } from '../interfaces/iproductsresult';
import { IProduct } from '../interfaces/iproduct';
import { IQueryParameter } from '../interfaces/iquery-parameters';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly _HttpClient = inject(HttpClient);
  products = signal<IProduct[]>([]);
  getAllProducts(q: IQueryParameter | null): Observable<IProductsResult> {
    if (q) {
      return this._HttpClient.get<IProductsResult>(
        `${environment.baseUrl}/api/v1/products?${this.generateQuery(q)}`,
      );
    } else {
      return this._HttpClient.get<IProductsResult>(
        `${environment.baseUrl}/api/v1/products`,
      );
    }
  }
  getSpecificProduct(id: string): Observable<{ data: IProduct }> {
    return this._HttpClient.get<{ data: IProduct }>(
      `${environment.baseUrl}/api/v1/products/${id}`,
    );
  }
  private generateQuery(queryParams: IQueryParameter): string {
    const query = new URLSearchParams();
    const specialKeys: Record<string, string> = {
      category: 'category[in]',
      priceGte: 'price[gte]',
      priceLte: 'price[lte]',
    };

    Object.entries(queryParams).forEach(([key, value]) => {
      if (!value) return; // Skip null or undefined values

      if (key in specialKeys) {
        if (key === 'category' && Array.isArray(value)) {
          value.forEach((item) => query.append(specialKeys[key], String(item)));
        } else {
          query.append(specialKeys[key], String(value));
        }
      } else if (key === 'brand' && Array.isArray(value)) {
        value.forEach((item) => query.append(key, item));
      } else if (key === 'fields' && Array.isArray(value)) {
        query.append(key, value.join(','));
      } else {
        query.append(key, String(value));
      }
    });

    console.log(query.toString());
    return query.toString();
  }
}
