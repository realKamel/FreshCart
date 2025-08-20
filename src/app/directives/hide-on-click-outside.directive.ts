import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  output,
} from '@angular/core';

@Directive({
  selector: '[appHideOnClickOutside]',
})
export class HideOnClickOutsideDirective {
  readonly hideOnClickOutside = output<void>();

  //grants direct access to the host DOM element through its nativeElement property.
  readonly _ElementRef = inject(ElementRef);

  @HostListener('document:click', ['$event.target'])
  public hideOnClickFn(target: EventTarget | null): void {
    const isClickedInside = this._ElementRef.nativeElement.contains(target);
    console.log(isClickedInside);
    if (!isClickedInside) {
      this.hideOnClickOutside.emit();
    }
  }
}
