import { Component, inject, input, output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IAddress } from '../../interfaces/iaddress';

@Component({
  selector: 'app-addresses-modal',
  imports: [],
  templateUrl: './addresses-modal.component.html',
  styleUrl: './addresses-modal.component.css',
})
export class AddressesModalComponent {
  private readonly _AuthService = inject(AuthService);
  addresses = input<IAddress[]>([]);
  isClosed = output<void>();
}
