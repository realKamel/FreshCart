import { register, SwiperContainer } from 'swiper/element/bundle';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { IProduct } from '../../interfaces/iproduct';

import { ProductCardComponent } from '../product-card/product-card.component';

register();

@Component({
  selector: 'app-products-slider',
  imports: [ProductCardComponent],
  templateUrl: './products-slider.component.html',
  styleUrl: './products-slider.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductsSliderComponent {
  readonly products = input<IProduct[]>(); // list of product to display
  private readonly el = viewChild<ElementRef<SwiperContainer>>('slider');
}
