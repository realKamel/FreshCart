import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleArrowLeft,
  lucideCircleCheckBig,
  lucideCircleX,
  lucideFileUser,
  lucideLoaderCircle,
  lucideShieldEllipsis,
} from '@ng-icons/lucide';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { toast } from 'ngx-sonner';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-forget-password',
  imports: [NgIcon, ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
  viewProviders: [
    provideIcons({
      lucideShieldEllipsis,
      lucideCircleCheckBig,
      lucideFileUser,
      lucideCircleX,
      lucideLoaderCircle,
      lucideCircleArrowLeft,
    }),
  ],
})
export class ForgetPasswordComponent implements OnDestroy {
  protected readonly stepCounter = signal(1);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  protected email = new FormControl<string>('', [
    Validators.required,
    Validators.email,
  ]);
  protected resetCode = new FormControl<number>(0, [
    Validators.required,
    Validators.pattern(/^[\d]{1,6}$/),
  ]);
  protected newPassword = new FormControl(null, [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
  ]);
  protected changeLineWidth$ = computed(() => {
    if (this.stepCounter() == 2) return 'w-1/2';
    else if (this.stepCounter() == 3) return 'w-full';
    else return 'w-0';
  });
  isInvalid(control: string): boolean {
    if (control === 'email') {
      return !!(this.email?.errors && (this.email.touched || this.email.dirty));
    } else if (control === 'resetCode') {
      return !!(
        this.resetCode?.errors &&
        (this.resetCode.touched || this.resetCode.dirty)
      );
    } else {
      return !!(
        this.newPassword?.errors &&
        (this.newPassword.touched || this.newPassword.dirty)
      );
    }
  }
  getErrors(control: string, validationName: string): boolean {
    if (control === 'email') {
      return (
        !!(this.email?.touched || this.email?.dirty) &&
        this.email?.getError(validationName)
      );
    } else if (control === 'resetCode') {
      return (
        !!(this.resetCode?.touched || this.resetCode?.dirty) &&
        this.resetCode?.getError(validationName)
      );
    } else {
      return (
        !!(this.newPassword?.touched || this.newPassword?.dirty) &&
        this.newPassword?.getError(validationName)
      );
    }
  }
  checkEmail() {
    console.log(this.email);
    if (this.email.value !== null && this.email.valid) {
      toast.loading('loading');
      this._AuthService
        .forgetPassword(this.email.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            toast.success(result.message);
            this.stepCounter.update((p) => p + 1);
          },
          error: (err: HttpErrorResponse) => {
            toast.error(err.error.message);
          },
        });
    }
  }
  checkResetCode() {
    if (this.resetCode.valid) {
      this._AuthService
        .verifyResetCode(this.resetCode.value ?? 0)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this.stepCounter.update((p) => p + 1);
            toast.info(result.status);
          },
          error: (err: HttpErrorResponse) => {
            toast.error(err.error.message);
          },
        });
    }
  }
  resetPassword() {
    if (this.email.value && this.newPassword.value) {
      this._AuthService
        .resetPassword(this.email.value, this.newPassword.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            toast.success('Password Updated');
            this._Router.navigate(['/auth', 'log-in']);
          },
          error: (err: HttpErrorResponse) => {
            toast.error(err.error.message);
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
