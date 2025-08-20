import {
  DOCUMENT,
  Injectable,
  signal,
  WritableSignal,
  inject,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSignal: WritableSignal<'light' | 'dark'>;
  readonly _DOCUMENT = inject(DOCUMENT);

  constructor() {
    const saved =
      (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    this.themeSignal = signal<'light' | 'dark'>(saved);
    this.applyTheme(saved);
  }

  get theme() {
    return this.themeSignal.asReadonly();
  }

  toggleTheme() {
    const next = this.themeSignal() === 'light' ? 'dark' : 'light';
    this.themeSignal.set(next);
    localStorage.setItem('theme', next);
    this.applyTheme(next);
  }

  private applyTheme(mode: 'light' | 'dark') {
    const htmlEl = this._DOCUMENT.documentElement;
    htmlEl.classList.toggle('dark', mode === 'dark');
  }
}
