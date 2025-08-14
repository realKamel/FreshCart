import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleX,
  lucideLoaderPinwheel,
  lucideUserPlus,
} from '@ng-icons/lucide';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [NgIcon, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  viewProviders: [
    provideIcons({ lucideUserPlus, lucideCircleX, lucideLoaderPinwheel }),
  ],
})
export class RegisterComponent implements OnDestroy {
  private readonly _AuthService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();
  readonly isLoading = signal(false);
  userRegisterFrom = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^01[0125]\d{8}$/),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        ),
      ]),
      rePassword: new FormControl(null),
    },
    this.passwordConfirmationCheck,
  );

  passwordConfirmationCheck(control: AbstractControl) {
    if (control.get('password')?.value === control.get('rePassword')?.value) {
      return null;
    }
    return { mismatch: 'true' };
  }

  isInvalid(controlName: string): boolean {
    const control = this.userRegisterFrom.get(controlName);
    return !!(control?.errors && (control.touched || control.dirty));
  }
  getErrors(controlName: string, validationName: string): boolean {
    const control = this.userRegisterFrom.get(controlName);
    return (
      !!(control?.touched || control?.dirty) &&
      control?.getError(validationName)
    );
  }
  onUserSubmit() {
    if (this.userRegisterFrom.valid) {
      console.log(this.userRegisterFrom);
      this.isLoading.set(true);
      this._AuthService
        .signUp(this.userRegisterFrom.value)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading.set(false);
          }),
        )
        .subscribe({
          next: (result) => {
            toast.success(result.message);
          },
          error: (err: HttpErrorResponse) => {
            toast.error(err.error.message);
          },
        });
    } else {
      this.userRegisterFrom.markAllAsDirty();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
