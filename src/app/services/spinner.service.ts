import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  readonly isShown = signal<boolean>(false);

  show() {
    this.isShown.set(true);
  }
  hide() {
    this.isShown.set(false);
  }
}
