/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICategoriesResponse } from '../interfaces/icategories-response';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly _HttpClient = inject(HttpClient);
  readonly categories = signal<ICategoriesResponse>({} as ICategoriesResponse);
  getAllCategories(): Observable<ICategoriesResponse> {
    return this._HttpClient.get<ICategoriesResponse>(
      `${environment.baseUrl}/api/v1/categories`,
    );
  }
  getSpecificCategory(id: string): Observable<any> {
    return this._HttpClient.get(
      `${environment.baseUrl}/api/v1/categories/${id}`,
    );
  }
  getAllSubCategoriesOnCategory(id: string): Observable<any> {
    return this._HttpClient.get(
      `${environment.baseUrl}/api/v1/categories/${id}/subcategories`,
    );
  }
}
