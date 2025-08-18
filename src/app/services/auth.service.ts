/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { IUser } from '../interfaces/iuser';
import { IAuthResponse } from '../interfaces/Iauthresponse';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  userInfo = signal<IUser>({} as IUser);
  readonly isLoggedIn = signal(false);
  signUp(userDate: object): Observable<IAuthResponse> {
    return this._HttpClient.post<IAuthResponse>(
      `${environment.baseUrl}/api/v1/auth/signup`,
      userDate,
    );
  }

  signIn(userDate: object): Observable<IAuthResponse> {
    return this._HttpClient.post<IAuthResponse>(
      `${environment.baseUrl}/api/v1/auth/signin`,
      userDate,
    );
  }
  forgetPassword(userDate: object): Observable<any> {
    return this._HttpClient.post(
      `${environment.baseUrl}/api/v1/auth/forgotPasswords`,
      userDate,
    );
  }
  verifyResetCode(userDate: object): Observable<any> {
    return this._HttpClient.post(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      userDate,
    );
  }

  resetPassword(userDate: object): Observable<any> {
    return this._HttpClient.put(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      userDate,
    );
  }

  setUserToken(s: string) {
    localStorage.setItem('userToken', s);
    console.log(s);
    this.userInfo.set(jwtDecode(s));
    this.isLoggedIn.set(true);
  }
  getUserToken(): string | null {
    if (!isPlatformBrowser(this._PLATFORM_ID)) {
      return null;
    }
    const data = localStorage.getItem('userToken');
    if (data !== null) {
      this.userInfo.set(jwtDecode(data));
    } else {
      this.isLoggedIn.set(false);
    }
    return data;
  }

  signOut() {
    localStorage.removeItem('userToken');
    this.isLoggedIn.set(false);
  }
}
