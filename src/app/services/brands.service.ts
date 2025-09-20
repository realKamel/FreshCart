import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IBrandResponse } from '../interfaces/ibrand-response';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly _HttpClient = inject(HttpClient);
  readonly brands = signal<IBrandResponse>({} as IBrandResponse);
  getAllBrands(): Observable<IBrandResponse> {
    return this._HttpClient.get<IBrandResponse>(
      `${environment.baseUrl}/api/v1/brands`,
    );
  }

  getSpecificBrand(id: string): Observable<IBrandResponse['data']> {
    return this._HttpClient.get<IBrandResponse['data']>(
      `${environment.baseUrl}/api/v1/brands/${id}`,
    );
  }
}
