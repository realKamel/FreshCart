import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideOctagonX, lucideUserRoundPlus } from '@ng-icons/lucide';

@Component({
  selector: 'app-register',
  imports: [NgIcon, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  viewProviders: [provideIcons({ lucideUserRoundPlus, lucideOctagonX })],
})
export class RegisterComponent {}
