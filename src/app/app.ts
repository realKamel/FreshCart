import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './components/footer/footer.component';
import { Subject } from 'rxjs';
import { SpinnerComponent } from './components/tools/spinner/spinner.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster, FooterComponent, SpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('FreshCart');
  readonly isInAuthLayout = signal(false);
  protected readonly toast = toast;
  readonly _AuthService = inject(AuthService);
  readonly _Router = inject(Router);
  private readonly destroy$ = new Subject<void>();
}
