import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { IProductsResult } from '../../interfaces/iproductsresult';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideShoppingCart,
  lucideTrash2,
} from '@ng-icons/lucide';
import { phosphorHeartStraightFill } from '@ng-icons/phosphor-icons/fill';
import { phosphorHeartStraight } from '@ng-icons/phosphor-icons/regular';
import {
  CurrencyPipe,
  isPlatformBrowser,
  TitleCasePipe,
} from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-products-search',
  imports: [NgIcon, RouterLink, CurrencyPipe, TitleCasePipe],
  templateUrl: './products-search.component.html',
  styleUrl: './products-search.component.css',
  viewProviders: [
    provideIcons({
      lucideArrowRight,
      phosphorHeartStraight,
      phosphorHeartStraightFill,
      lucideShoppingCart,
      lucideTrash2,
    }),
  ],
})
export class ProductsSearchComponent implements OnInit, OnDestroy {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService);
  protected readonly searchWord = signal('');
  protected readonly result = signal<IProductsResult>({} as IProductsResult);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly destroy$ = new Subject<void>();
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
          this.getProductByKeyWord(this.searchWord());
        }
      });
  }

  getProductsByFieldAndId(field: string, id: string) {
    //FIXME refactor this function
    if (field === 'brand') {
      this._ProductsService
        .getAllProducts({ brand: id })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (_result) => {
            this.result.set(_result);
          },
          error: (err: HttpErrorResponse) => {
            if (isPlatformBrowser(this._PLATFORM_ID)) {
              toast.error(err.error.message);
            }
          },
        });
    } else if (field === 'category') {
      this._ProductsService
        .getAllProducts({ category: id })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (_result) => {
            this.result.set(_result);
          },
          error: (err: HttpErrorResponse) => {
            if (isPlatformBrowser(this._PLATFORM_ID)) {
              toast.error(err.error.message);
            }
          },
        });
    } else {
      this.getProductByKeyWord('');
    }
  }
  getProductByKeyWord(query: string) {
    this._ProductsService
      .getAllProducts(null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (_result) => {
          this.result.set(_result);
          this.result().data.filter((p) =>
            p.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
          );
          console.log(query);
        },
        error: (err: HttpErrorResponse) => {
          if (isPlatformBrowser(this._PLATFORM_ID)) {
            toast.error(err.error.message);
          } else {
            console.error(err.error.message);
          }
        },
      });
  }
  //TODO => implement these functions
  AddProductToWishlist(id: string) {
    console.log(id);
  }
  isProductInCart(id: string): boolean {
    return id == '5';
  }
  AddProductToCart(id: string) {
    console.log(id);
  }
  getNextPage(currentPage: number) {
    console.log(currentPage);
  }
  getPrevPage(currentPage: number) {
    console.log(currentPage);
  }

  searchInput(searchWord: string) {
    console.log(searchWord);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
