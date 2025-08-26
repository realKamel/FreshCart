import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  viewChildren,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HideOnClickOutsideDirective } from '../../../directives/hide-on-click-outside.directive';
import { ProductsService } from '../../../services/products.service';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideCircleArrowDown,
  lucideLoaderCircle,
} from '@ng-icons/lucide';
import { ProductFelids } from '../../../enums/ProductFelids';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [
    RouterLink,
    HideOnClickOutsideDirective,
    NgIcon,
    ReactiveFormsModule,
  ],
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
export class SearchBarComponent implements OnInit, OnDestroy {
  protected searchResults = signal<{ id: string; title: string }[]>([]);
  protected isLoading = signal(false);
  protected isResultsDisplayed = signal(false);
  searchForm = new FormGroup({
    search: new FormControl<string>('', Validators.minLength(2)),
  });
  private readonly _ProductsService = inject(ProductsService);
  protected focusedIndex = signal<number>(-1);
  private searchResultElements = viewChildren<ElementRef>('searchItem');
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly _Router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  //FIXME user should be able to navigate with up/down arrows
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

  ngOnInit(): void {
    this.searchForm.controls.search.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(400),
        tap(() => this.isLoading.set(true)),
      )
      .subscribe((searchValue) => {
        console.log(searchValue);
        if (searchValue?.trim && searchValue !== '') {
          this._ProductsService
            .getAllProducts({
              fields: [ProductFelids.id, ProductFelids.title],
              limit: 200,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (_result) => {
                const res = _result.data;
                if (searchValue != null) {
                  this.searchResults.set(
                    res.filter((p) =>
                      p.title
                        .toLowerCase()
                        .includes(searchValue?.toLowerCase()),
                    ),
                  );
                } else {
                  this.searchResults.set(res);
                }
                this.isLoading.set(false);
                this.isResultsDisplayed.set(true);
              },
            });
        } else {
          this.searchResults.set([]);
          this.isLoading.set(false);
        }
      });
  }
  DetailedSearch() {
    this._Router.navigate(['/search', this.searchForm.controls.search.value]);
    this.hideSearchResult();
  }
  hideSearchResult() {
    this.isResultsDisplayed.set(false);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
