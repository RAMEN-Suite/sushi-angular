import { Directive, ElementRef, inject, input, InputSignal } from '@angular/core';

@Directive({
  selector: '[suiCodeLine]',
  standalone: true,
  host: {
    '[attr.data-prefix]': 'prefix()',
  },
})
export class SuiCodeLine {
  protected readonly elementRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);
  public readonly prefix: InputSignal<string | number | null> = input<string | number | null>(null);

  public text(): string {
    return this.elementRef.nativeElement.textContent.trimEnd();
  }
}
