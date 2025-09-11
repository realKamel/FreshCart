import { IQueryParameter } from '../../interfaces/iquery-parameters';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { IProductsResult } from '../../interfaces/iproductsresult';
import { CategoriesService } from '../../services/categories.service';
import { BrandsService } from '../../services/brands.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { IProduct } from '../../interfaces/iproduct';
import { ProductCardSkeletonComponent } from '../../components/product-card-skeleton/product-card-skeleton.component';

@Component({
  selector: 'app-products-search',
  imports: [
    ReactiveFormsModule,
    ProductCardComponent,
    ProductCardSkeletonComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit, OnDestroy {
  //injected Services
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _BrandsService = inject(BrandsService);

  //properties
  protected readonly availableCategories = signal<
    { _id: string; name: string }[]
  >([]);
  protected readonly selectedCategoriesId = signal<Set<string>>(new Set());
  protected readonly availableBrands = signal<{ _id: string; name: string }[]>(
    [],
  );
  protected readonly selectedBrandsId = signal<Set<string>>(new Set());
  protected readonly searchWord = signal('');
  protected readonly result = signal<IProductsResult>({} as IProductsResult);
  protected readonly isLoading = signal(false);
  private readonly destroy$ = new Subject<void>();
  protected filteredPriceRange = new FormGroup(
    {
      priceGte: new FormControl(null, Validators.min(0)),
      PriceLte: new FormControl(null),
    },
    (c: AbstractControl) => {
      const priceGte = c.get('priceGte')?.value;
      const priceLte = c.get('PriceLte')?.value;

      // Only validate if BOTH fields have a value
      if (priceGte !== null && priceLte !== null) {
        if (priceGte <= priceLte) {
          return null; // Valid
        } else {
          return { invalidRange: true };
        }
      }
      return null;
    },
  );
  protected readonly sortCriteria = new FormControl(null);
  //methods
  ngOnInit(): void {
    this._ActivatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((p) => {
        if (p.keys.includes('field')) {
          this.getProductsByFieldAndId(
            String(p.get('field')),
            String(p.get('id')),
          );
        } else {
          this.searchWord.set(String(p.get('query')));
          this.getProductByKeyword(this.searchWord());
        }
      });
    this._CategoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (_result) => {
          _result.data
            .map((p) => ({ _id: p._id, name: p.name }))
            .forEach((p) => this.availableCategories().push(p));
        },
      });
    this._BrandsService
      .getAllBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (_result) => {
          _result.data
            .map((p) => ({ _id: p._id, name: p.name }))
            .forEach((p) => this.availableBrands().push(p));
        },
      });
  }
  applyUserFilters(_page?: number) {
    const q: IQueryParameter = {};
    if (this.selectedBrandsId().size > 0) {
      q.brand = [...this.selectedBrandsId()];
    }
    if (this.selectedCategoriesId().size > 0) {
      q.category = [...this.selectedCategoriesId()];
    }
    if (this.filteredPriceRange.valid) {
      q.priceGte = this.filteredPriceRange.controls.priceGte.value ?? undefined;
      q.priceLte = this.filteredPriceRange.controls.PriceLte.value ?? undefined;
    } else {
      this.filteredPriceRange.reset();
    }
    if (this.sortCriteria.value !== null) {
      q.sort = this.sortCriteria.value;
    }
    if (_page) {
      q.page = _page;
    }
    this.isLoading.set(true);
    this._ProductsService
      .getAllProducts(q)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (_result) => {
          this.result.set(_result);
          this.isLoading.set(false);
        },
      });
  }
  getProductsByFieldAndId(field: string, id: string) {
    //FIXME refactor this function
    if (field === 'brand') {
      this.isLoading.set(true);
      this._ProductsService
        .getAllProducts({ brand: id })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (_result) => {
            this.result.set(_result);
            this.isLoading.set(false);
          },
        });
    } else if (field === 'category') {
      this.isLoading.set(true);
      this._ProductsService
        .getAllProducts({ category: id })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (_result) => {
            this.result.set(_result);
            this.isLoading.set(false);
          },
        });
    } else {
      this.getProductByKeyword('');
    }
  }
  getProductByKeyword(query: string | null) {
    this.isLoading.set(true);
    this._ProductsService
      .getAllProducts(null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (_result) => {
          this.result.set(_result);
          if (query) {
            this.result().data = _result.data.filter((p: IProduct) =>
              p.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
            );
          }
          this.isLoading.set(false);
        },
      });
  }

  getNextPage() {
    if (this.result().metadata?.nextPage !== undefined) {
      this.applyUserFilters(this.result().metadata?.nextPage);
    }
  }
  getPrevPage() {
    if (this.result().metadata?.prevPage !== undefined) {
      this.applyUserFilters(this.result().metadata?.prevPage);
    }
  }
  onCategoryChange(id: string, isCheckedEvent: boolean) {
    if (isCheckedEvent) {
      this.selectedCategoriesId().add(id);
    } else {
      this.selectedCategoriesId().delete(id);
    }
  }
  onBrandChange(id: string, isCheckedEvent: boolean) {
    if (isCheckedEvent) {
      this.selectedBrandsId().add(id);
    } else {
      this.selectedBrandsId().delete(id);
    }
  }
  searchInput(searchWord: string) {
    console.log(searchWord);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
