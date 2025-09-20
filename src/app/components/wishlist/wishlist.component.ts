import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Subject, takeUntil } from 'rxjs';
import { IProduct } from '../../interfaces/iproduct';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  imports: [ProductCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit, OnDestroy {
  private readonly destroy = new Subject<void>();
  protected products = signal<IProduct[]>([]);
  private readonly _WishlistService = inject(WishlistService);
  ngOnInit(): void {
    this._WishlistService
      .getLoggedUserWishlist()
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (_result) => {
          this._WishlistService.userWishlist.set(_result);
          this.products.set(_result.data as IProduct[]);
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
