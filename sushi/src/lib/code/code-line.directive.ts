import { Directive, ElementRef, inject, input, InputSignal } from '@angular/core';

@Directive({
  selector: '[suiCodeLine]',
  standalone: true,
  host: {
    '[attr.data-prefix]': 'prefix()',
  },
})
export class CodeLine {
  public readonly prefix: InputSignal<string | number | null> = input<string | number | null>(null);
  protected readonly elementRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);

  public text(): string {
    return this.elementRef.nativeElement.textContent.trimEnd();
  }
}
