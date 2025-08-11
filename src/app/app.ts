import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
// import { NgxSpinnerComponent } from 'ngx-spinner';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './components/footer/footer.component';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgxSonnerToaster,
    // NgxSpinnerComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('FreshCart');
  readonly isInAuthLayout = signal(false);
  protected readonly toast = toast;
  readonly _AuthService = inject(AuthService);
  readonly _Router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    // this._AuthService.isLoggedIn.set(true);
    console.log('use is logged in');
  }
}
