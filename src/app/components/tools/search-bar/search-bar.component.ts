import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HideOnClickOutsideDirective } from '../../../directives/hide-on-click-outside.directive';
import { ProductsService } from '../../../services/products.service';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  of,
  takeUntil,
  Subject,
} from 'rxjs';
import { IProduct } from '../../../interfaces/iproduct';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideCircleArrowDown,
  lucideLoaderCircle,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-search-bar',
  imports: [RouterLink, HideOnClickOutsideDirective, NgIcon],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  viewProviders: [
    provideIcons({
      lucideSearch,
      lucideCircleArrowDown,
      lucideLoaderCircle,
    }),
  ],
})
export class SearchBarComponent implements OnDestroy {
  searchResults = signal<{ _id: string; title: string }[]>([]);
  isLoading$ = signal(false);
  searchTerm$ = signal('');
  delayedSearchTerm$ = signal('');
  private readonly _ProductsService = inject(ProductsService);
  private readonly destroy$ = new Subject<void>();
  focusedIndex = signal<number>(-1);
  searchResultElements = viewChildren<ElementRef>('searchItem');
  constructor() {
    toObservable(this.searchTerm$)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.isLoading$.set(true)),
        switchMap((word) => {
          if (!word.trim()) {
            return of([] as IProduct[]);
          }
          return this._ProductsService.getAllProducts(word);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((res) => {
        if (Array.isArray(res)) {
          this.searchResults.set(res);
        } else {
          const filteredValues = res.data
            .filter((v) =>
              v.title.toLowerCase().includes(this.searchTerm$().toLowerCase()),
            )
            .map((v) => ({ _id: v._id, title: v.title }));

          this.searchResults.set(filteredValues);
          console.log(filteredValues);
        }

        this.isLoading$.set(false);
      });
  }

  navigateSearchResultKeyboard(event: KeyboardEvent) {
    //TODO
    // Only handle up/down if results are visible
    if (!this.searchResults().length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = Math.min(
        this.focusedIndex() + 1,
        this.searchResultElements().length - 1,
      );
      this.focusedIndex.set(next);
      this.searchResultElements()[next]?.nativeElement.focus();
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = Math.max(this.focusedIndex() - 1, 0);
      this.focusedIndex.set(prev);
      this.searchResultElements()[prev]?.nativeElement.focus();
    }
  }

  clearSearchInput() {
    console.log(this.searchTerm$());
    this.searchTerm$.set('');
    this.delayedSearchTerm$.set('');
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
