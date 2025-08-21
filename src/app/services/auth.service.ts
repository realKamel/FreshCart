import { computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { IAuthResponse } from '../interfaces/Iauthresponse';
import { isPlatformBrowser } from '@angular/common';
import { IJWTPayloadWithUserData } from '../interfaces/ijwtpayload-with-user-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _userToken = signal<string | null>(null);
  readonly getToken = this._userToken.asReadonly();
  setToken(token: string | null) {
    console.warn('token from auth service:', token);
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (token) {
        localStorage.setItem('userToken', token);
      } else {
        localStorage.removeItem('userToken');
      }
      this._userToken.set(token);
    }
  }
  readonly userInfo = computed<IJWTPayloadWithUserData>(() => {
    const token = this._userToken();
    if (token) {
      return jwtDecode<IJWTPayloadWithUserData>(token);
    }
    return {} as IJWTPayloadWithUserData;
  });
  private readonly _HttpClient = inject(HttpClient);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  constructor() {
    //gets token when service created
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.setToken(localStorage.getItem('userToken'));
    }
  }
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
  forgetPassword(userEmail: string): Observable<{
    statusMsg: string;
    message: string;
  }> {
    return this._HttpClient.post<{
      statusMsg: string;
      message: string;
    }>(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, {
      email: userEmail,
    });
  }
  verifyResetCode(resetCode: number): Observable<{ status: string }> {
    return this._HttpClient.post<{ status: string }>(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      { resetCode: resetCode },
    );
  }
  resetPassword(
    email: string,
    newPassword: string,
  ): Observable<{ token: string }> {
    return this._HttpClient.put<{ token: string }>(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      {
        email: email,
        newPassword: newPassword,
      },
    );
  }
  signOut() {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.setToken(null);
    }
  }
}
