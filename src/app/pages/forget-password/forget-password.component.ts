import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { toast } from 'ngx-sonner';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-forget-password',
  imports: [NgIcon, ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ForgetPasswordComponent implements OnDestroy {
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  protected isEmailCheckLoading = signal(false);
  protected isCodeCheckLoading = signal(false);
  protected isNewPasswordLoading = signal(false);
  protected readonly stepCounter = signal(1);
  private readonly destroy$ = new Subject<void>();
  protected email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  protected resetCode = new FormControl<string>('', [
    Validators.required,
    Validators.pattern(/^\d{6}$/),
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
    if (this.email.value !== null && this.email.valid) {
      this.isEmailCheckLoading.set(true);
      this._AuthService
        .forgetPassword(this.email.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            toast.success(result.message);
            this.stepCounter.update((p) => p + 1);
          },
        });
    }
    this.isEmailCheckLoading.set(false);
  }
  checkResetCode() {
    this.isCodeCheckLoading.set(true);
    if (this.resetCode.valid) {
      this._AuthService
        .verifyResetCode(this.resetCode.value ?? '')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            if (result.statusMsg) {
              toast.error(result.status);
            } else {
              this.stepCounter.update((p) => p + 1);

              toast.info(result.status);
            }
          },
        });
    }
    this.isCodeCheckLoading.set(false);
  }
  resetPassword() {
    this.isNewPasswordLoading.set(true);
    if (this.email.value && this.newPassword.value) {
      this._AuthService
        .resetPassword(this.email.value, this.newPassword.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            toast.success('Password Updated');
            this._Router.navigate(['/auth', 'log-in']);
          },
        });
    }
    this.isNewPasswordLoading.set(false);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
