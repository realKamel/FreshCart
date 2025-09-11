import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveBreakpointsService {
  private readonly _BreakpointObserver = inject(BreakpointObserver);
  isDesktop = toSignal(
    this._BreakpointObserver
      .observe(Breakpoints.Web)
      .pipe(map((result) => result.matches)),
  );
}
