import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces/iproduct';

@Pipe({
  name: 'searchFilter',
  standalone: true,
})
export class SearchFilterPipe implements PipeTransform {
  transform(arrOfData: IProduct[], term: string): IProduct[] {
    return arrOfData.filter((item) =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );
  }
}
