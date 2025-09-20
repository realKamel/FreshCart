import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitter',
})
export class SplitterPipe implements PipeTransform {
  transform(value: string, count: number): string {
    return value.split(' ', count).join(' ');
  }
}
