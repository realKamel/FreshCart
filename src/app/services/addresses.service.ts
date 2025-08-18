import { inject, Injectable, signal } from '@angular/core';
import { IAddressResponse } from '../interfaces/iaddress-response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { IAddress } from '../interfaces/iaddress';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  private readonly _HttpClient = inject(HttpClient);
  userAddresses$ = signal<IAddressResponse>({} as IAddressResponse);
  addNewUserAddresses(address: IAddress): Observable<IAddressResponse> {
    return this._HttpClient.post<IAddressResponse>(
      `${environment.baseUrl}/api/v1/addresses`,
      address,
    );
  }
  removeUserAddressById(id: string): Observable<IAddressResponse> {
    return this._HttpClient.delete<IAddressResponse>(
      `${environment.baseUrl}/api/v1/addresses/${id}`,
    );
  }
  getAllUserAddresses(): Observable<IAddressResponse> {
    return this._HttpClient.get<IAddressResponse>(
      `${environment.baseUrl}/api/v1/addresses`,
    );
  }
  getUserAddressById(id: string): Observable<IAddressResponse> {
    return this._HttpClient.get<IAddressResponse>(
      `${environment.baseUrl}/api/v1/addresses/${id}`,
    );
  }
}
