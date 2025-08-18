import { Component, inject, OnDestroy, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleX,
  lucideLoaderCircle,
  lucideUserLock,
} from '@ng-icons/lucide';
import { AuthService } from '../../services/auth.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-log-in',
  imports: [ReactiveFormsModule, NgIcon, RouterLink],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css',
  viewProviders: [
    provideIcons({ lucideUserLock, lucideCircleX, lucideLoaderCircle }),
  ],
})
export class LogInComponent implements OnDestroy {
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  readonly isLoading = signal(false);
  userLoginFrom = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    ]),
  });

  isInvalid(controlName: string): boolean {
    const control = this.userLoginFrom.get(controlName);
    return !!(control?.errors && (control.touched || control.dirty));
  }
  getErrors(controlName: string, validationName: string): boolean {
    const control = this.userLoginFrom.get(controlName);
    return (
      !!(control?.touched || control?.dirty) &&
      control?.getError(validationName)
    );
  }
  onUserSubmit() {
    if (this.userLoginFrom.valid) {
      console.log(this.userLoginFrom);
      this.isLoading.set(true);
      this._AuthService
        .signIn(this.userLoginFrom.value)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading.set(false);
          }),
        )
        .subscribe({
          next: (result) => {
            this._AuthService.setUserToken(result.token);
            this._Router.navigate(['home']);
            toast.success(result.message);
          },
          error: (err: HttpErrorResponse) => {
            toast.error(err.error.message);
          },
        });
    } else {
      this.userLoginFrom.markAllAsDirty();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
