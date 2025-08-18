import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { BrandsService } from '../../services/brands.service';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { RouterLink } from '@angular/router';

register();
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly _BrandsService = inject(BrandsService);
  ngOnInit(): void {
    this._BrandsService
      .getAllBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this._BrandsService.brands.set(result);
        },
        error: (err: HttpErrorResponse) => {
          toast.error(err.error.message);
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
