import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { CategoriesService } from '../../services/categories.service';
import { isPlatformBrowser } from '@angular/common';
import { SwiperOptions } from 'swiper/types';
import { RouterLink } from '@angular/router';

register();
@Component({
  selector: 'app-categories-slider',
  imports: [RouterLink],
  templateUrl: './categories-slider.component.html',
  styleUrl: './categories-slider.component.css',
  host: { ngSkipHydration: 'true' },
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoriesSliderComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  readonly _CategoriesService = inject(CategoriesService);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly destroy$ = new Subject<void>();
  private readonly categoriesSlider =
    viewChild<ElementRef<SwiperContainer>>('swiperContainer');
  ngOnInit(): void {
    this._CategoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this._CategoriesService.categories.set(result);
        },
      });
  }
  ngAfterViewInit(): void {
    // slides-per-view="6"
    // navigation="true"
    // pagination="true"
    // pagination-clickable="true"
    // free-mode="true"
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const el = this.categoriesSlider()?.nativeElement as SwiperContainer;
      const option = {
        slidesPerView: 2.5,
        spaceBetween: 10,
        navigation: true,
        mousewheel: {
          forceToAxis: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 2.5,
            pagination: false,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4.5,
            pagination: { clickable: true },
          },
          1024: {
            slidesPerView: 6.5,
            spaceBetween: 10,
          },
        },
      } as SwiperOptions;

      Object.assign(el, option);
      el.initialize();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
