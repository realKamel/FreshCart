import { IProduct } from './../../interfaces/iproduct';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { BrandsService } from '../../services/brands.service';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideShoppingCart,
  lucideTrash2,
} from '@ng-icons/lucide';
import { phosphorHeartStraight } from '@ng-icons/phosphor-icons/regular';
import { phosphorHeartStraightFill } from '@ng-icons/phosphor-icons/fill';
import { CurrencyPipe, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { CategoriesSliderComponent } from '../tools/categories-slider/categories-slider.component';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';

register();
@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    NgIcon,
    CategoriesSliderComponent,
    NgOptimizedImage,
    CurrencyPipe,
    TitleCasePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
export class HomeComponent implements OnInit, OnDestroy {
  readonly _BrandsService = inject(BrandsService);
  readonly _ProductsService = inject(ProductsService);
  readonly _CategoriesService = inject(CategoriesService);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly destroy$ = new Subject<void>();
  protected readonly images: string[] = Array.from(
    { length: 9 },
    (_, i) => `/images/slider${i + 1}.avif`,
  );
  protected electronicProducts = signal<IProduct[]>([]);
  ngOnInit(): void {
    this._ProductsService
      .getAllProducts({ limit: 20 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this._ProductsService.products.set(result.data);
        },
      });
    this._BrandsService
      .getAllBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this._BrandsService.brands.set(result);
        },
      });

    //TODO fix this as id will change
    this._ProductsService
      .getAllProducts({
        category: '6439d2d167d9aa4ca970649f',
        sort: '-ratingsQuantity,-ratingsAverage',
        limit: 20,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.electronicProducts.set(result.data);
        },
      });
  }
  //TODO implements these methods
  AddProductToWishlist(id: string) {
    console.log(id);
  }
  isProductInCart(id: string): boolean {
    return id == '5';
  }
  AddProductToCart(id: string) {
    console.log(id);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
