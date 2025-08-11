import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  lucideBoxes,
  lucideCircleArrowDown,
  lucideCircleUserRound,
  lucideHeart,
  lucideLoaderCircle,
  lucideLogOut,
  lucideMapPinned,
  lucideMenu,
  lucideSearch,
  lucideShoppingCart,
  lucideUser,
  lucideX,
} from '@ng-icons/lucide';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-navbar-logged-in',
  imports: [NgIcon, RouterLink],
  templateUrl: './navbar-logged-in.component.html',
  styleUrl: './navbar-logged-in.component.css',
  viewProviders: [
    provideIcons({
      lucideUser,
      lucideMenu,
      lucideShoppingCart,
      lucideSearch,
      lucideCircleArrowDown,
      lucideHeart,
      lucideBoxes,
      lucideMapPinned,
      lucideCircleUserRound,
      lucideLogOut,
      lucideLoaderCircle,
      lucideX,
    }),
  ],
})
export class NavbarLoggedInComponent implements OnDestroy {
  isMenuCollapsed = signal(true);
  isAddressModalCollapsed = signal(true);
  searchTerm$ = signal('');
  searchResults = signal<string[]>([]);
  isLoading$ = signal(false);
  delayedSearchTerm$ = signal('');
  private readonly destroy$ = new Subject<void>();
  private readonly _ProductsService = inject(ProductsService);
  constructor() {
    toObservable(this.searchTerm$)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.isLoading$.set(true)),
        switchMap((word) => {
          if (!word.trim()) {
            return of([] as string[]);
          }
          return this._ProductsService.getAllProducts(word);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        if (Array.isArray(res)) {
          this.searchResults.set(res);
        } else {
          const filteredValues = res.data
            .map((v) => v.title)
            .filter((title: string) =>
              title.toLowerCase().includes(this.searchTerm$().toLowerCase())
            );

          this.searchResults.set(filteredValues);
          console.log(filteredValues);
        }

        this.isLoading$.set(false);
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  toggleMenu() {
    this.isMenuCollapsed.update((s) => !s);
  }
  Logout() {
    console.log('Log Out User');
  }
  toggleAddressModal() {
    this.isAddressModalCollapsed.update((s) => !s);
  }
}
