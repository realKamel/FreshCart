import { SwiperOptions } from 'swiper/types';
import { register, SwiperContainer } from 'swiper/element/bundle';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { IProduct } from '../../interfaces/iproduct';

import { ProductCardComponent } from '../product-card/product-card.component';
import { isPlatformBrowser } from '@angular/common';

register();

@Component({
  selector: 'app-products-slider',
  imports: [ProductCardComponent],
  templateUrl: './products-slider.component.html',
  styleUrl: './products-slider.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductsSliderComponent implements AfterViewInit {
  readonly products = input<IProduct[]>(); // list of product to display
  private readonly productSlider =
    viewChild<ElementRef<SwiperContainer>>('slider');
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  ngAfterViewInit(): void {
    // keyboard="true"
    // pagination-dynamic-bullets="true"
    // pagination="true"
    // free-mode="true"
    // navigation="true";

    // space-between="10"
    // slides-per-view="5"

    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const el = this.productSlider()?.nativeElement as SwiperContainer;
      const opt: SwiperOptions = {
        keyboard: true,
        mousewheel: {
          forceToAxis: true,
        },
        pagination: {
          dynamicBullets: true,
        },
        spaceBetween: 10,

        navigation: true,
        slidesPerView: 1.5,
        breakpoints: {
          640: {
            slidesPerView: 1.5,
            pagination: false,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4.5,
            pagination: { clickable: true },
            spaceBetween: 15,
          },
        },
      };
      Object.assign(el, opt);
      el.initialize();
    }
  }
}
