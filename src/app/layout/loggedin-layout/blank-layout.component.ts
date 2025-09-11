import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarLoggedInComponent } from '../../components/navbar-logged-in/navbar-logged-in.component';
import { AuthService } from '../../services/auth.service';
import { ResponsiveBreakpointsService } from '../../services/responsive-breakpoints.service';
import { MobileBottomNavComponent } from '../../components/mobile-bottom-nav/mobile-bottom-nav.component';
@Component({
  selector: 'app-blank-layout',
  imports: [RouterOutlet, NavbarLoggedInComponent, MobileBottomNavComponent],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css',
})
export class BlankLayoutComponent {
  readonly _AuthService = inject(AuthService);
  private readonly _Responsive = inject(ResponsiveBreakpointsService);
  protected readonly isMobile = computed(() => !this._Responsive.isDesktop());
}
