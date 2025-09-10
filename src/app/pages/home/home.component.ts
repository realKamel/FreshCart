import { IProduct } from './../../interfaces/iproduct';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { BrandsService } from '../../services/brands.service';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { NgOptimizedImage } from '@angular/common';
import { CategoriesSliderComponent } from '../../components/categories-slider/categories-slider.component';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { ProductsSliderComponent } from '../../components/products-slider/products-slider.component';

register();
@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    NgIcon,
    CategoriesSliderComponent,
    NgOptimizedImage,
    ProductsSliderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, OnDestroy {
  protected readonly _BrandsService = inject(BrandsService);
  protected readonly _ProductsService = inject(ProductsService);
  protected readonly _CategoriesService = inject(CategoriesService);
  private readonly destroy$ = new Subject<void>();
  protected readonly images: string[] = Array.from(
    { length: 9 },
    (_, i) => `/images/slider${i + 1}.avif`,
  );
  protected readonly electronicProducts = signal<IProduct[]>([]);
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
