import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideMenu,
  lucideSearch,
  lucideShoppingCart,
  lucideUser,
} from '@ng-icons/lucide';
@Component({
  selector: 'app-navbar',
  imports: [NgIcon, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  viewProviders: [
    provideIcons({ lucideUser, lucideMenu, lucideShoppingCart, lucideSearch }),
  ],
})
export class NavbarComponent {}
