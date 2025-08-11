/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { IUser } from '../interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _HttpClient = inject(HttpClient);
  userData!: IUser;
  readonly isLoggedIn = signal(false);
  signUp(userDate: object): Observable<any> {
    return this._HttpClient.post(
      `${environment.baseUrl}/api/v1/auth/signup`,
      userDate
    );
  }

  signIn(userDate: object): Observable<any> {
    return this._HttpClient.post(
      `${environment.baseUrl}/api/v1/auth/signin`,
      userDate
    );
  }
  forgetPassword(userDate: object): Observable<any> {
    return this._HttpClient.post(
      `${environment.baseUrl}/api/v1/auth/forgotPasswords`,
      userDate
    );
  }
  verifyResetCode(userDate: object): Observable<any> {
    return this._HttpClient.post(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      userDate
    );
  }

  resetPassword(userDate: object): Observable<any> {
    return this._HttpClient.put(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      userDate
    );
  }

  setUserToken(s: string) {
    localStorage.setItem('userToken', s);
    console.log(s);
    this.userData = jwtDecode(s);
  }
  getUserToken() {
    const t = localStorage.getItem('userToken');
    if (t !== null) {
      this.userData = jwtDecode(t);
    }
    return t;
  }

  deleteUserToken() {
    localStorage.removeItem('userToken');
  }
}
