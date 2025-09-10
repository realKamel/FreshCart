import { isPlatformBrowser } from '@angular/common';
import {
  DOCUMENT,
  Injectable,
  signal,
  WritableSignal,
  inject,
  PLATFORM_ID,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeSignal: WritableSignal<'light' | 'dark'> =
    signal('light');
  private readonly _DOCUMENT = inject(DOCUMENT);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.themeSignal = signal(
        localStorage.getItem('theme') as 'light' | 'dark',
      );
      this.applyTheme(this.themeSignal());
    }
  }

  get theme() {
    return this.themeSignal.asReadonly();
  }
  toggleTheme() {
    this.themeSignal.update((currentTheme) =>
      currentTheme !== 'light' ? 'light' : 'dark',
    );
    localStorage.setItem('theme', this.themeSignal());
    console.count(this.themeSignal());
    this.applyTheme(this.themeSignal());
  }

  private applyTheme(mode: 'light' | 'dark') {
    const el = this._DOCUMENT.documentElement;
    // console.log(el);
    el.classList.toggle('dark', mode === 'dark');
  }
}
