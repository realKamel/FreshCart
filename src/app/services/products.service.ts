import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IProductsResult } from '../interfaces/iproductsresult';
import { IProduct } from '../interfaces/iproduct';
import { queryParameter } from '../interfaces/query-parameters';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly _HttpClient = inject(HttpClient);
  products = signal<IProduct[]>([]);
  getAllProducts(q: queryParameter | null): Observable<IProductsResult> {
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
  private generateQuery(_query: queryParameter) {
    const query = new URLSearchParams();
    // A map to store custom query formats for specific keys
    const specialKeys = {
      category: 'category[in]',
      priceGte: 'price[gte]',
      priceLte: 'price[lte]',
    };
    for (const key in _query) {
      const value = _query[key as keyof queryParameter];
      if (value) {
        if (key in specialKeys) {
          query.append(
            specialKeys[key as keyof typeof specialKeys],
            String(value),
          );
        } else if (key === 'fields') {
          const wantedFields = (value as string[]).join(',');
          query.append(key, wantedFields);
        } else {
          query.append(key, String(value));
        }
      }
    }
    console.log(query.toString());
    return query.toString();
  }
}
