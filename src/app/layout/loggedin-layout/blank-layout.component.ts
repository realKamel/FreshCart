import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarLoggedInComponent } from '../../components/navbar-logged-in/navbar-logged-in.component';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-blank-layout',
  imports: [RouterOutlet, NavbarLoggedInComponent, NavbarComponent],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css',
})
export class BlankLayoutComponent {
  readonly _AuthService = inject(AuthService);
}
