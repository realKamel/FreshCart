import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ResponsiveBreakpointsService } from '../../services/responsive-breakpoints.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfileComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly _ResponsiveBreakpointsService = inject(
    ResponsiveBreakpointsService,
  );
  protected readonly isMobile = computed(
    () => !this._ResponsiveBreakpointsService.isDesktop(),
  );
  protected readonly isLoading = signal(false);
  private readonly destroy$ = new Subject<void>();

  protected readonly userInfo = new FormGroup({
    name: new FormControl<string | null>(this._AuthService.userInfo().name, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    phone: new FormControl<string | null>(null, [
      Validators.required,
      Validators.pattern(/^01[0125]\d{8}$/),
    ]),
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
  });

  protected readonly newPasswordForm = new FormGroup(
    {
      currentPassword: new FormControl<string | null>(
        null,
        Validators.required,
      ),
      password: new FormControl<string | null>(null, [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        ),
      ]),
      rePassword: new FormControl<string | null>(null, Validators.required),
    },
    this.passwordConfirmationCheck,
  );

  passwordConfirmationCheck(control: AbstractControl) {
    if (control.get('password')?.value === control.get('rePassword')?.value) {
      return null;
    }
    return { mismatch: 'true' };
  }
  updateUserInfo() {
    console.log('');
  }

  updateUserPassword() {
    console.log('');
  }
  isInvalid(controlName: string): boolean {
    const control = this.userInfo.get(controlName);
    return !!(control?.errors && (control.touched || control.dirty));
  }
  getErrors(controlName: string, validationName: string): boolean {
    const control = this.userInfo.get(controlName);
    return (
      !!(control?.touched || control?.dirty) &&
      control?.getError(validationName)
    );
  }
}
