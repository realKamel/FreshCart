/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriesService {
  private readonly _HttpClient = inject(HttpClient);

  getAllSubCategories(): Observable<any> {
    return this._HttpClient.get(
      `https://route-ecommerce.onrender.com//api/v1/subcategories`,
    );
  }

  getspecificSubCategory(id: string | number): Observable<any> {
    return this._HttpClient.get(
      `${environment.baseUrl}/api/v1/subcategories/${id}`,
    );
  }

  getAllSubCategoriesOnCategory(id: string | number): Observable<any> {
    return this._HttpClient.get(
      `${environment.baseUrl}/api/v1/categories/${id}/subcategories`,
    );
  }
}
