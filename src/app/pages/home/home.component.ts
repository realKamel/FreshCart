import { IProduct } from './../../interfaces/iproduct';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { BrandsService } from '../../services/brands.service';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { CategoriesSliderComponent } from '../../components/categories-slider/categories-slider.component';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { ProductsSliderComponent } from '../../components/products-slider/products-slider.component';
import { SwiperOptions } from 'swiper/types';

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
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  //injection
  protected readonly _BrandsService = inject(BrandsService);
  protected readonly _ProductsService = inject(ProductsService);
  protected readonly _CategoriesService = inject(CategoriesService);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);

  //properties
  private readonly destroy$ = new Subject<void>();
  protected readonly images: string[] = Array.from(
    { length: 9 },
    (_, i) => `/images/slider${i + 1}.avif`,
  );
  protected readonly electronicProducts = signal<IProduct[]>([]);
  private readonly brandsSlider =
    viewChild<ElementRef<SwiperContainer>>('brandSlider');

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
  ngAfterViewInit(): void {
    //   grid-rows="2"
    //   grid-fill="row"
    //   scrollbar-hide="true"
    //   free-mode="true"
    //   keyboard="true"
    //   space-between="10"

    // slides-per-view="4"

    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const el = this.brandsSlider()?.nativeElement as SwiperContainer;
      const opt: SwiperOptions = {
        grid: {
          rows: 2,
          fill: 'row',
        },
        scrollbar: { hide: true },
        freeMode: true,
        keyboard: true,
        spaceBetween: 10,
        slidesPerView: 2.5,
        breakpoints: {
          640: {
            slidesPerView: 2.5,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4.5,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 6.5,
            spaceBetween: 10,
          },
        },
      };

      Object.assign(el, opt);
      el.initialize();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
